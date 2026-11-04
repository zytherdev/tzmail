import { ThemeType } from '../core/enums/theme.enum';
import { ITemplate, ITemplateConfig } from '../core/interfaces/template.interface';
import { ITheme } from '../templates/themes/theme.interface';
import { SystemTheme } from '../templates/themes/system.theme';
import { MonokaiTheme } from '../templates/themes/monokai.theme';
import { ModernTheme } from '../templates/themes/modern.theme';
import { CorporateTheme } from '../templates/themes/corporate.theme';
import { MinimalTheme } from '../templates/themes/minimal.theme';
import { TemplateBuilder } from '../templates/base/template-builder';

const SAFE_COLOR = /^(#[\da-f]{3,8}|[a-z]{1,24}|(?:rgb|rgba|hsl|hsla)\([\d.%\s,+/-]+\))$/i;
const SAFE_NAMED_COLORS = new Set(('transparent inherit currentcolor aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgrey darkgreen darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray grey green greenyellow honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgrey lightgreen lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen').split(' '));
function cssColor(value: string | undefined, fallback: string): string {
  if (value === undefined) return fallback;
  const trimmed = value.trim();
  if (!SAFE_COLOR.test(trimmed) || (!trimmed.startsWith('#') && !/^(rgb|rgba|hsl|hsla)\(/i.test(trimmed) && !SAFE_NAMED_COLORS.has(trimmed.toLowerCase()))) {
    throw new Error('Invalid template color value');
  }
  return trimmed;
}
function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!));
}

function interpolate(value: string | undefined, variables: Record<string, unknown>, escapeValues = false): string | undefined {
  if (value === undefined) return undefined;
  return value.replace(/\{\{\s*([A-Za-z0-9_.-]+)\s*\}\}/g, (_placeholder, path: string) => {
    let resolved: unknown = variables;
    for (const segment of path.split('.')) {
      if (resolved === null || typeof resolved !== 'object') throw new Error(`Missing template variable: ${path}`);
      resolved = (resolved as Record<string, unknown>)[segment];
    }
    if (resolved === undefined) throw new Error(`Missing template variable: ${path}`);
    if (resolved !== null && !['string', 'number', 'boolean'].includes(typeof resolved)) {
      throw new Error(`Template variable ${path} must be a string, number, boolean, or null`);
    }
    const text = resolved === null ? '' : String(resolved);
    return escapeValues ? escapeHtml(text) : text;
  });
}

function resolveTemplateConfig(config: ITemplateConfig, variables: Record<string, unknown>): ITemplateConfig {
  return {
    ...config,
    header: config.header ? {
      ...config.header,
      logo: config.header.logo ? {
        ...config.header.logo,
        text: interpolate(config.header.logo.text, variables),
        imageUrl: interpolate(config.header.logo.imageUrl, variables),
        alt: interpolate(config.header.logo.alt, variables)
      } : undefined
    } : undefined,
    body: config.body ? {
      ...config.body,
      title: interpolate(config.body.title, variables),
      message: interpolate(config.body.message, variables),
      // Substitutions inside trusted HTML are escaped before insertion.
      content: interpolate(config.body.content, variables, true),
      buttonText: interpolate(config.body.buttonText, variables),
      buttonUrl: interpolate(config.body.buttonUrl, variables)
    } : undefined,
    footer: config.footer ? {
      ...config.footer,
      links: config.footer.links?.map(link => ({
        text: interpolate(link.text, variables)!,
        url: interpolate(link.url, variables)!
      })),
      socialLinks: config.footer.socialLinks?.map(link => ({
        ...link,
        url: interpolate(link.url, variables)!
      })),
      copyrightText: interpolate(config.footer.copyrightText, variables),
      unsubscribeText: interpolate(config.footer.unsubscribeText, variables),
      unsubscribeUrl: interpolate(config.footer.unsubscribeUrl, variables)
    } : undefined
  };
}

export class TemplateFactory {
  private static themes: Map<ThemeType, ITheme> = new Map([
    [ThemeType.SYSTEM, new SystemTheme()],
    [ThemeType.MONOKAI, new MonokaiTheme()],
    [ThemeType.MODERN, new ModernTheme()],
    [ThemeType.CORPORATE, new CorporateTheme()],
    [ThemeType.MINIMAL, new MinimalTheme()]
  ]);

  static createTemplate(themeType: ThemeType, variant: 'light' | 'dark', config: ITemplateConfig): ITemplate {
    const theme = this.themes.get(themeType);
    if (!theme) throw new Error(`Theme ${themeType} not found`);
    if (variant !== 'light' && variant !== 'dark') throw new Error(`Invalid template variant: ${variant}`);
    if (!config || typeof config !== 'object') throw new Error('Template config must be an object');

    return {
      name: `${themeType}_${variant}`,
      theme: themeType,
      variant,
      config,
      render: async (data: any) => {
        const templateData = data?.templateData && typeof data.templateData === 'object' && !Array.isArray(data.templateData)
          ? data.templateData as Record<string, unknown>
          : {};
        const renderConfig = resolveTemplateConfig(config, templateData);
        const builder = new TemplateBuilder(theme, renderConfig, variant);
        // Renderer usa sempre a configuração capturada. `data` é somente conteúdo variável,
        // nunca uma fonte alternativa de configuração/template.
        const body = renderConfig.body || {};
        const alignment = body.alignment || 'left';
        if (!['left', 'center', 'right'].includes(alignment)) throw new Error('Invalid body alignment');
        const fontSize = body.fontSize ?? 14;
        if (!Number.isFinite(fontSize) || fontSize < 8 || fontSize > 72) throw new Error('Invalid body font size');
        const background = cssColor(body.backgroundColor, 'transparent');
        const textColor = cssColor(body.textColor, 'inherit');
        cssColor(renderConfig.header?.backgroundColor, 'transparent');
        cssColor(renderConfig.header?.textColor, 'inherit');
        cssColor(renderConfig.footer?.backgroundColor, 'transparent');
        cssColor(renderConfig.footer?.textColor, 'inherit');
        const titleFontSize = fontSize + 7;
        // body.content é o único campo da configuração intencionalmente tratado como HTML confiável.
        // Título, mensagem e valores de estilo são sempre escapados/validados e não viram HTML.
        const bodyContent = body.content ?? `
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="padding: 20px; text-align: ${alignment}; background-color: ${background}; color: ${textColor}; font-size: ${fontSize}px;">
                <h2 style="margin: 0 0 16px 0; font-size: ${titleFontSize}px; line-height: 1.3;">${escapeHtml(body.title ?? 'Hello!')}</h2>
                <p style="margin: 0; line-height: 1.6;">${escapeHtml(body.message ?? 'This is an email generated with tzMail.')}</p>
              </td>
            </tr>
          </table>`;

        builder.buildHeader(typeof data?.headerContent === 'string' ? data.headerContent : '').buildBody(bodyContent);
        if (body.buttonText && body.buttonUrl) {
          builder.buildButton(body.buttonText, body.buttonUrl, body.buttonVariant || 'primary');
        }
        return builder.buildFooter().build();
      }
    };
  }

  static getTheme(themeType: ThemeType): ITheme | undefined { return this.themes.get(themeType); }
  static listThemes(): ThemeType[] { return Array.from(this.themes.keys()); }

  static getThemeInfo(themeType: ThemeType): { name: string; description: string; features: string[] } {
    const themeInfo: Record<ThemeType, { name: string; description: string; features: string[] }> = {
      [ThemeType.SYSTEM]: { name: 'System', description: 'Tema limpo e profissional com cores adaptativas', features: ['Design minimalista', 'Alta acessibilidade', 'Compatibilidade total'] },
      [ThemeType.MONOKAI]: { name: 'Monokai', description: 'Inspirado no famoso tema de código, ideal para conteúdo técnico', features: ['Cores vibrantes', 'Destaque de sintaxe', 'Efeitos glow'] },
      [ThemeType.MODERN]: { name: 'Modern', description: 'Design contemporâneo com gradientes e efeitos modernos', features: ['Gradientes elegantes', 'Glassmorphism', 'Animações suaves'] },
      [ThemeType.CORPORATE]: { name: 'Corporate', description: 'Design profissional e elegante para empresas', features: ['Tipografia serifada', 'Detalhes em dourado', 'Layout estruturado'] },
      [ThemeType.MINIMAL]: { name: 'Minimal', description: 'Design clean e focado no conteúdo', features: ['Sem distrações', 'Espaçamento generoso', 'Tipografia limpa'] }
    };
    const info = themeInfo[themeType];
    if (!info) throw new Error(`Theme ${themeType} not found`);
    return info;
  }
}
