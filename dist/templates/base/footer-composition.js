"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderThemeFooter = renderThemeFooter;
const theme_composition_1 = require("../themes/theme-composition");
const color_accessibility_1 = require("./color-accessibility");
function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
}
/** Keep CSS values solid and contrast-measurable, not arbitrary style declarations. */
function solidColor(value) {
    if (typeof value !== 'string')
        return undefined;
    const color = value.trim();
    if (/^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(color))
        return color;
    const named = {
        black: '#000000', white: '#ffffff', silver: '#c0c0c0', gray: '#808080',
        grey: '#808080', maroon: '#800000', red: '#ff0000', purple: '#800080',
        fuchsia: '#ff00ff', green: '#008000', lime: '#00ff00', olive: '#808000',
        yellow: '#ffff00', navy: '#000080', blue: '#0000ff', teal: '#008080',
        aqua: '#00ffff', orange: '#ffa500', rebeccapurple: '#663399'
    };
    if (Object.prototype.hasOwnProperty.call(named, color.toLowerCase()))
        return named[color.toLowerCase()];
    const rgb = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(color);
    if (rgb && rgb.slice(1).every(channel => Number(channel) <= 255)) {
        return '#' + rgb.slice(1).map(channel => Number(channel).toString(16).padStart(2, '0')).join('');
    }
    return undefined;
}
function safeUrl(value, allowMailto) {
    if (value === undefined)
        return undefined;
    if (typeof value !== 'string' || !value.trim() || /[\u0000-\u0020\u007f"'<>\\]/.test(value))
        throw new Error('Unsafe URL in template');
    let url;
    try {
        url = new URL(value);
    }
    catch {
        throw new Error('Template URLs must be absolute');
    }
    const schemes = allowMailto ? ['http:', 'https:', 'mailto:'] : ['http:', 'https:'];
    if (!schemes.includes(url.protocol.toLowerCase()))
        throw new Error('Unsafe URL scheme in template');
    return value;
}
function safeFont(value) {
    return typeof value === 'string' && /^[\w\s,'"-]+$/.test(value)
        ? value : 'Arial, Helvetica, sans-serif';
}
function safeSize(value, fallback) {
    return typeof value === 'string' && /^\d+(?:\.\d+)?(?:px|pt|em|rem|%)$/.test(value) ? value : fallback;
}
function padding(value, fallback) {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.min(value, 200) : fallback;
}
function alignment(value, fallback) {
    return value === 'left' || value === 'center' || value === 'right' ? value : fallback;
}
/** Render only caller-supplied footer content; all layout furniture is structural. */
function renderThemeFooter(theme, config, variant) {
    const footer = config.footer;
    if (!footer?.show)
        return '';
    const composition = (0, theme_composition_1.resolveThemeComposition)(theme);
    const colors = theme[variant];
    const layouts = ['colophon', 'columns', 'band', 'ledger', 'signature', 'minimal'];
    const layout = layouts.includes(composition.footer.layout) ? composition.footer.layout : theme_composition_1.DEFAULT_COMPOSITION.footer.layout;
    const align = alignment(footer.alignment, alignment(composition.footer.alignment, 'left'));
    const background = (0, color_accessibility_1.normalizeCssColor)(footer.backgroundColor ?? (0, theme_composition_1.surfaceColor)(composition.footer.surface, colors), colors.background)
        ?? solidColor(colors.background)
        ?? (variant === 'dark' ? '#111111' : '#ffffff');
    const preferredText = footer.textColor ?? solidColor(colors.textMuted) ?? '#666666';
    const textColor = (0, color_accessibility_1.readableTextColor)(preferredText, background, solidColor(colors.text));
    const linkColor = (0, color_accessibility_1.readableTextColor)(footer.textColor ?? solidColor(colors.primary) ?? textColor, background, textColor);
    const ruleColor = solidColor(colors.border) ?? textColor;
    const font = safeFont(theme.typography.fontFamily);
    const small = safeSize(theme.typography.fontSizes.small, '12px');
    const medium = safeSize(theme.typography.fontSizes.medium, '14px');
    const weight = Number.isFinite(theme.typography.fontWeights.medium) ? theme.typography.fontWeights.medium : 500;
    const paddingX = padding(composition.body.paddingX, theme_composition_1.DEFAULT_COMPOSITION.body.paddingX);
    const paddingY = padding(composition.footer.paddingY, theme_composition_1.DEFAULT_COMPOSITION.footer.paddingY);
    const decoration = config.linkDecoration === 'underline' ? 'underline' : 'none';
    const textStyle = `font-family:${font};font-size:${small};line-height:1.6;color:${textColor};text-align:${align};overflow-wrap:anywhere;word-break:break-word;`;
    const linkStyle = `font-family:${font};font-size:${small};line-height:1.6;color:${linkColor};text-decoration:${decoration} !important;word-break:break-word;`;
    const tableStyle = `border-collapse:collapse;border-spacing:0;text-align:${align};`;
    const copyright = typeof footer.copyrightText === 'string' && footer.copyrightText.trim()
        ? escapeHtml(footer.copyrightText) : '';
    const unsubscribeText = typeof footer.unsubscribeText === 'string' && footer.unsubscribeText.trim()
        ? footer.unsubscribeText : '';
    const unsubscribeUrl = safeUrl(footer.unsubscribeUrl, true);
    const unsubscribe = unsubscribeText
        ? unsubscribeUrl
            ? `<a href="${escapeHtml(unsubscribeUrl)}" style="${escapeHtml(linkStyle)}">${escapeHtml(unsubscribeText)}</a>`
            : escapeHtml(unsubscribeText)
        : '';
    const links = [];
    for (const link of footer.links ?? []) {
        const url = safeUrl(link?.url, true);
        if (url && typeof link?.text === 'string' && link.text.trim())
            links.push({ text: link.text, url });
    }
    const social = [];
    for (const link of footer.socialLinks ?? []) {
        const url = safeUrl(link?.url, false);
        // Platforms remain textual, including custom names received from JavaScript callers.
        if (url && typeof link?.platform === 'string' && link.platform.trim())
            social.push({ text: link.platform, url });
    }
    function linkTable(items, vertical = false, prominent = false, socialOnly = false) {
        if (!items.length)
            return '';
        const perRow = vertical ? 1 : 4;
        const rows = [];
        for (let start = 0; start < items.length; start += perRow) {
            const row = items.slice(start, start + perRow);
            rows.push(`<tr>${row.map((item, index) => {
                const horizontalPadding = vertical ? '0' : '8px';
                const edgePadding = row.length === 1 ? '0' : horizontalPadding;
                const style = `${textStyle}padding:3px ${index === row.length - 1 ? '0' : edgePadding} 3px ${index === 0 ? '0' : edgePadding};vertical-align:top;`;
                return `<td class="footer-link-cell" align="${align}" valign="top" style="${escapeHtml(style)}"><a href="${escapeHtml(item.url)}" style="${escapeHtml(linkStyle + (prominent ? `font-weight:${weight};` : ''))}">${escapeHtml(item.text)}</a></td>`;
            }).join('')}</tr>`);
        }
        return `<table class="footer-links${socialOnly ? ' footer-social-links' : ''}" align="${align}" cellpadding="0" cellspacing="0" border="0" role="presentation" style="${escapeHtml(tableStyle + 'width:auto;max-width:100%;')}">${rows.join('')}</table>`;
    }
    function fullTable(content, className, extraStyle = '') {
        return `<table class="${className}" width="100%" align="${align}" cellpadding="0" cellspacing="0" border="0" role="presentation" style="${escapeHtml(tableStyle + 'width:100%;table-layout:fixed;' + extraStyle)}">${content}</table>`;
    }
    function row(content, extraStyle = '') {
        return `<tr><td align="${align}" style="${escapeHtml(textStyle + extraStyle)}">${content}</td></tr>`;
    }
    function meta(signature = false) {
        if (!copyright && !unsubscribe)
            return '';
        return fullTable((copyright ? row(copyright, signature ? `font-size:${medium};font-weight:${weight};` : '') : '')
            + (unsubscribe ? row(unsubscribe, copyright ? 'padding-top:5px;' : '') : ''), 'footer-meta');
    }
    function navigation(vertical = false, prominent = false) {
        const nav = linkTable(links, vertical, prominent);
        const socials = linkTable(social, vertical, false, true);
        return fullTable((nav ? row(nav) : '') + (socials ? row(socials, nav ? 'padding-top:8px;' : '') : ''), 'footer-navigation');
    }
    const hasNav = links.length > 0 || social.length > 0;
    const hasMeta = Boolean(copyright || unsubscribe);
    let content;
    let boundary = '';
    switch (layout) {
        case 'colophon': {
            // A stacked closing imprint, with a full-width rule separating navigation and legal copy.
            boundary = `border-top:1px solid ${ruleColor};`;
            content = fullTable((hasNav ? row(navigation()) : '')
                + (hasMeta ? row(meta(), hasNav ? `padding-top:18px;border-top:1px solid ${ruleColor};` : '') : ''), 'footer-colophon-stack');
            break;
        }
        case 'columns': {
            // Open, balanced desktop columns; layout-column is the shared mobile stacking hook.
            if (hasNav && hasMeta) {
                content = fullTable(`<tr><td class="layout-column footer-nav-column" width="54%" align="${align}" valign="top" style="${escapeHtml(textStyle + 'width:54%;padding-right:12px;')}">${navigation(true)}</td><td class="layout-column footer-meta-column" width="46%" align="${align}" valign="top" style="${escapeHtml(textStyle + 'width:46%;padding-left:12px;')}">${meta()}</td></tr>`, 'footer-column-layout');
            }
            else {
                content = fullTable(row(hasNav ? navigation(true) : meta()), 'footer-column-layout');
            }
            break;
        }
        case 'band': {
            // A solid-color, emphatic navigation band followed by a quieter full-width legal strip.
            boundary = `border-top:4px solid ${linkColor};`;
            let navRow = '';
            if (links.length && social.length) {
                navRow = `<tr><td class="layout-column footer-band-nav" width="60%" align="${align}" valign="top" style="${escapeHtml(textStyle + 'width:60%;padding-right:12px;')}">${linkTable(links, false, true)}</td><td class="layout-column footer-band-social" width="40%" align="${align}" valign="top" style="${escapeHtml(textStyle + 'width:40%;padding-left:12px;')}">${linkTable(social, false, false, true)}</td></tr>`;
            }
            else if (hasNav) {
                navRow = row(links.length ? linkTable(links, false, true) : linkTable(social, false, false, true));
            }
            content = fullTable((navRow ? row(fullTable(navRow, 'footer-band-navigation')) : '')
                + (hasMeta ? row(meta(), hasNav ? `padding-top:16px;border-top:1px solid ${ruleColor};` : '') : ''), 'footer-band-layout');
            break;
        }
        case 'ledger': {
            // Legal copy leads; a ruled second column contains the navigation as an itemized register.
            boundary = `border-top:1px solid ${ruleColor};border-bottom:1px solid ${ruleColor};`;
            if (hasNav && hasMeta) {
                content = fullTable(`<tr><td class="layout-column footer-legal-column" width="60%" align="${align}" valign="top" style="${escapeHtml(textStyle + 'width:60%;padding-right:20px;')}">${meta()}</td><td class="layout-column footer-ledger-nav" width="40%" align="${align}" valign="top" style="${escapeHtml(textStyle + `width:40%;padding-left:20px;border-left:1px solid ${ruleColor};`)}">${navigation(true)}</td></tr>`, 'footer-ledger-layout');
            }
            else {
                content = fullTable(row(hasMeta ? meta() : navigation(true)), 'footer-ledger-layout');
            }
            break;
        }
        case 'signature': {
            // Understated, open-space sign-off: short rule, caller's closing copy, then quiet links.
            const rule = `<table class="footer-signature-rule" width="36" align="${align}" cellpadding="0" cellspacing="0" border="0" role="presentation" style="${escapeHtml(tableStyle + 'width:36px;')}"><tr><td height="1" bgcolor="${escapeHtml(ruleColor)}" style="${escapeHtml(`height:1px;font-size:0;line-height:0;background-color:${ruleColor};`)}"></td></tr></table>`;
            content = fullTable(row(rule, 'padding-bottom:20px;')
                + (hasMeta ? row(meta(true)) : '')
                + (hasNav ? row(navigation(), hasMeta ? 'padding-top:20px;' : '') : ''), 'footer-signature-layout');
            break;
        }
        case 'minimal':
        default: {
            // Compact legal line and a single combined navigation group, without borders or ornaments.
            let legalLine = '';
            if (hasMeta) {
                legalLine = `<table class="footer-meta footer-meta-inline" align="${align}" cellpadding="0" cellspacing="0" border="0" role="presentation" style="${escapeHtml(tableStyle + 'width:auto;max-width:100%;')}"><tr>${copyright ? `<td align="${align}" style="${escapeHtml(textStyle)}">${copyright}</td>` : ''}${unsubscribe ? `<td align="${align}" style="${escapeHtml(textStyle + (copyright ? 'padding-left:12px;' : ''))}">${unsubscribe}</td>` : ''}</tr></table>`;
            }
            content = fullTable((legalLine ? row(legalLine) : '')
                + (hasNav ? row(linkTable([...links, ...social]), hasMeta ? 'padding-top:6px;' : '') : ''), 'footer-minimal-layout');
            break;
        }
    }
    const rootStyle = `${tableStyle}width:100%;background-color:${background};color:${textColor};`;
    const cellStyle = `${textStyle}background-color:${background};padding:${paddingY}px ${paddingX}px;${boundary}`;
    return `<table class="theme-footer theme-footer-${layout}" data-footer-layout="${layout}" width="100%" align="${align}" cellpadding="0" cellspacing="0" border="0" role="presentation" bgcolor="${escapeHtml(background)}" style="${escapeHtml(rootStyle)}"><tr><td class="email-footer-cell" data-surface="${escapeHtml(background)}" align="${align}" bgcolor="${escapeHtml(background)}" style="${escapeHtml(cellStyle)}">${content}</td></tr></table>`;
}
