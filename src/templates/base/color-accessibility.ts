import { CSS_NAMED_COLORS } from './css-named-colors';

type Rgba = [number, number, number, number];
const clamp = (value: number, maximum: number) => Math.min(maximum, Math.max(0, value));
function parseCssColor(input: string): Rgba | undefined {
  if (typeof input !== 'string') return undefined;
  const color = input.trim().toLowerCase();
  if (['transparent', 'inherit', 'currentcolor'].includes(color)) return [0, 0, 0, 0];
  const named = CSS_NAMED_COLORS[color];
  if (named) return parseCssColor(named);
  const hex = /^#([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/.exec(color)?.[1];
  if (hex) {
    const expanded = hex.length <= 4 ? [...hex].map(char => char + char).join('') : hex;
    return [0, 2, 4].map(offset => Number.parseInt(expanded.slice(offset, offset + 2), 16)).concat(expanded.length === 8 ? Number.parseInt(expanded.slice(6), 16) / 255 : 1) as Rgba;
  }
  const fn = /^(rgb|rgba|hsl|hsla)\(([^)]+)\)$/.exec(color);
  if (!fn) return undefined;
  const parts = fn[2].replace(/[,/]/g, ' ').trim().split(/\s+/);
  if (parts.length < 3 || parts.length > 4 || parts.some(part => !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)%?$/.test(part))) return undefined;
  const alpha = parts[3] === undefined ? 1 : clamp(Number.parseFloat(parts[3]) / (parts[3].endsWith('%') ? 100 : 1), 1);
  if (fn[1].startsWith('rgb')) {
    const channels = parts.slice(0, 3).map(part => clamp(Number.parseFloat(part) * (part.endsWith('%') ? 255 / 100 : 1), 255));
    return [...channels, alpha] as Rgba;
  }
  if (!parts[1].endsWith('%') || !parts[2].endsWith('%')) return undefined;
  const hue = ((Number.parseFloat(parts[0]) % 360) + 360) % 360;
  const saturation = clamp(Number.parseFloat(parts[1]), 100) / 100;
  const lightness = clamp(Number.parseFloat(parts[2]), 100) / 100;
  const amplitude = saturation * Math.min(lightness, 1 - lightness);
  const channel = (n: number) => {
    const k = (n + hue / 30) % 12;
    return (lightness - amplitude * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255;
  };
  return [channel(0), channel(8), channel(4), alpha];
}

/** Resolve CSS colors to an opaque, measurable surface before emitting email section backgrounds. */
export function normalizeCssColor(color: string, underneath = '#ffffff'): string | undefined {
  const rgba = parseCssColor(color);
  if (!rgba) return undefined;
  if (rgba[3] === 1 && /^#[\da-f]{6}$/i.test(color.trim())) return color.trim();
  const base = parseCssColor(underneath) ?? [255, 255, 255, 1];
  return '#' + rgba.slice(0, 3).map((channel, i) => Math.round(channel * rgba[3] + base[i] * (1 - rgba[3])).toString(16).padStart(2, '0')).join('');
}
function relativeLuminance(color: string): number | undefined {
  const normalized = normalizeCssColor(color);
  if (!normalized) return undefined;
  const channels = [1, 3, 5].map(offset => Number.parseInt(normalized.slice(offset, offset + 2), 16) / 255);
  return channels.map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
}
export function contrastRatio(foreground: string, background: string): number {
  const effectiveBackground = normalizeCssColor(background);
  if (!effectiveBackground) return 0;
  const foregroundLuminance = relativeLuminance(normalizeCssColor(foreground, effectiveBackground) ?? '');
  const backgroundLuminance = relativeLuminance(effectiveBackground);
  if (foregroundLuminance === undefined || backgroundLuminance === undefined) return 0;
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}
export function accessibleTextColor(background: string): '#000000' | '#ffffff' {
  const luminance = relativeLuminance(background) ?? 1;
  const whiteContrast = 1.05 / (luminance + 0.05);
  const blackContrast = (luminance + 0.05) / 0.05;
  return whiteContrast >= blackContrast ? '#ffffff' : '#000000';
}
export function readableTextColor(preferred: string, background: string, fallback?: string): string {
  if (contrastRatio(preferred, background) >= 4.5) return preferred;
  if (fallback && contrastRatio(fallback, background) >= 4.5) return fallback;
  return accessibleTextColor(background);
}
