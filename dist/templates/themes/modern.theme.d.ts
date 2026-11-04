import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
export declare class ModernTheme implements ITheme {
    id: ThemeType;
    name: string;
    light: IThemeColors;
    dark: IThemeColors;
    typography: ITypography;
    spacing: ISpacing;
    emailStyles: IThemeEmailStyles;
    gradients: {
        primary: string;
        secondary: string;
        accent: string;
        dark: string;
        light: string;
    };
    borderStyle: {
        radius: {
            small: string;
            medium: string;
            large: string;
            full: string;
        };
        width: string;
        style: string;
    };
    glassmorphism: {
        light: string;
        dark: string;
        blur: string;
    };
    animations: {
        hover: string;
        fade: string;
        slide: string;
    };
}
//# sourceMappingURL=modern.theme.d.ts.map