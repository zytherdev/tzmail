import type { ITheme, IThemeColors } from './theme.interface';

export type ThemeAlignment = 'left' | 'center' | 'right';
export type ThemeSurface = 'background' | 'primary' | 'secondary' | 'text' | 'border';
export type HeaderComposition = 'masthead' | 'billboard' | 'split-band' | 'label' | 'monogram' | 'terminal' | 'ruled' | 'quiet';
export type BodyComposition = 'story' | 'columns' | 'panel' | 'accent-rail' | 'manifesto' | 'letter' | 'outline' | 'index';
export type FooterComposition = 'colophon' | 'columns' | 'band' | 'ledger' | 'signature' | 'minimal';

/** Declarative composition; no fake content, images or client-specific effects required. */
export interface IThemeComposition {
  name: string;
  description: string;
  canvas: { light: string; dark: string };
  header: {
    layout: HeaderComposition;
    alignment: ThemeAlignment;
    surface: ThemeSurface;
    paddingY: number;
    logoSize: number;
  };
  body: {
    layout: BodyComposition;
    alignment: ThemeAlignment;
    surface: ThemeSurface;
    paddingX: number;
    paddingY: number;
    titleSize: number;
    titleFont: string;
    titleWeight: number;
    titleTracking: string;
    titleLineHeight: number;
    measurePx: number;
  };
  button: {
    style: 'block' | 'pill' | 'outline' | 'editorial' | 'offset';
    fullWidth: boolean;
    paddingX: number;
    paddingY: number;
  };
  footer: {
    layout: FooterComposition;
    alignment: ThemeAlignment;
    surface: ThemeSurface;
    paddingY: number;
  };
}

export const DEFAULT_COMPOSITION: IThemeComposition = {
  name: 'Clean letter', description: 'Conservative, content-first composition for custom themes.',
  canvas: { light: '#f3f4f6', dark: '#0c111b' },
  header: { layout: 'quiet', alignment: 'left', surface: 'background', paddingY: 24, logoSize: 22 },
  body: { layout: 'story', alignment: 'left', surface: 'background', paddingX: 28, paddingY: 32,
    titleSize: 32, titleFont: 'Arial, Helvetica, sans-serif', titleWeight: 700, titleTracking: '-0.03em', titleLineHeight: 1.1, measurePx: 500 },
  button: { style: 'block', fullWidth: false, paddingX: 26, paddingY: 16 },
  footer: { layout: 'minimal', alignment: 'left', surface: 'background', paddingY: 24 }
};

export function surfaceColor(surface: ThemeSurface, colors: IThemeColors): string {
  return colors[surface];
}

function pixels(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const match = /^(\d+(?:\.\d+)?)(px|pt|rem|em)?$/.exec(value.trim());
  if (!match) return fallback;
  const number = Number(match[1]);
  return number * (match[2] === 'pt' ? 4 / 3 : ['rem', 'em'].includes(match[2]) ? 16 : 1);
}

/** Legacy custom themes retain their own typography, spacing, and button appearance. */
export function resolveThemeComposition(theme: ITheme): IThemeComposition {
  if (theme.composition) return theme.composition;
  return {
    ...DEFAULT_COMPOSITION,
    canvas: { ...DEFAULT_COMPOSITION.canvas },
    header: { ...DEFAULT_COMPOSITION.header },
    body: {
      ...DEFAULT_COMPOSITION.body,
      titleSize: pixels(theme.typography.fontSizes.xlarge, DEFAULT_COMPOSITION.body.titleSize),
      titleFont: theme.typography.fontFamily,
      titleWeight: theme.typography.fontWeights.bold,
      paddingX: pixels(theme.emailStyles?.body.horizontalPadding, DEFAULT_COMPOSITION.body.paddingX)
    },
    button: {
      ...DEFAULT_COMPOSITION.button,
      style: theme.emailStyles?.button.appearance === 'outline' ? 'outline' : 'block'
    },
    footer: { ...DEFAULT_COMPOSITION.footer }
  };
}
