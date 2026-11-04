"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateFactory = void 0;
const theme_enum_1 = require("../core/enums/theme.enum");
const system_theme_1 = require("../templates/themes/system.theme");
const monokai_theme_1 = require("../templates/themes/monokai.theme");
const modern_theme_1 = require("../templates/themes/modern.theme");
const corporate_theme_1 = require("../templates/themes/corporate.theme");
const minimal_theme_1 = require("../templates/themes/minimal.theme");
const template_builder_1 = require("../templates/base/template-builder");
const SAFE_COLOR = /^(#[\da-f]{3,8}|[a-z]{1,24}|(?:rgb|rgba|hsl|hsla)\([\d.%\s,+/-]+\))$/i;
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
        [theme_enum_1.ThemeType.MINIMAL, new minimal_theme_1.MinimalTheme()]
    ]);
    static createTemplate(themeType, variant, config) {
        const theme = this.themes.get(themeType);
        if (!theme)
            throw new Error(`Theme ${themeType} not found`);
        if (variant !== 'light' && variant !== 'dark')
            throw new Error(`Invalid template variant: ${variant}`);
        if (!config || typeof config !== 'object')
            throw new Error('Template config must be an object');
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
                // Renderer usa sempre a configuração capturada. `data` é somente conteúdo variável,
                // nunca uma fonte alternativa de configuração/template.
                const body = renderConfig.body || {};
                const alignment = body.alignment || 'left';
                if (!['left', 'center', 'right'].includes(alignment))
                    throw new Error('Invalid body alignment');
                const fontSize = body.fontSize ?? 14;
                if (!Number.isFinite(fontSize) || fontSize < 8 || fontSize > 72)
                    throw new Error('Invalid body font size');
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
    static getTheme(themeType) { return this.themes.get(themeType); }
    static listThemes() { return Array.from(this.themes.keys()); }
    static getThemeInfo(themeType) {
        const themeInfo = {
            [theme_enum_1.ThemeType.SYSTEM]: { name: 'System', description: 'Tema limpo e profissional com cores adaptativas', features: ['Design minimalista', 'Alta acessibilidade', 'Compatibilidade total'] },
            [theme_enum_1.ThemeType.MONOKAI]: { name: 'Monokai', description: 'Inspirado no famoso tema de código, ideal para conteúdo técnico', features: ['Cores vibrantes', 'Destaque de sintaxe', 'Efeitos glow'] },
            [theme_enum_1.ThemeType.MODERN]: { name: 'Modern', description: 'Design contemporâneo com gradientes e efeitos modernos', features: ['Gradientes elegantes', 'Glassmorphism', 'Animações suaves'] },
            [theme_enum_1.ThemeType.CORPORATE]: { name: 'Corporate', description: 'Design profissional e elegante para empresas', features: ['Tipografia serifada', 'Detalhes em dourado', 'Layout estruturado'] },
            [theme_enum_1.ThemeType.MINIMAL]: { name: 'Minimal', description: 'Design clean e focado no conteúdo', features: ['Sem distrações', 'Espaçamento generoso', 'Tipografia limpa'] }
        };
        const info = themeInfo[themeType];
        if (!info)
            throw new Error(`Theme ${themeType} not found`);
        return info;
    }
}
exports.TemplateFactory = TemplateFactory;
