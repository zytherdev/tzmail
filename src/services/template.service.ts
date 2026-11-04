import { createHash } from 'node:crypto';
import { ITemplate, ITemplateConfig } from '../core/interfaces/template.interface';
import { TemplateFactory } from '../factories/template-factory';
import { ThemeType } from '../core/enums/theme.enum';

interface TemplateCache {
  template: ITemplate;
  createdAt: Date;
  expiresAt: Date;
  hits: number;
}

export interface ITemplateServiceOptions {
  /** Cache ligado por padrão; pode ser desligado por chamada. */
  cache?: boolean;
  /** TTL em segundos. Zero desabilita o cache para aquela criação; valores negativos/não finitos são inválidos. */
  cacheTTL?: number;
  validateConfig?: boolean;
  /** Mantido por compatibilidade. A transformação destrutiva foi desativada. */
  minify?: boolean;
  preview?: boolean;
  /** Limite de templates em cache; padrão finito de 100. */
  maxCacheEntries?: number;
  /** Limite de IDs de template guardados no histórico; padrão finito de 100. */
  maxHistoryEntries?: number;
  /** Máximo de versões por ID de template; padrão 10. */
  maxVersionsPerTemplate?: number;
}

type TemplateOptions = ITemplateServiceOptions;

const VALID_THEMES = Object.values(ThemeType);
const SAFE_LANGUAGE_TAG = /^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/;
const SAFE_COLOR = /^(#[\da-f]{3,8}|[a-z]{1,24}|(?:rgb|rgba|hsl|hsla)\([\d.%\s,+/-]+\))$/i;
const SAFE_COLOR_NAMES = new Set(('transparent inherit currentcolor aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgrey darkgreen darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray grey green greenyellow honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgrey lightgreen lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen').split(' '));
const SOCIAL_PLATFORMS = new Set([
  'facebook', 'twitter', 'linkedin', 'github', 'instagram', 'youtube', 'tiktok', 'pinterest', 'reddit',
  'gitlab', 'stackoverflow', 'medium', 'dribbble', 'behance', 'telegram'
]);

function cloneConfig<T>(value: T): T {
  if (value === undefined || value === null) return value;
  return JSON.parse(JSON.stringify(value)) as T;
}

function canonicalize(value: any): any {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((result, key) => {
      result[key] = canonicalize(value[key]);
      return result;
    }, {} as Record<string, any>);
  }
  return value;
}

function isSafeColor(value: unknown): boolean {
  if (typeof value !== 'string' || !SAFE_COLOR.test(value.trim())) return false;
  const normalized = value.trim().toLowerCase();
  return normalized.startsWith('#') || normalized.startsWith('rgb') || normalized.startsWith('hsl') || SAFE_COLOR_NAMES.has(normalized);
}

function hasTemplatePlaceholder(value: unknown): boolean {
  return typeof value === 'string' && /\{\{\s*[A-Za-z0-9_.-]+\s*\}\}/.test(value);
}

function assertSafeUrl(value: unknown, allowMailto: boolean, field: string): void {
  if (typeof value !== 'string' || !value.trim() || /[\u0000-\u0020"'<>\\]/.test(value)) {
    throw new Error(`${field} must be a valid URL`);
  }
  let parsed: URL;
  try { parsed = new URL(value); } catch { throw new Error(`${field} must be an absolute URL`); }
  const allowed = allowMailto ? ['http:', 'https:', 'mailto:'] : ['http:', 'https:'];
  if (!allowed.includes(parsed.protocol.toLowerCase())) throw new Error(`${field} uses an unsafe URL scheme`);
}

/**
 * TemplateService - criação, renderização e gestão de templates de email.
 * Cache e histórico mantêm limites finitos e retornam snapshots defensivos.
 */
export class TemplateService {
  private templateCache = new Map<string, TemplateCache>();
  private templateHistory = new Map<string, ITemplate[]>();
  private cacheRequests = 0;
  private cacheHits = 0;
  private readonly options: Required<TemplateOptions>;
  private cleanupTimer: ReturnType<typeof setInterval>;

  constructor(options: TemplateOptions = {}) {
    this.options = {
      cache: true,
      cacheTTL: 3600,
      validateConfig: true,
      minify: false,
      preview: false,
      maxCacheEntries: 100,
      maxHistoryEntries: 100,
      maxVersionsPerTemplate: 10,
      ...options
    };
    this.validateLimit(this.options.maxCacheEntries, 'maxCacheEntries');
    this.validateLimit(this.options.maxHistoryEntries, 'maxHistoryEntries');
    this.validateLimit(this.options.maxVersionsPerTemplate, 'maxVersionsPerTemplate');
    this.cleanupTimer = setInterval(() => this.cleanExpiredCache(), 3600000);
    this.cleanupTimer.unref?.();
  }

  createTemplate(themeType: ThemeType, variant: 'light' | 'dark', config: ITemplateConfig, options?: TemplateOptions): ITemplate {
    this.assertThemeAndVariant(themeType, variant);
    if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error('Template config must be an object');
    if (options?.validateConfig ?? this.options.validateConfig) this.validateTemplateConfig(config);

    const templateId = this.generateTemplateId(themeType, variant, config);
    const cacheEnabled = options?.cache ?? this.options.cache;
    const ttlSeconds = options?.cacheTTL ?? this.options.cacheTTL;
    if (!Number.isFinite(ttlSeconds) || ttlSeconds < 0) throw new Error('cacheTTL must be a finite non-negative number');
    if (options?.maxCacheEntries !== undefined) this.validateLimit(options.maxCacheEntries, 'maxCacheEntries');
    if (options?.maxHistoryEntries !== undefined) this.validateLimit(options.maxHistoryEntries, 'maxHistoryEntries');
    if (options?.maxVersionsPerTemplate !== undefined) this.validateLimit(options.maxVersionsPerTemplate, 'maxVersionsPerTemplate');
    const useCache = cacheEnabled && ttlSeconds > 0;

    if (useCache) {
      this.cacheRequests++;
      const cached = this.templateCache.get(templateId);
      if (cached && cached.expiresAt.getTime() > Date.now()) {
        cached.hits++;
        this.cacheHits++;
        // Atualiza ordem para limitar o mapa por LRU aproximado.
        this.templateCache.delete(templateId);
        this.templateCache.set(templateId, cached);
        return this.copyTemplate(cached.template);
      }
      if (cached) this.templateCache.delete(templateId);
    }

    const safeConfig = cloneConfig(config);
    const template = TemplateFactory.createTemplate(themeType, variant, safeConfig);
    const enhanced = this.enhanceTemplate(template, templateId);

    if (useCache) {
      this.templateCache.set(templateId, {
        template: enhanced,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + ttlSeconds * 1000),
        hits: 0
      });
      this.trimCache(options?.maxCacheEntries ?? this.options.maxCacheEntries);
    }
    this.addToHistory(templateId, enhanced, options);
    return this.copyTemplate(enhanced);
  }

  cloneTemplate(template: ITemplate, modifications?: Partial<ITemplateConfig>): ITemplate {
    const newConfig = { ...cloneConfig(template.config), ...cloneConfig(modifications || {}) };
    return this.createTemplate(template.theme, template.variant, newConfig);
  }

  async renderTemplate(template: ITemplate, data: any, options?: { preview?: boolean }): Promise<string> {
    try {
      // _meta é reservado e sempre produzido internamente, nunca aceito do chamador.
      const renderData = {
        ...(data && typeof data === 'object' ? data : {}),
        _meta: {
          isPreview: options?.preview ?? this.options.preview,
          renderDate: new Date().toISOString(),
          templateName: template.name,
          theme: template.theme,
          variant: template.variant
        }
      };
      const html = await template.render(renderData);
      // Minificação global removida: colapsar whitespace corrompia texto pré-formatado e <code>.
      return this.options.minify ? this.minifyHtml(html) : html;
    } catch (error) {
      throw new Error(`Failed to render template: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
    }
  }

  async previewTemplate(themeType: ThemeType, variant: 'light' | 'dark', config: ITemplateConfig, data: any): Promise<string> {
    const template = this.createTemplate(themeType, variant, config, { cache: false });
    return this.renderTemplate(template, data, { preview: true });
  }

  getThemeInfo(themeType: ThemeType): { name: string; description: string; features: string[]; availableVariants: ('light' | 'dark')[]; defaultConfig: Partial<ITemplateConfig> } {
    const info = TemplateFactory.getThemeInfo(themeType);
    const theme = TemplateFactory.getTheme(themeType);
    if (!info || !theme) throw new Error(`Theme ${themeType} not found`);
    return { ...info, availableVariants: ['light', 'dark'], defaultConfig: this.getDefaultConfigForTheme(themeType) };
  }

  listThemes(): ThemeType[] { return TemplateFactory.listThemes(); }

  getTemplateStats(): { totalTemplates: number; cachedTemplates: number; totalHits: number; cacheRequests: number; templatesByTheme: Record<ThemeType, number>; cacheHitRate: number } {
    const templatesByTheme = Object.fromEntries(
      Object.values(ThemeType).map((theme) => [theme, 0])
    ) as Record<ThemeType, number>;
    for (const cache of this.templateCache.values()) {
      templatesByTheme[cache.template.theme]++;
    }
    const totalCached = this.templateCache.size;
    return {
      totalTemplates: this.templateHistory.size,
      cachedTemplates: totalCached,
      totalHits: this.cacheHits,
      cacheRequests: this.cacheRequests,
      templatesByTheme,
      cacheHitRate: this.cacheRequests > 0 ? (this.cacheHits / this.cacheRequests) * 100 : 0
    };
  }

  clearCache(themeType?: ThemeType): number {
    let cleared = 0;
    for (const [id, cache] of this.templateCache.entries()) {
      if (!themeType || cache.template.theme === themeType) {
        this.templateCache.delete(id);
        cleared++;
      }
    }
    return cleared;
  }

  getTemplateHistory(templateId: string): ITemplate[] {
    return (this.templateHistory.get(templateId) || []).map(template => this.copyTemplate(template));
  }

  restoreTemplateVersion(templateId: string, versionIndex: number): ITemplate | null {
    const history = this.templateHistory.get(templateId);
    if (!history || !Number.isInteger(versionIndex) || versionIndex < 0 || versionIndex >= history.length) return null;
    const oldTemplate = history[versionIndex];
    return this.createTemplate(oldTemplate.theme, oldTemplate.variant, oldTemplate.config, { cache: false });
  }

  /** Encerrar o timer de limpeza quando a instância não for mais necessária. */
  dispose(): void { clearInterval(this.cleanupTimer); }

  private validateTemplateConfig(config: ITemplateConfig): void {
    const errors: string[] = [];
    const fail = (fn: () => void) => { try { fn(); } catch (error) { errors.push(error instanceof Error ? error.message : String(error)); } };
    const enumValue = (value: any, allowed: string[], label: string) => {
      if (value !== undefined && !allowed.includes(value)) errors.push(`Invalid ${label}: ${value}`);
    };

    if (config.language !== undefined && (typeof config.language !== 'string' || config.language.length > 63 || !SAFE_LANGUAGE_TAG.test(config.language))) {
      errors.push('Invalid template language tag');
    }
    enumValue(config.direction, ['ltr', 'rtl', 'auto'], 'template text direction');
    enumValue(config.linkDecoration, ['none', 'underline'], 'template linkDecoration');
    if (config.preheader !== undefined && (typeof config.preheader !== 'string' || config.preheader.length > 500 || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(config.preheader))) {
      errors.push('preheader must be a string of at most 500 printable characters');
    }
    enumValue(config.layout, ['full', 'minimal'], 'layout');
    enumValue(config.spacing, ['compact', 'normal', 'relaxed'], 'spacing');
    enumValue(config.borderRadius, ['none', 'small', 'medium', 'large'], 'borderRadius');

    if (config.header) {
      if (typeof config.header.show !== 'boolean') errors.push('header.show must be a boolean');
      if (config.header.logo) {
        enumValue(config.header.logo.type, ['text', 'image'], 'header.logo.type');
        enumValue(config.header.logo.size, ['small', 'medium', 'large'], 'header.logo.size');
        if (config.header.logo.type === 'image' && !hasTemplatePlaceholder(config.header.logo.imageUrl)) fail(() => assertSafeUrl(config.header!.logo!.imageUrl, false, 'header.logo.imageUrl'));
        if (config.header.logo.type === 'text' && typeof config.header.logo.text !== 'string') errors.push('header.logo.text must be a string');
      }
      if (config.header.backgroundColor !== undefined && !isSafeColor(config.header.backgroundColor)) errors.push('Invalid header.backgroundColor');
      if (config.header.textColor !== undefined && !isSafeColor(config.header.textColor)) errors.push('Invalid header.textColor');
    }
    const body = config.body;
    if (body) {
      enumValue(body.alignment, ['left', 'center', 'right'], 'body.alignment');
      enumValue(body.buttonVariant, ['primary', 'secondary', 'success', 'danger'], 'body.buttonVariant');
      if (body.fontSize !== undefined && (!Number.isFinite(body.fontSize) || body.fontSize < 8 || body.fontSize > 72)) errors.push('body.fontSize must be between 8 and 72');
      for (const key of ['backgroundColor', 'textColor'] as const) {
        const color = body[key];
        if (color !== undefined && !isSafeColor(color)) errors.push(`Invalid body.${key}`);
      }
      const buttonUrl = body.buttonUrl;
      if (buttonUrl !== undefined && !hasTemplatePlaceholder(buttonUrl)) fail(() => assertSafeUrl(buttonUrl, true, 'body.buttonUrl'));
      for (const key of ['title', 'message', 'content', 'buttonText'] as const) {
        if (body[key] !== undefined && typeof body[key] !== 'string') errors.push(`body.${key} must be a string`);
      }
    }
    const footer = config.footer;
    if (footer) {
      if (typeof footer.show !== 'boolean') errors.push('footer.show must be a boolean');
      for (const key of ['backgroundColor', 'textColor'] as const) {
        const color = footer[key];
        if (color !== undefined && !isSafeColor(color)) errors.push(`Invalid footer.${key}`);
      }
      for (const link of footer.links || []) {
        if (!link || typeof link.text !== 'string') errors.push('Footer links require text and URL');
        else if (!hasTemplatePlaceholder(link.url)) fail(() => assertSafeUrl(link.url, true, 'footer link URL'));
      }
      for (const link of footer.socialLinks || []) {
        if (!link || !SOCIAL_PLATFORMS.has(link.platform)) errors.push(`Invalid social platform: ${link?.platform}`);
        else if (!hasTemplatePlaceholder(link.url)) fail(() => assertSafeUrl(link.url, false, 'social link URL'));
      }
      const unsubscribeUrl = footer.unsubscribeUrl;
      if (unsubscribeUrl !== undefined && !hasTemplatePlaceholder(unsubscribeUrl)) fail(() => assertSafeUrl(unsubscribeUrl, true, 'footer.unsubscribeUrl'));
    }
    if (errors.length) throw new Error(`Template configuration validation failed:\n${errors.join('\n')}`);
  }

  private assertThemeAndVariant(themeType: ThemeType, variant: string): void {
    if (!VALID_THEMES.includes(themeType)) throw new Error(`Invalid theme: ${themeType}`);
    if (variant !== 'light' && variant !== 'dark') throw new Error(`Invalid template variant: ${variant}`);
  }

  private generateTemplateId(themeType: ThemeType, variant: 'light' | 'dark', config: ITemplateConfig): string {
    const canonical = JSON.stringify(canonicalize({ theme: themeType, variant, config }));
    return `${themeType}_${variant}_${createHash('sha256').update(canonical).digest('hex')}`;
  }

  private enhanceTemplate(template: ITemplate, templateId: string): ITemplate {
    const enhanced = { ...template } as ITemplate & { getVersion?: () => number; getId?: () => string; clone?: (modifications?: Partial<ITemplateConfig>) => ITemplate };
    enhanced.getVersion = () => this.templateHistory.get(templateId)?.length || 1;
    enhanced.getId = () => templateId;
    enhanced.clone = (modifications?: Partial<ITemplateConfig>) => this.cloneTemplate(enhanced, modifications);
    return enhanced;
  }

  private copyTemplate(template: ITemplate): ITemplate {
    return { ...template, config: cloneConfig(template.config) };
  }

  private addToHistory(templateId: string, template: ITemplate, options?: TemplateOptions): void {
    const history = this.templateHistory.get(templateId) || [];
    history.push(template);
    const perTemplateLimit = options?.maxVersionsPerTemplate ?? this.options.maxVersionsPerTemplate;
    while (history.length > perTemplateLimit) history.shift();
    this.templateHistory.delete(templateId);
    this.templateHistory.set(templateId, history);
    const historyLimit = options?.maxHistoryEntries ?? this.options.maxHistoryEntries;
    while (this.templateHistory.size > historyLimit) {
      const oldest = this.templateHistory.keys().next().value;
      if (oldest === undefined) break;
      this.templateHistory.delete(oldest);
    }
  }

  private trimCache(limit: number): void {
    while (this.templateCache.size > limit) {
      const oldest = this.templateCache.keys().next().value;
      if (oldest === undefined) break;
      this.templateCache.delete(oldest);
    }
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [id, cache] of this.templateCache.entries()) {
      if (cache.expiresAt.getTime() <= now) this.templateCache.delete(id);
    }
  }

  // Mantido como transformação deliberadamente não destrutiva. HTML minification baseada em regex
  // alteraria espaços de texto e conteúdo de <code>/<pre>; minify=true preserva o HTML original.
  private minifyHtml(html: string): string { return html; }

  private validateLimit(value: number, name: string): void {
    if (!Number.isInteger(value) || value < 1) throw new Error(`${name} must be a positive integer`);
  }

  private getDefaultConfigForTheme(themeType: ThemeType): Partial<ITemplateConfig> {
    const baseConfig: Partial<ITemplateConfig> = {
      header: { show: true, logo: { type: 'text', text: 'MyApp', size: 'medium' } },
      footer: { show: true, copyrightText: `© ${new Date().getFullYear()} MyApp. All rights reserved.` },
      layout: 'full', spacing: 'normal', borderRadius: 'medium'
    };
    switch (themeType) {
      case ThemeType.MONOKAI: return { ...baseConfig, borderRadius: 'small' };
      case ThemeType.MODERN: return { ...baseConfig, borderRadius: 'large', spacing: 'relaxed' };
      case ThemeType.CORPORATE: return { ...baseConfig, borderRadius: 'small' };
      case ThemeType.MINIMAL: return { ...baseConfig, borderRadius: 'none', spacing: 'relaxed' };
      default: return baseConfig;
    }
  }

  async preloadTemplates(templates: Array<{ themeType: ThemeType; variant: 'light' | 'dark'; config: ITemplateConfig }>): Promise<void> {
    await Promise.all(templates.map(({ themeType, variant, config }) => this.createTemplate(themeType, variant, config)));
  }

  exportTemplate(template: ITemplate): string {
    return JSON.stringify({ name: template.name, theme: template.theme, variant: template.variant, config: template.config, exportedAt: new Date().toISOString(), version: (template as any).getVersion?.() || 1 }, null, 2);
  }

  importTemplate(jsonData: string): ITemplate {
    try {
      const data = JSON.parse(jsonData);
      if (!data || typeof data !== 'object' || !VALID_THEMES.includes(data.theme) || !['light', 'dark'].includes(data.variant) || !data.config || typeof data.config !== 'object' || Array.isArray(data.config)) {
        throw new Error('Invalid template data: theme, variant, and config are required and must be valid');
      }
      return this.createTemplate(data.theme, data.variant, data.config);
    } catch (error) {
      throw new Error(`Failed to import template: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
    }
  }

  generateExampleTemplate(themeType: ThemeType = ThemeType.MODERN, variant: 'light' | 'dark' = 'light'): ITemplate {
    const exampleConfig: ITemplateConfig = {
      header: { show: true, logo: { type: 'text', text: 'ExampleApp', size: 'medium' }, backgroundColor: variant === 'light' ? '#ffffff' : '#1a1a1a', textColor: variant === 'light' ? '#111827' : '#f9fafb' },
      footer: {
        show: true,
        links: [ { text: 'Privacy Policy', url: 'https://example.com/privacy' }, { text: 'Terms of Service', url: 'https://example.com/terms' }, { text: 'Contact', url: 'https://example.com/contact' } ],
        socialLinks: [ { platform: 'twitter', url: 'https://twitter.com/example' }, { platform: 'github', url: 'https://github.com/example' }, { platform: 'linkedin', url: 'https://linkedin.com/company/example' } ],
        copyrightText: `© ${new Date().getFullYear()} ExampleApp. All rights reserved.`, unsubscribeText: 'Unsubscribe',
        backgroundColor: variant === 'light' ? '#f9fafb' : '#111827', textColor: variant === 'light' ? '#6b7280' : '#9ca3af'
      },
      layout: 'full', spacing: 'normal', borderRadius: themeType === ThemeType.MINIMAL ? 'none' : 'medium'
    };
    return this.createTemplate(themeType, variant, exampleConfig);
  }

  isValidTemplate(template: any): boolean {
    try {
      if (!template || typeof template !== 'object' || typeof template.name !== 'string' || !VALID_THEMES.includes(template.theme) || !['light', 'dark'].includes(template.variant) || !template.config || typeof template.config !== 'object' || typeof template.render !== 'function') return false;
      this.validateTemplateConfig(template.config);
      return true;
    } catch { return false; }
  }

  getTemplateDetails(templateId: string): { template: ITemplate | null; history: ITemplate[]; cacheInfo: TemplateCache | null; usageCount: number } {
    const cacheInfo = this.templateCache.get(templateId) || null;
    const history = (this.templateHistory.get(templateId) || []).map(template => this.copyTemplate(template));
    const template = cacheInfo?.template || history[history.length - 1] || null;
    return {
      template: template ? this.copyTemplate(template) : null,
      history,
      cacheInfo: cacheInfo ? { ...cacheInfo, template: this.copyTemplate(cacheInfo.template), createdAt: new Date(cacheInfo.createdAt), expiresAt: new Date(cacheInfo.expiresAt) } : null,
      usageCount: cacheInfo?.hits || 0
    };
  }
}
