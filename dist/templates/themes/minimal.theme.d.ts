import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
export declare class MinimalTheme implements ITheme {
    id: ThemeType;
    name: string;
    light: IThemeColors;
    dark: IThemeColors;
    typography: ITypography;
    spacing: ISpacing;
    emailStyles: IThemeEmailStyles;
    minimalColors: {
        white: string;
        black: string;
        gray100: string;
        gray200: string;
        gray300: string;
        gray400: string;
        gray500: string;
        gray600: string;
        gray700: string;
        gray800: string;
        gray900: string;
    };
    borderStyle: {
        radius: {
            none: string;
            small: string;
            medium: string;
            large: string;
            full: string;
        };
        width: {
            thin: string;
            medium: string;
        };
        style: string;
    };
    effects: {
        shadow: string;
        transition: string;
        opacity: {
            hover: string;
            disabled: string;
        };
    };
    layout: {
        maxWidth: string;
        contentWidth: string;
        spacingMultiplier: number;
        lineHeight: number;
        paragraphSpacing: string;
    };
    designSystem: {
        grid: {
            columns: number;
            gutter: string;
            margin: string;
        };
        breakpoints: {
            mobile: string;
            tablet: string;
            desktop: string;
        };
        zIndex: {
            base: number;
            overlay: number;
            modal: number;
        };
    };
}
//# sourceMappingURL=minimal.theme.d.ts.map