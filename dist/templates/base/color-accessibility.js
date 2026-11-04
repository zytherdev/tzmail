"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contrastRatio = contrastRatio;
exports.accessibleTextColor = accessibleTextColor;
exports.readableTextColor = readableTextColor;
function relativeLuminance(color) {
    const hex = color.replace(/^#/, '');
    const normalized = hex.length === 3 ? hex.split('').map(channel => channel + channel).join('') : hex;
    if (!/^[\da-f]{6}$/i.test(normalized))
        return undefined;
    const channels = [0, 2, 4].map(offset => Number.parseInt(normalized.slice(offset, offset + 2), 16) / 255);
    return channels.map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
        .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
}
function contrastRatio(foreground, background) {
    const foregroundLuminance = relativeLuminance(foreground);
    const backgroundLuminance = relativeLuminance(background);
    if (foregroundLuminance === undefined || backgroundLuminance === undefined)
        return 0;
    const lighter = Math.max(foregroundLuminance, backgroundLuminance);
    const darker = Math.min(foregroundLuminance, backgroundLuminance);
    return (lighter + 0.05) / (darker + 0.05);
}
function accessibleTextColor(background) {
    const luminance = relativeLuminance(background);
    if (luminance === undefined)
        return '#ffffff';
    const whiteContrast = 1.05 / (luminance + 0.05);
    const blackContrast = (luminance + 0.05) / 0.05;
    return whiteContrast >= blackContrast ? '#ffffff' : '#000000';
}
function readableTextColor(preferred, background, fallback) {
    if (contrastRatio(preferred, background) >= 4.5)
        return preferred;
    if (fallback && contrastRatio(fallback, background) >= 4.5)
        return fallback;
    return accessibleTextColor(background);
}
