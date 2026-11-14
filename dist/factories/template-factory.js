"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateFactory = void 0;
const theme_enum_1 = require("../core/enums/theme.enum");
const system_theme_1 = require("../templates/themes/system.theme");
const monokai_theme_1 = require("../templates/themes/monokai.theme");
const modern_theme_1 = require("../templates/themes/modern.theme");
const corporate_theme_1 = require("../templates/themes/corporate.theme");
const minimal_theme_1 = require("../templates/themes/minimal.theme");
const aurora_theme_1 = require("../templates/themes/aurora.theme");
const ocean_theme_1 = require("../templates/themes/ocean.theme");
const sunset_theme_1 = require("../templates/themes/sunset.theme");
const lavender_theme_1 = require("../templates/themes/lavender.theme");
const forest_theme_1 = require("../templates/themes/forest.theme");
const editorial_theme_1 = require("../templates/themes/editorial.theme");
const pastel_theme_1 = require("../templates/themes/pastel.theme");
const neobrutal_theme_1 = require("../templates/themes/neobrutal.theme");
const glass_theme_1 = require("../templates/themes/glass.theme");
const midnight_theme_1 = require("../templates/themes/midnight.theme");
const saas_theme_1 = require("../templates/themes/saas.theme");
const citrus_theme_1 = require("../templates/themes/citrus.theme");
const berry_theme_1 = require("../templates/themes/berry.theme");
const paper_theme_1 = require("../templates/themes/paper.theme");
const neon_theme_1 = require("../templates/themes/neon.theme");
const alpine_theme_1 = require("../templates/themes/alpine.theme");
const orbit_theme_1 = require("../templates/themes/orbit.theme");
const linen_theme_1 = require("../templates/themes/linen.theme");
const bloom_theme_1 = require("../templates/themes/bloom.theme");
const slate_theme_1 = require("../templates/themes/slate.theme");
const marigold_theme_1 = require("../templates/themes/marigold.theme");
const inkwell_theme_1 = require("../templates/themes/inkwell.theme");
const tide_theme_1 = require("../templates/themes/tide.theme");
const clay_theme_1 = require("../templates/themes/clay.theme");
const cloud_theme_1 = require("../templates/themes/cloud.theme");
const campus_theme_1 = require("../templates/themes/campus.theme");
const noir_theme_1 = require("../templates/themes/noir.theme");
const mint_theme_1 = require("../templates/themes/mint.theme");
const saffron_theme_1 = require("../templates/themes/saffron.theme");
const template_builder_1 = require("../templates/base/template-builder");
const SAFE_COLOR = /^(#[\da-f]{3,8}|[a-z]{1,24}|(?:rgb|rgba|hsl|hsla)\([\d.%\s,+/-]+\))$/i;
const SAFE_LANGUAGE_TAG = /^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/;
const SAFE_NAMED_COLORS = new Set(('transparent inherit currentcolor aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgrey darkgreen darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray grey green greenyellow honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgrey lightgreen lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen').split(' '));
function cssColor(value, fallback) {
    if (value === undefined)
        return fallback;
    const trimmed = value.trim();
    if (!SAFE_COLOR.test(trimmed) || (!trimmed.startsWith('#') && !/^(rgb|rgba|hsl|hsla)\(/i.test(trimmed) && !SAFE_NAMED_COLORS.has(trimmed.toLowerCase()))) {
        throw new Error('Invalid template color value');
    }
    return trimmed;
}
function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}
function interpolate(value, variables, escapeValues = false) {
    if (value === undefined)
        return undefined;
    return value.replace(/\{\{\s*([A-Za-z0-9_.-]+)\s*\}\}/g, (_placeholder, path) => {
        let resolved = variables;
        for (const segment of path.split('.')) {
            if (resolved === null || typeof resolved !== 'object')
                throw new Error(`Missing template variable: ${path}`);
            resolved = resolved[segment];
        }
        if (resolved === undefined)
            throw new Error(`Missing template variable: ${path}`);
        if (resolved !== null && !['string', 'number', 'boolean'].includes(typeof resolved)) {
            throw new Error(`Template variable ${path} must be a string, number, boolean, or null`);
        }
        const text = resolved === null ? '' : String(resolved);
        return escapeValues ? escapeHtml(text) : text;
    });
}
function resolveTemplateConfig(config, variables) {
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
                text: interpolate(link.text, variables),
                url: interpolate(link.url, variables)
            })),
            socialLinks: config.footer.socialLinks?.map(link => ({
                ...link,
                url: interpolate(link.url, variables)
            })),
            copyrightText: interpolate(config.footer.copyrightText, variables),
            unsubscribeText: interpolate(config.footer.unsubscribeText, variables),
            unsubscribeUrl: interpolate(config.footer.unsubscribeUrl, variables)
        } : undefined
    };
}
class TemplateFactory {
    static themes = new Map([
        [theme_enum_1.ThemeType.SYSTEM, new system_theme_1.SystemTheme()],
        [theme_enum_1.ThemeType.MONOKAI, new monokai_theme_1.MonokaiTheme()],
        [theme_enum_1.ThemeType.MODERN, new modern_theme_1.ModernTheme()],
        [theme_enum_1.ThemeType.CORPORATE, new corporate_theme_1.CorporateTheme()],
        [theme_enum_1.ThemeType.MINIMAL, new minimal_theme_1.MinimalTheme()],
        [theme_enum_1.ThemeType.AURORA, new aurora_theme_1.AuroraTheme()],
        [theme_enum_1.ThemeType.OCEAN, new ocean_theme_1.OceanTheme()],
        [theme_enum_1.ThemeType.SUNSET, new sunset_theme_1.SunsetTheme()],
        [theme_enum_1.ThemeType.LAVENDER, new lavender_theme_1.LavenderTheme()],
        [theme_enum_1.ThemeType.FOREST, new forest_theme_1.ForestTheme()],
        [theme_enum_1.ThemeType.EDITORIAL, new editorial_theme_1.EditorialTheme()],
        [theme_enum_1.ThemeType.PASTEL, new pastel_theme_1.PastelTheme()],
        [theme_enum_1.ThemeType.NEOBRUTAL, new neobrutal_theme_1.NeoBrutalTheme()],
        [theme_enum_1.ThemeType.GLASS, new glass_theme_1.GlassTheme()],
        [theme_enum_1.ThemeType.MIDNIGHT, new midnight_theme_1.MidnightTheme()],
        [theme_enum_1.ThemeType.SAAS, new saas_theme_1.SaaSTheme()],
        [theme_enum_1.ThemeType.CITRUS, new citrus_theme_1.CitrusTheme()],
        [theme_enum_1.ThemeType.BERRY, new berry_theme_1.BerryTheme()],
        [theme_enum_1.ThemeType.PAPER, new paper_theme_1.PaperTheme()],
        [theme_enum_1.ThemeType.NEON, new neon_theme_1.NeonTheme()],
        [theme_enum_1.ThemeType.ALPINE, new alpine_theme_1.AlpineTheme()],
        [theme_enum_1.ThemeType.ORBIT, new orbit_theme_1.OrbitTheme()],
        [theme_enum_1.ThemeType.LINEN, new linen_theme_1.LinenTheme()],
        [theme_enum_1.ThemeType.BLOOM, new bloom_theme_1.BloomTheme()],
        [theme_enum_1.ThemeType.SLATE, new slate_theme_1.SlateTheme()],
        [theme_enum_1.ThemeType.MARIGOLD, new marigold_theme_1.MarigoldTheme()],
        [theme_enum_1.ThemeType.INKWELL, new inkwell_theme_1.InkwellTheme()],
        [theme_enum_1.ThemeType.TIDE, new tide_theme_1.TideTheme()],
        [theme_enum_1.ThemeType.CLAY, new clay_theme_1.ClayTheme()],
        [theme_enum_1.ThemeType.CLOUD, new cloud_theme_1.CloudTheme()],
        [theme_enum_1.ThemeType.CAMPUS, new campus_theme_1.CampusTheme()],
        [theme_enum_1.ThemeType.NOIR, new noir_theme_1.NoirTheme()],
        [theme_enum_1.ThemeType.MINT, new mint_theme_1.MintTheme()],
        [theme_enum_1.ThemeType.SAFFRON, new saffron_theme_1.SaffronTheme()]
    ]);
    static createTemplate(themeType, variant, config) {
        const theme = this.themes.get(themeType);
        if (!theme)
            throw new Error(`Theme ${themeType} not found`);
        if (variant !== 'light' && variant !== 'dark')
            throw new Error(`Invalid template variant: ${variant}`);
        if (!config || typeof config !== 'object')
            throw new Error('Template config must be an object');
        if (config.language !== undefined && (typeof config.language !== 'string' || config.language.length > 63 || !SAFE_LANGUAGE_TAG.test(config.language))) {
            throw new Error('Invalid template language tag');
        }
        if (config.direction !== undefined && !['ltr', 'rtl', 'auto'].includes(config.direction))
            throw new Error('Invalid template text direction');
        if (config.linkDecoration !== undefined && !['none', 'underline'].includes(config.linkDecoration))
            throw new Error('Invalid template linkDecoration');
        if (config.preheader !== undefined && (typeof config.preheader !== 'string' || config.preheader.length > 500 || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(config.preheader))) {
            throw new Error('preheader must be a string of at most 500 printable characters');
        }
        return {
            name: `${themeType}_${variant}`,
            theme: themeType,
            variant,
            config,
            render: async (data) => {
                const templateData = data?.templateData && typeof data.templateData === 'object' && !Array.isArray(data.templateData)
                    ? data.templateData
                    : {};
                const renderConfig = resolveTemplateConfig(config, templateData);
                const builder = new template_builder_1.TemplateBuilder(theme, renderConfig, variant);
                // The renderer always uses the captured configuration. `data` is variable content only,
                // never an alternative configuration or template source.
                const body = renderConfig.body || {};
                const alignment = body.alignment ?? theme.composition?.body.alignment ?? 'left';
                if (!['left', 'center', 'right'].includes(alignment))
                    throw new Error('Invalid body alignment');
                const buttonAlignment = body.buttonAlignment || alignment;
                if (!['left', 'center', 'right'].includes(buttonAlignment))
                    throw new Error('Invalid button alignment');
                for (const section of [renderConfig.header, renderConfig.footer]) {
                    if (section?.alignment !== undefined && !['left', 'center', 'right'].includes(section.alignment))
                        throw new Error('Invalid section alignment');
                }
                const fontSize = body.fontSize ?? Number.parseFloat(theme.typography.fontSizes.medium);
                if (!Number.isFinite(fontSize) || fontSize < 8 || fontSize > 72)
                    throw new Error('Invalid body font size');
                cssColor(body.backgroundColor, theme[variant].background);
                cssColor(body.textColor, theme[variant].text);
                cssColor(renderConfig.header?.backgroundColor, 'transparent');
                cssColor(renderConfig.header?.textColor, 'inherit');
                cssColor(renderConfig.footer?.backgroundColor, 'transparent');
                cssColor(renderConfig.footer?.textColor, 'inherit');
                builder.buildPreheader().buildHeader(typeof data?.headerContent === 'string' ? data.headerContent : '');
                const trustedHtml = body.content ?? body.html;
                if (trustedHtml !== undefined)
                    builder.buildBody(trustedHtml);
                else
                    builder.buildMessage(body.title ?? 'Hello!', body.message ?? 'This is an email generated with tzMail.', fontSize);
                if (body.buttonText && body.buttonUrl) {
                    builder.buildButton(body.buttonText, body.buttonUrl, body.buttonVariant || 'primary');
                }
                return builder.buildFooter().build();
            }
        };
    }
    static getTheme(themeType) { return this.themes.get(themeType); }
    static listThemes() { return Array.from(this.themes.keys()); }
    static getThemeInfo(themeType) {
        const themeInfo = {
            [theme_enum_1.ThemeType.SYSTEM]: { name: 'System', description: 'Clean, professional palette with adaptive light and dark variants', features: ['Minimal design', 'Accessible contrast', 'Email-client friendly'] },
            [theme_enum_1.ThemeType.MONOKAI]: { name: 'Monokai', description: 'Vibrant, code-inspired colors for technical content', features: ['Vivid accents', 'Developer aesthetic', 'Dark-mode variant'] },
            [theme_enum_1.ThemeType.MODERN]: { name: 'Modern', description: 'Contemporary layout with refined colors and typography', features: ['Modern palette', 'Clean hierarchy', 'Responsive structure'] },
            [theme_enum_1.ThemeType.CORPORATE]: { name: 'Corporate', description: 'Professional, structured styling for business communication', features: ['Serif typography', 'Gold details', 'Formal hierarchy'] },
            [theme_enum_1.ThemeType.MINIMAL]: { name: 'Minimal', description: 'Content-first design with generous whitespace', features: ['Low visual noise', 'Generous spacing', 'Clean typography'] },
            [theme_enum_1.ThemeType.AURORA]: { name: 'Aurora', description: 'Cool northern-lights colors with teal and violet accents', features: ['Teal and violet palette', 'Balanced light and dark modes', 'System-font typography'] },
            [theme_enum_1.ThemeType.OCEAN]: { name: 'Ocean', description: 'Calm marine blues and cyan for clear, trustworthy messages', features: ['Navy and cyan palette', 'Readable contrast', 'Email-safe fonts'] },
            [theme_enum_1.ThemeType.SUNSET]: { name: 'Sunset', description: 'Warm coral, terracotta, and amber for an energetic impression', features: ['Warm accents', 'Polished surfaces', 'Light and dark modes'] },
            [theme_enum_1.ThemeType.LAVENDER]: { name: 'Lavender', description: 'Elegant violet and rose accents on soft, readable surfaces', features: ['Lavender palette', 'Soft visual tone', 'Accessible contrast'] },
            [theme_enum_1.ThemeType.FOREST]: { name: 'Forest', description: 'Natural evergreen, moss, sage, and warm cream colors', features: ['Nature-inspired palette', 'Calm serif typography', 'Light and dark modes'] },
            [theme_enum_1.ThemeType.EDITORIAL]: { name: 'Editorial', description: 'Magazine-inspired typography with warm paper and ink tones', features: ['Serif hierarchy', 'Brick-red accent', 'Content-led layout'] },
            [theme_enum_1.ThemeType.PASTEL]: { name: 'Pastel', description: 'Soft peach, mint, and lavender accents with readable contrast', features: ['Gentle pastel palette', 'Bright, friendly tone', 'Accessible text colors'] },
            [theme_enum_1.ThemeType.NEOBRUTAL]: { name: 'Neo Brutal', description: 'Bold black-and-white styling with electric color accents', features: ['High contrast', 'Strong typography', 'Distinctive cobalt and yellow'] },
            [theme_enum_1.ThemeType.GLASS]: { name: 'Glass', description: 'Cool, glass-inspired colors implemented with solid email-safe surfaces', features: ['Cool blue-gray palette', 'Solid client-compatible colors', 'Clean typography'] },
            [theme_enum_1.ThemeType.MIDNIGHT]: { name: 'Midnight', description: 'Premium midnight navy and champagne-gold accents', features: ['Luxe dark palette', 'Warm paper light mode', 'Serif typography'] },
            [theme_enum_1.ThemeType.SAAS]: { name: 'SaaS', description: 'Crisp product-update styling with indigo accents', features: ['Product-led hierarchy', 'Reliable system fonts', 'High-contrast CTA'] },
            [theme_enum_1.ThemeType.CITRUS]: { name: 'Citrus', description: 'Warm editorial palette for announcements and launches', features: ['Warm orange palette', 'Serif typography', 'Compact rounded CTA'] },
            [theme_enum_1.ThemeType.BERRY]: { name: 'Berry', description: 'Polished berry palette for personal and community messages', features: ['Soft berry surfaces', 'Pill CTA', 'Light and dark modes'] },
            [theme_enum_1.ThemeType.PAPER]: { name: 'Paper', description: 'Editorial newsletter layout with warm paper surfaces', features: ['Serif typography', 'Outline CTA', 'Magazine-style spacing'] },
            [theme_enum_1.ThemeType.NEON]: { name: 'Neon', description: 'Technical high-contrast layout with teal energy', features: ['Tech aesthetic', 'Strong borders', 'Uppercase CTA'] },
            [theme_enum_1.ThemeType.ALPINE]: { name: 'Alpine', description: 'Fresh natural layout with rounded surfaces', features: ['Green palette', 'Pill CTA', 'Calm hierarchy'] },
            [theme_enum_1.ThemeType.ORBIT]: { name: 'Orbit', description: 'Precise violet product layout with a compact rhythm', features: ['Compact hierarchy', 'Pill CTA', 'Cool violet accents'] },
            [theme_enum_1.ThemeType.LINEN]: { name: 'Linen', description: 'Quiet editorial layout with warm neutral surfaces', features: ['Serif typography', 'Outline CTA', 'Low visual noise'] },
            [theme_enum_1.ThemeType.BLOOM]: { name: 'Bloom', description: 'Delicate berry layout for launches and community notes', features: ['Soft accents', 'Rounded CTA', 'Light and dark modes'] },
            [theme_enum_1.ThemeType.SLATE]: { name: 'Slate', description: 'Sober modular layout for modern corporate communication', features: ['Neutral palette', 'Structured spacing', 'Quiet CTA'] },
            [theme_enum_1.ThemeType.MARIGOLD]: { name: 'Marigold', description: 'Warm editorial layout with restrained amber accents', features: ['Serif typography', 'Outline CTA', 'Warm contrast'] },
            [theme_enum_1.ThemeType.INKWELL]: { name: 'Inkwell', description: 'Literary black-and-white layout with a measured rhythm', features: ['Serif typography', 'Hard edges', 'High contrast'] },
            [theme_enum_1.ThemeType.TIDE]: { name: 'Tide', description: 'Open marine layout with calm teal surfaces', features: ['Teal palette', 'Rounded CTA', 'Open content'] },
            [theme_enum_1.ThemeType.CLAY]: { name: 'Clay', description: 'Warm crafted layout with soft terracotta framing', features: ['Terracotta palette', 'Outline CTA', 'Soft frame'] },
            [theme_enum_1.ThemeType.CLOUD]: { name: 'Cloud', description: 'Light product layout with airy blue surfaces', features: ['Airy spacing', 'Product hierarchy', 'Rounded container'] },
            [theme_enum_1.ThemeType.CAMPUS]: { name: 'Campus', description: 'Academic editorial layout with formal typography', features: ['Serif hierarchy', 'Formal spacing', 'Uppercase CTA'] },
            [theme_enum_1.ThemeType.NOIR]: { name: 'Noir', description: 'Minimal premium layout with controlled monochrome contrast', features: ['Monochrome palette', 'Compact rhythm', 'Uppercase CTA'] },
            [theme_enum_1.ThemeType.MINT]: { name: 'Mint', description: 'Fresh rounded layout for calm product and community updates', features: ['Green palette', 'Pill CTA', 'Soft surfaces'] },
            [theme_enum_1.ThemeType.SAFFRON]: { name: 'Saffron', description: 'Bright product-editorial layout with orange and gold accents', features: ['Warm accents', 'Callout body', 'Solid CTA'] }
        };
        const info = themeInfo[themeType];
        if (!info)
            throw new Error(`Theme ${themeType} not found`);
        const design = this.themes.get(themeType)?.composition;
        return design ? {
            name: info.name,
            description: design.description,
            features: [design.name, `${design.header.layout} header`, `${design.body.layout} body`, `${design.footer.layout} footer`, `${design.body.alignment}-aligned typography`, 'No images required']
        } : info;
    }
}
exports.TemplateFactory = TemplateFactory;
