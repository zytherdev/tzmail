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
    canvas: {
        light: string;
        dark: string;
    };
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
export declare const DEFAULT_COMPOSITION: IThemeComposition;
export declare function surfaceColor(surface: ThemeSurface, colors: IThemeColors): string;
/** Legacy custom themes retain their own typography, spacing, and button appearance. */
export declare function resolveThemeComposition(theme: ITheme): IThemeComposition;
//# sourceMappingURL=theme-composition.d.ts.map