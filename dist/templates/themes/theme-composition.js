"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_COMPOSITION = void 0;
exports.surfaceColor = surfaceColor;
exports.resolveThemeComposition = resolveThemeComposition;
exports.DEFAULT_COMPOSITION = {
    name: 'Clean letter', description: 'Conservative, content-first composition for custom themes.',
    canvas: { light: '#f3f4f6', dark: '#0c111b' },
    header: { layout: 'quiet', alignment: 'left', surface: 'background', paddingY: 24, logoSize: 22 },
    body: { layout: 'story', alignment: 'left', surface: 'background', paddingX: 28, paddingY: 32,
        titleSize: 32, titleFont: 'Arial, Helvetica, sans-serif', titleWeight: 700, titleTracking: '-0.03em', titleLineHeight: 1.1, measurePx: 500 },
    button: { style: 'block', fullWidth: false, paddingX: 26, paddingY: 16 },
    footer: { layout: 'minimal', alignment: 'left', surface: 'background', paddingY: 24 }
};
function surfaceColor(surface, colors) {
    return colors[surface];
}
function pixels(value, fallback) {
    if (!value)
        return fallback;
    const match = /^(\d+(?:\.\d+)?)(px|pt|rem|em)?$/.exec(value.trim());
    if (!match)
        return fallback;
    const number = Number(match[1]);
    return number * (match[2] === 'pt' ? 4 / 3 : ['rem', 'em'].includes(match[2]) ? 16 : 1);
}
/** Legacy custom themes retain their own typography, spacing, and button appearance. */
function resolveThemeComposition(theme) {
    if (theme.composition)
        return theme.composition;
    return {
        ...exports.DEFAULT_COMPOSITION,
        canvas: { ...exports.DEFAULT_COMPOSITION.canvas },
        header: { ...exports.DEFAULT_COMPOSITION.header },
        body: {
            ...exports.DEFAULT_COMPOSITION.body,
            titleSize: pixels(theme.typography.fontSizes.xlarge, exports.DEFAULT_COMPOSITION.body.titleSize),
            titleFont: theme.typography.fontFamily,
            titleWeight: theme.typography.fontWeights.bold,
            paddingX: pixels(theme.emailStyles?.body.horizontalPadding, exports.DEFAULT_COMPOSITION.body.paddingX)
        },
        button: {
            ...exports.DEFAULT_COMPOSITION.button,
            style: theme.emailStyles?.button.appearance === 'outline' ? 'outline' : 'block'
        },
        footer: { ...exports.DEFAULT_COMPOSITION.footer }
    };
}
