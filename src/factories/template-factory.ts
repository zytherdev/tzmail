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
import { SaaSTheme } from '../templates/themes/saas.theme';
import { CitrusTheme } from '../templates/themes/citrus.theme';
import { BerryTheme } from '../templates/themes/berry.theme';
import { PaperTheme } from '../templates/themes/paper.theme';
import { NeonTheme } from '../templates/themes/neon.theme';
import { AlpineTheme } from '../templates/themes/alpine.theme';
import { OrbitTheme } from '../templates/themes/orbit.theme';
import { LinenTheme } from '../templates/themes/linen.theme';
import { BloomTheme } from '../templates/themes/bloom.theme';
import { SlateTheme } from '../templates/themes/slate.theme';
import { MarigoldTheme } from '../templates/themes/marigold.theme';
import { InkwellTheme } from '../templates/themes/inkwell.theme';
import { TideTheme } from '../templates/themes/tide.theme';
import { ClayTheme } from '../templates/themes/clay.theme';
import { CloudTheme } from '../templates/themes/cloud.theme';
import { CampusTheme } from '../templates/themes/campus.theme';
import { NoirTheme } from '../templates/themes/noir.theme';
import { MintTheme } from '../templates/themes/mint.theme';
import { SaffronTheme } from '../templates/themes/saffron.theme';
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
      } : undefined,
      heroImageUrl: interpolate(config.header.heroImageUrl, variables),
      heroAlt: interpolate(config.header.heroAlt, variables)
    } : undefined,
    body: config.body ? {
      ...config.body,
      title: interpolate(config.body.title, variables),
      message: interpolate(config.body.message, variables),
      // Substitutions inside trusted HTML are escaped before insertion.
      content: interpolate(config.body.content, variables, true),
      html: interpolate(config.body.html, variables, true),
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
    [ThemeType.MIDNIGHT, new MidnightTheme()],
    [ThemeType.SAAS, new SaaSTheme()],
    [ThemeType.CITRUS, new CitrusTheme()],
    [ThemeType.BERRY, new BerryTheme()]
    , [ThemeType.PAPER, new PaperTheme()]
    , [ThemeType.NEON, new NeonTheme()]
    , [ThemeType.ALPINE, new AlpineTheme()]
    , [ThemeType.ORBIT, new OrbitTheme()]
    , [ThemeType.LINEN, new LinenTheme()]
    , [ThemeType.BLOOM, new BloomTheme()]
    , [ThemeType.SLATE, new SlateTheme()]
    , [ThemeType.MARIGOLD, new MarigoldTheme()]
    , [ThemeType.INKWELL, new InkwellTheme()]
    , [ThemeType.TIDE, new TideTheme()]
    , [ThemeType.CLAY, new ClayTheme()]
    , [ThemeType.CLOUD, new CloudTheme()]
    , [ThemeType.CAMPUS, new CampusTheme()]
    , [ThemeType.NOIR, new NoirTheme()]
    , [ThemeType.MINT, new MintTheme()]
    , [ThemeType.SAFFRON, new SaffronTheme()]
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
        // The renderer always uses the captured configuration. `data` is variable content only,
        // never an alternative configuration or template source.
        const body = renderConfig.body || {};
        const alignment = body.alignment ?? theme.composition?.body.alignment ?? 'left';
        if (!['left', 'center', 'right'].includes(alignment)) throw new Error('Invalid body alignment');
        const buttonAlignment = body.buttonAlignment || alignment;
        if (!['left', 'center', 'right'].includes(buttonAlignment)) throw new Error('Invalid button alignment');
        for (const section of [renderConfig.header, renderConfig.footer]) {
          if (section?.alignment !== undefined && !['left', 'center', 'right'].includes(section.alignment)) throw new Error('Invalid section alignment');
        }
        const fontSize = body.fontSize ?? Number.parseFloat(theme.typography.fontSizes.medium);
        if (!Number.isFinite(fontSize) || fontSize < 8 || fontSize > 72) throw new Error('Invalid body font size');
        cssColor(body.backgroundColor, theme[variant].background);
        cssColor(body.textColor, theme[variant].text);
        cssColor(renderConfig.header?.backgroundColor, 'transparent');
        cssColor(renderConfig.header?.textColor, 'inherit');
        cssColor(renderConfig.footer?.backgroundColor, 'transparent');
        cssColor(renderConfig.footer?.textColor, 'inherit');
        builder.buildPreheader().buildHeader(typeof data?.headerContent === 'string' ? data.headerContent : '');
        const trustedHtml = body.content ?? body.html;
        if (trustedHtml !== undefined) builder.buildBody(trustedHtml);
        else builder.buildMessage(body.title ?? 'Hello!', body.message ?? 'This is an email generated with tzMail.', fontSize);
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
      [ThemeType.MIDNIGHT]: { name: 'Midnight', description: 'Premium midnight navy and champagne-gold accents', features: ['Luxe dark palette', 'Warm paper light mode', 'Serif typography'] },
      [ThemeType.SAAS]: { name: 'SaaS', description: 'Crisp product-update styling with indigo accents', features: ['Product-led hierarchy', 'Reliable system fonts', 'High-contrast CTA'] },
      [ThemeType.CITRUS]: { name: 'Citrus', description: 'Warm editorial palette for announcements and launches', features: ['Warm orange palette', 'Serif typography', 'Compact rounded CTA'] },
      [ThemeType.BERRY]: { name: 'Berry', description: 'Polished berry palette for personal and community messages', features: ['Soft berry surfaces', 'Pill CTA', 'Light and dark modes'] },
      [ThemeType.PAPER]: { name: 'Paper', description: 'Editorial newsletter layout with warm paper surfaces', features: ['Serif typography', 'Outline CTA', 'Magazine-style spacing'] },
      [ThemeType.NEON]: { name: 'Neon', description: 'Technical high-contrast layout with teal energy', features: ['Tech aesthetic', 'Strong borders', 'Uppercase CTA'] },
      [ThemeType.ALPINE]: { name: 'Alpine', description: 'Fresh natural layout with rounded surfaces', features: ['Green palette', 'Pill CTA', 'Calm hierarchy'] },
      [ThemeType.ORBIT]: { name: 'Orbit', description: 'Precise violet product layout with a compact rhythm', features: ['Compact hierarchy', 'Pill CTA', 'Cool violet accents'] },
      [ThemeType.LINEN]: { name: 'Linen', description: 'Quiet editorial layout with warm neutral surfaces', features: ['Serif typography', 'Outline CTA', 'Low visual noise'] },
      [ThemeType.BLOOM]: { name: 'Bloom', description: 'Delicate berry layout for launches and community notes', features: ['Soft accents', 'Rounded CTA', 'Light and dark modes'] },
      [ThemeType.SLATE]: { name: 'Slate', description: 'Sober modular layout for modern corporate communication', features: ['Neutral palette', 'Structured spacing', 'Quiet CTA'] },
      [ThemeType.MARIGOLD]: { name: 'Marigold', description: 'Warm editorial layout with restrained amber accents', features: ['Serif typography', 'Outline CTA', 'Warm contrast'] },
      [ThemeType.INKWELL]: { name: 'Inkwell', description: 'Literary black-and-white layout with a measured rhythm', features: ['Serif typography', 'Hard edges', 'High contrast'] },
      [ThemeType.TIDE]: { name: 'Tide', description: 'Open marine layout with calm teal surfaces', features: ['Teal palette', 'Rounded CTA', 'Open content'] },
      [ThemeType.CLAY]: { name: 'Clay', description: 'Warm crafted layout with soft terracotta framing', features: ['Terracotta palette', 'Outline CTA', 'Soft frame'] },
      [ThemeType.CLOUD]: { name: 'Cloud', description: 'Light product layout with airy blue surfaces', features: ['Airy spacing', 'Product hierarchy', 'Rounded container'] },
      [ThemeType.CAMPUS]: { name: 'Campus', description: 'Academic editorial layout with formal typography', features: ['Serif hierarchy', 'Formal spacing', 'Uppercase CTA'] },
      [ThemeType.NOIR]: { name: 'Noir', description: 'Minimal premium layout with controlled monochrome contrast', features: ['Monochrome palette', 'Compact rhythm', 'Uppercase CTA'] },
      [ThemeType.MINT]: { name: 'Mint', description: 'Fresh rounded layout for calm product and community updates', features: ['Green palette', 'Pill CTA', 'Soft surfaces'] },
      [ThemeType.SAFFRON]: { name: 'Saffron', description: 'Bright product-editorial layout with orange and gold accents', features: ['Warm accents', 'Callout body', 'Solid CTA'] }
    };
    const info = themeInfo[themeType];
    if (!info) throw new Error(`Theme ${themeType} not found`);
    const design = this.themes.get(themeType)?.composition;
    return design ? {
      name: info.name,
      description: design.description,
      features: [design.name, `${design.header.layout} header`, `${design.body.layout} body`, `${design.footer.layout} footer`, `${design.body.alignment}-aligned typography`, 'No images required']
    } : info;
  }
}
