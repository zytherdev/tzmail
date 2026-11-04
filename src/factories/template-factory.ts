import { ThemeType } from '../core/enums/theme.enum';
import { ITemplate, ITemplateConfig } from '../core/interfaces/template.interface';
import { ITheme } from '../templates/themes/theme.interface';
import { SystemTheme } from '../templates/themes/system.theme';
import { MonokaiTheme } from '../templates/themes/monokai.theme';
import { ModernTheme } from '../templates/themes/modern.theme';
import { CorporateTheme } from '../templates/themes/corporate.theme';
import { MinimalTheme } from '../templates/themes/minimal.theme';
import { AuroraTheme } from '../templates/themes/aurora.theme';
import { OceanTheme } from '../templates/themes/ocean.theme';
import { SunsetTheme } from '../templates/themes/sunset.theme';
import { LavenderTheme } from '../templates/themes/lavender.theme';
import { ForestTheme } from '../templates/themes/forest.theme';
import { EditorialTheme } from '../templates/themes/editorial.theme';
import { PastelTheme } from '../templates/themes/pastel.theme';
import { NeoBrutalTheme } from '../templates/themes/neobrutal.theme';
import { GlassTheme } from '../templates/themes/glass.theme';
import { MidnightTheme } from '../templates/themes/midnight.theme';
import { TemplateBuilder } from '../templates/base/template-builder';

const SAFE_COLOR = /^(#[\da-f]{3,8}|[a-z]{1,24}|(?:rgb|rgba|hsl|hsla)\([\d.%\s,+/-]+\))$/i;
const SAFE_LANGUAGE_TAG = /^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/;
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
    preheader: interpolate(config.preheader, variables),
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
    [ThemeType.MINIMAL, new MinimalTheme()],
    [ThemeType.AURORA, new AuroraTheme()],
    [ThemeType.OCEAN, new OceanTheme()],
    [ThemeType.SUNSET, new SunsetTheme()],
    [ThemeType.LAVENDER, new LavenderTheme()],
    [ThemeType.FOREST, new ForestTheme()],
    [ThemeType.EDITORIAL, new EditorialTheme()],
    [ThemeType.PASTEL, new PastelTheme()],
    [ThemeType.NEOBRUTAL, new NeoBrutalTheme()],
    [ThemeType.GLASS, new GlassTheme()],
    [ThemeType.MIDNIGHT, new MidnightTheme()]
  ]);

  static createTemplate(themeType: ThemeType, variant: 'light' | 'dark', config: ITemplateConfig): ITemplate {
    const theme = this.themes.get(themeType);
    if (!theme) throw new Error(`Theme ${themeType} not found`);
    if (variant !== 'light' && variant !== 'dark') throw new Error(`Invalid template variant: ${variant}`);
    if (!config || typeof config !== 'object') throw new Error('Template config must be an object');
    if (config.language !== undefined && (typeof config.language !== 'string' || config.language.length > 63 || !SAFE_LANGUAGE_TAG.test(config.language))) {
      throw new Error('Invalid template language tag');
    }
    if (config.direction !== undefined && !['ltr', 'rtl', 'auto'].includes(config.direction)) throw new Error('Invalid template text direction');
    if (config.linkDecoration !== undefined && !['none', 'underline'].includes(config.linkDecoration)) throw new Error('Invalid template linkDecoration');
    if (config.preheader !== undefined && (typeof config.preheader !== 'string' || config.preheader.length > 500 || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(config.preheader))) {
      throw new Error('preheader must be a string of at most 500 printable characters');
    }

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
        const background = cssColor(body.backgroundColor, theme[variant].background);
        const textColor = cssColor(body.textColor, theme[variant].text);
        cssColor(renderConfig.header?.backgroundColor, 'transparent');
        cssColor(renderConfig.header?.textColor, 'inherit');
        cssColor(renderConfig.footer?.backgroundColor, 'transparent');
        cssColor(renderConfig.footer?.textColor, 'inherit');
        const titleFontSize = fontSize + 7;
        const bodyCellStyle = `padding: 0; text-align: ${alignment}; background-color: ${background}; color: ${textColor}; font-size: ${fontSize}px; font-family: ${theme.typography.fontFamily};`;
        const titleStyle = `margin: 0 0 16px 0; color: ${textColor}; font-family: ${theme.typography.fontFamily}; font-size: ${titleFontSize}px; font-weight: ${theme.typography.fontWeights.bold}; line-height: 1.3; text-align: ${alignment};`;
        const messageStyle = `margin: 0; color: ${textColor}; font-family: ${theme.typography.fontFamily}; font-size: ${fontSize}px; line-height: 1.6; text-align: ${alignment};`;
        // body.content é o único campo da configuração intencionalmente tratado como HTML confiável.
        // Título, mensagem e valores de estilo são sempre escapados/validados e não viram HTML.
        const bodyContent = body.content ?? `
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td align="${alignment}" style="${escapeHtml(bodyCellStyle)}">
                <h2 style="${escapeHtml(titleStyle)}">${escapeHtml(body.title ?? 'Hello!')}</h2>
                <p style="${escapeHtml(messageStyle)}">${escapeHtml(body.message ?? 'This is an email generated with tzMail.')}</p>
              </td>
            </tr>
          </table>`;

        builder.buildPreheader().buildHeader(typeof data?.headerContent === 'string' ? data.headerContent : '').buildBody(bodyContent);
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
      [ThemeType.SYSTEM]: { name: 'System', description: 'Clean, professional palette with adaptive light and dark variants', features: ['Minimal design', 'Accessible contrast', 'Email-client friendly'] },
      [ThemeType.MONOKAI]: { name: 'Monokai', description: 'Vibrant, code-inspired colors for technical content', features: ['Vivid accents', 'Developer aesthetic', 'Dark-mode variant'] },
      [ThemeType.MODERN]: { name: 'Modern', description: 'Contemporary layout with refined colors and typography', features: ['Modern palette', 'Clean hierarchy', 'Responsive structure'] },
      [ThemeType.CORPORATE]: { name: 'Corporate', description: 'Professional, structured styling for business communication', features: ['Serif typography', 'Gold details', 'Formal hierarchy'] },
      [ThemeType.MINIMAL]: { name: 'Minimal', description: 'Content-first design with generous whitespace', features: ['Low visual noise', 'Generous spacing', 'Clean typography'] },
      [ThemeType.AURORA]: { name: 'Aurora', description: 'Cool northern-lights colors with teal and violet accents', features: ['Teal and violet palette', 'Balanced light and dark modes', 'System-font typography'] },
      [ThemeType.OCEAN]: { name: 'Ocean', description: 'Calm marine blues and cyan for clear, trustworthy messages', features: ['Navy and cyan palette', 'Readable contrast', 'Email-safe fonts'] },
      [ThemeType.SUNSET]: { name: 'Sunset', description: 'Warm coral, terracotta, and amber for an energetic impression', features: ['Warm accents', 'Polished surfaces', 'Light and dark modes'] },
      [ThemeType.LAVENDER]: { name: 'Lavender', description: 'Elegant violet and rose accents on soft, readable surfaces', features: ['Lavender palette', 'Soft visual tone', 'Accessible contrast'] },
      [ThemeType.FOREST]: { name: 'Forest', description: 'Natural evergreen, moss, sage, and warm cream colors', features: ['Nature-inspired palette', 'Calm serif typography', 'Light and dark modes'] },
      [ThemeType.EDITORIAL]: { name: 'Editorial', description: 'Magazine-inspired typography with warm paper and ink tones', features: ['Serif hierarchy', 'Brick-red accent', 'Content-led layout'] },
      [ThemeType.PASTEL]: { name: 'Pastel', description: 'Soft peach, mint, and lavender accents with readable contrast', features: ['Gentle pastel palette', 'Bright, friendly tone', 'Accessible text colors'] },
      [ThemeType.NEOBRUTAL]: { name: 'Neo Brutal', description: 'Bold black-and-white styling with electric color accents', features: ['High contrast', 'Strong typography', 'Distinctive cobalt and yellow'] },
      [ThemeType.GLASS]: { name: 'Glass', description: 'Cool, glass-inspired colors implemented with solid email-safe surfaces', features: ['Cool blue-gray palette', 'Solid client-compatible colors', 'Clean typography'] },
      [ThemeType.MIDNIGHT]: { name: 'Midnight', description: 'Premium midnight navy and champagne-gold accents', features: ['Luxe dark palette', 'Warm paper light mode', 'Serif typography'] }
    };
    const info = themeInfo[themeType];
    if (!info) throw new Error(`Theme ${themeType} not found`);
    return info;
  }
}
