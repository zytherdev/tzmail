"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderThemeHeader = renderThemeHeader;
const theme_composition_1 = require("../themes/theme-composition");
const color_accessibility_1 = require("./color-accessibility");
function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
}
/** Keep the same absolute-URL policy as TemplateBuilder; images never allow mailto. */
function safeHref(value) {
    if (typeof value !== 'string' || !value.trim() || /[\u0000-\u0020"'<>\\]/.test(value)) {
        throw new Error('Unsafe URL in template');
    }
    let url;
    try {
        url = new URL(value);
    }
    catch {
        throw new Error('Template URLs must be absolute');
    }
    if (!['http:', 'https:'].includes(url.protocol.toLowerCase())) {
        throw new Error('Unsafe URL scheme in template');
    }
    return escapeHtml(value);
}
/** Single CSS values only: custom typography must not introduce another declaration. */
function cssValue(value, fallback) {
    return value && !/[;{}<>\\\u0000-\u001f]/.test(value) && !/url\s*\(|expression\s*\(/i.test(value)
        ? value : fallback;
}
function pixelSize(value, fallback, min = 0, max = 160) {
    return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}
/**
 * Header art direction is structural: caller-provided words/images are the only content.
 * All layout tables are email-safe, with explicit surfaces for dark-mode/client fallbacks.
 */
function renderThemeHeader(theme, config, variant, content) {
    const header = config.header;
    if (!header?.show)
        return '';
    const composition = (0, theme_composition_1.resolveThemeComposition)(theme);
    const plan = composition.header;
    const layout = plan.layout;
    const colors = variant === 'light' ? theme.light : theme.dark;
    const styles = theme.emailStyles?.header;
    const requestedAlignment = header.alignment ?? plan.alignment;
    const alignment = ['left', 'center', 'right'].includes(requestedAlignment)
        ? requestedAlignment : theme_composition_1.DEFAULT_COMPOSITION.header.alignment;
    const background = (0, color_accessibility_1.normalizeCssColor)(cssValue(header.backgroundColor, (0, theme_composition_1.surfaceColor)(plan.surface, colors)), colors.background) ?? colors.background;
    const preferredText = cssValue(header.textColor, colors.text);
    const foreground = (0, color_accessibility_1.readableTextColor)(preferredText, background, colors.text);
    const paddingX = cssValue(styles?.horizontalPadding, `${pixelSize(composition.body.paddingX, 28)}px`);
    const paddingY = pixelSize(plan.paddingY, 24);
    const logoSize = header.logo?.size === 'small' ? 18 : header.logo?.size === 'medium' ? 26 : header.logo?.size === 'large' ? 38 : pixelSize(plan.logoSize, 22, 18, 48);
    const fontFamily = cssValue(theme.typography.fontFamily, 'Arial, Helvetica, sans-serif');
    const logoFontFamily = cssValue(styles?.logoFontFamily, fontFamily);
    const imageRadius = cssValue(styles?.imageBorderRadius, '0px');
    const primary = cssValue(colors.primary, background);
    const secondary = cssValue(colors.secondary, colors.border);
    // A secondary plane remains visible even when the chosen root surface is primary.
    const alternate = primary.toLowerCase() === background.toLowerCase() ? secondary : primary;
    const ruleColor = (0, color_accessibility_1.readableTextColor)(primary, background, foreground);
    const textWeight = pixelSize(theme.composition ? theme.typography.fontWeights.bold : theme.typography.fontWeights.medium, 700, 100, 900);
    const normalWeight = pixelSize(theme.typography.fontWeights.normal, 400, 100, 900);
    const transform = ['none', 'uppercase', 'capitalize'].includes(styles?.logoTextTransform ?? '')
        ? styles.logoTextTransform : 'none';
    const tracking = cssValue(styles?.logoLetterSpacing, layout === 'billboard' ? '-0.045em' : layout === 'masthead' ? '-0.025em' : layout === 'quiet' ? '0.025em' : 'normal');
    const style = (value) => `style="${escapeHtml(value)}"`;
    const table = (rows, extra = '', tableStyle = 'width:100%;') => `<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" ${extra} ${style(`border-collapse:collapse;table-layout:fixed;mso-table-lspace:0pt;mso-table-rspace:0pt;${tableStyle}`)}>${rows}</table>`;
    const surface = (color, extra = '', preferred = preferredText) => `bgcolor="${escapeHtml(color)}" data-surface="${escapeHtml(color)}" ${style(`background-color:${color};color:${(0, color_accessibility_1.readableTextColor)(preferred, color, colors.text)};${extra}`)}`;
    const spacer = (height) => `<tr><td aria-hidden="true" height="${height}" ${style(`height:${height}px;font-size:0;line-height:0;`)}></td></tr>`;
    const rule = (color, height = 1, width = '100%', align = alignment) => `<table width="${escapeHtml(width)}" align="${align}" border="0" cellpadding="0" cellspacing="0" role="presentation" aria-hidden="true" ${style(`width:${typeof width === 'number' ? `${width}px` : width};border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;`)}><tr><td bgcolor="${escapeHtml(color)}" height="${height}" ${style(`background-color:${color};height:${height}px;font-size:0;line-height:0;`)}></td></tr></table>`;
    const text = (color, extra = '') => content
        ? `<div ${style(`font-family:${fontFamily};font-size:14px;font-weight:${normalWeight};line-height:1.55;color:${(0, color_accessibility_1.readableTextColor)(preferredText, color, colors.text)};text-align:${alignment};overflow-wrap:anywhere;word-wrap:break-word;word-break:break-word;${extra}`)}>${escapeHtml(content)}</div>`
        : '';
    const logo = (color, extra = '') => {
        if (!header.logo)
            return '';
        if (header.logo.type === 'text') {
            if (!header.logo.text)
                return '';
            const preferredLogo = header.textColor ? preferredText : colors[styles?.logoColor ?? 'text'];
            // Keep a styled div (rather than a heading/span) for existing logo-style extraction.
            return `<div ${style(`display:inline-block;max-width:100%;font-family:${logoFontFamily};font-size:${logoSize}px;font-weight:${textWeight};line-height:1.08;color:${(0, color_accessibility_1.readableTextColor)(preferredLogo, color, colors.text)};text-align:${alignment};text-transform:${transform};letter-spacing:${tracking};overflow-wrap:anywhere;word-wrap:break-word;word-break:break-word;${extra}`)} data-logo-surface="${escapeHtml(color)}">${escapeHtml(header.logo.text)}</div>`;
        }
        if (header.logo.type === 'image') {
            const height = header.logo.size === 'small' ? 22 : header.logo.size === 'large' ? 48 : logoSize;
            const margin = alignment === 'center' ? '0 auto' : alignment === 'right' ? '0 0 0 auto' : '0';
            return `<img src="${safeHref(header.logo.imageUrl ?? '')}" alt="${escapeHtml(header.logo.alt ?? '')}" height="${height}" ${style(`display:block;width:auto;height:${height}px;max-width:100%;border:0;border-radius:${imageRadius};margin:${margin};`)} />`;
        }
        return '';
    };
    let rendered;
    switch (layout) {
        case 'masthead': {
            // A typographic newspaper masthead: full-width name between two unequal rules.
            rendered = table(`<tr><td>${rule(ruleColor, 1)}</td></tr>` +
                `<tr><td align="${alignment}" ${surface(background, 'padding:24px 0 18px;')}>${logo(background)}</td></tr>` +
                (content ? `<tr><td align="${alignment}" ${surface(background, 'padding:0 0 20px;')}>${text(background)}</td></tr>` : '') +
                `<tr><td>${rule(ruleColor, 3)}</td></tr>` +
                spacer(4) +
                `<tr><td>${rule(ruleColor, 1)}</td></tr>`);
            break;
        }
        case 'billboard': {
            // An oversized wordmark beside an offset, two-tone architectural block.
            const block = table(`<tr><td aria-hidden="true" height="52" ${surface(alternate, 'height:52px;font-size:0;line-height:0;')}></td></tr>` +
                `<tr><td aria-hidden="true" height="34" ${surface(secondary, 'height:34px;font-size:0;line-height:0;')}></td></tr>`, 'aria-hidden="true"');
            rendered = table(`<tr><td class="layout-column" width="78%" valign="bottom" align="${alignment}" ${surface(background, 'width:78%;padding:32px 20px 26px 0;')}>${logo(background)}</td>` +
                `<td class="layout-column" width="22%" valign="top" aria-hidden="true" ${surface(alternate, 'width:22%;padding:0;')}>${block}</td></tr>` +
                `<tr><td colspan="2" align="${alignment}" ${surface(alternate, 'padding:20px 24px;')}>${text(alternate)}${content ? '' : rule(secondary, 8, 64)}</td></tr>`);
            break;
        }
        case 'split-band': {
            // Two genuinely independent planes: a compact brand block and a wide text band.
            rendered = table(`<tr><td class="layout-column" width="38%" valign="middle" align="${alignment}" ${surface(alternate, 'width:38%;padding:26px 20px;')}>${logo(alternate)}</td>` +
                `<td class="layout-column" width="62%" valign="middle" align="${alignment}" ${surface(background, 'width:62%;padding:34px 0 34px 24px;')}>${text(background) || rule(ruleColor, 2, 48)}</td></tr>` +
                `<tr><td colspan="2" ${style('padding:16px 0 0;')}>${rule(secondary, 6, '38%', alignment)}</td></tr>`);
            break;
        }
        case 'label': {
            // An inset, intrinsic-width plaque; the edge color is a table cell, not a border trick.
            const plaque = `<table align="${alignment}" border="0" cellpadding="0" cellspacing="0" role="presentation" ${style(`max-width:100%;border-collapse:collapse;border:1px solid ${ruleColor};mso-table-lspace:0pt;mso-table-rspace:0pt;`)}><tr>` +
                `<td width="8" aria-hidden="true" ${surface(alternate, 'width:8px;font-size:0;line-height:0;')}></td>` +
                `<td align="${alignment}" ${surface(background, 'padding:20px 24px;')}>${logo(background)}${text(background, header.logo ? 'padding-top:12px;' : '')}</td></tr></table>`;
            rendered = table(spacer(8) +
                `<tr><td align="${alignment}">${plaque}</td></tr>` +
                spacer(14) +
                `<tr><td align="${alignment}">${rule(alternate, 5, 72)}</td></tr>` +
                spacer(8));
            break;
        }
        case 'monogram': {
            // The caller's complete logo occupies a seal-like tile; no invented initials.
            const tileSize = Math.max(92, logoSize * 3);
            rendered = table(`<tr><td class="layout-column" width="40%" valign="middle" align="${alignment}" ${surface(alternate, `width:40%;height:${tileSize}px;padding:24px 18px;`)}>${logo(alternate)}</td>` +
                `<td class="layout-column" width="60%" valign="bottom" align="${alignment}" ${surface(background, 'width:60%;padding:0 0 12px 26px;')}>` +
                table(`<tr><td align="${alignment}">${rule(secondary, 22, 22)}</td></tr>` + spacer(28) + `<tr><td align="${alignment}" ${surface(background)}>${text(background)}</td></tr>`) +
                `</td></tr>` +
                `<tr><td aria-hidden="true" ${style('padding:10px 0 0;')}>${rule(secondary, 14, 28)}</td><td aria-hidden="true"></td></tr>`);
            break;
        }
        case 'terminal': {
            // A disciplined gutter and indented rows, without fake prompts, controls or statuses.
            const rows = content ? 4 : 3;
            rendered = table(`<tr><td width="6" rowspan="${rows}" aria-hidden="true" ${surface(alternate, 'width:6px;font-size:0;line-height:0;')}></td>` +
                `<td align="${alignment}" ${surface(background, 'padding:0 0 18px 22px;')}>${rule(secondary, 4, 36)}</td></tr>` +
                `<tr><td align="${alignment}" ${surface(background, 'padding:0 0 16px 22px;')}>${logo(background, 'line-height:1.2;')}</td></tr>` +
                (content ? `<tr><td align="${alignment}" ${surface(background, 'padding:0 0 22px 22px;')}>${text(background)}</td></tr>` : '') +
                `<tr><td ${style('padding:0 0 0 22px;')}>` +
                table(`<tr><td width="72%" aria-hidden="true" ${surface(alternate, 'width:72%;height:2px;font-size:0;line-height:0;')}></td><td width="8%" aria-hidden="true" ${style('width:8%;font-size:0;line-height:0;')}></td><td width="20%" aria-hidden="true" ${surface(secondary, 'width:20%;height:2px;font-size:0;line-height:0;')}></td></tr>`, 'aria-hidden="true"') +
                `</td></tr>`);
            break;
        }
        case 'ruled': {
            // Rules flank the wordmark on its baseline instead of framing stacked header rows.
            const flank = (width) => `<td width="${width}" valign="middle" aria-hidden="true" ${style(`width:${width};padding:0 12px;`)}>${rule(ruleColor, 1)}</td>`;
            const leading = alignment !== 'left' ? flank(alignment === 'center' ? '10%' : '40%') : '';
            const trailing = alignment !== 'right' ? flank(alignment === 'center' ? '10%' : '40%') : '';
            rendered = table(`<tr>${leading}<td align="${alignment}" valign="middle" ${surface(background, 'padding:12px 0;')}>${logo(background)}</td>${trailing}</tr>` +
                (content ? `<tr><td colspan="${alignment === 'center' ? 3 : 2}" align="${alignment}" ${surface(background, 'padding:14px 0 4px;')}>${text(background)}</td></tr>` : ''));
            break;
        }
        case 'quiet':
        default: {
            // Luxury air: no panel, no frame, just a name, a deliberate pause and a short stroke.
            rendered = table(spacer(16) +
                `<tr><td align="${alignment}" ${surface(background, 'padding:0;')}>${logo(background)}</td></tr>` +
                (content ? spacer(18) + `<tr><td align="${alignment}" ${surface(background)}>${text(background)}</td></tr>` : '') +
                spacer(32) +
                `<tr><td align="${alignment}">${rule(ruleColor, 1, 24)}</td></tr>` +
                spacer(12));
            break;
        }
    }
    // Optional media is appended to, never substituted for, the structural theme identity.
    const hero = header.heroImageUrl
        ? table(`<tr><td align="${alignment}" ${surface(background, 'padding:24px 0 0;')}><img src="${safeHref(header.heroImageUrl)}" alt="${escapeHtml(header.heroAlt ?? '')}" width="600" ${style(`display:block;width:100%;max-width:600px;height:auto;border:0;border-radius:${imageRadius};`)} /></td></tr>`)
        : '';
    return table(`<tr><td class="email-header-cell" align="${alignment}" ${surface(background, `padding:${paddingY}px ${paddingX};font-family:${fontFamily};text-align:${alignment};`)}>${rendered}${hero}</td></tr>`, `class="theme-header theme-header-${escapeHtml(layout)}" data-header-layout="${escapeHtml(layout)}" bgcolor="${escapeHtml(background)}"`, `width:100%;background-color:${background};color:${foreground};`);
}
