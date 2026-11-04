import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
export declare class CorporateTheme implements ITheme {
    id: ThemeType;
    name: string;
    light: IThemeColors;
    dark: IThemeColors;
    typography: ITypography;
    spacing: ISpacing;
    corporateColors: {
        gold: string;
        silver: string;
        bronze: string;
        navy: string;
        charcoal: string;
        ivory: string;
    };
    borderStyle: {
        radius: {
            small: string;
            medium: string;
            large: string;
            pill: string;
        };
        width: {
            thin: string;
            medium: string;
            thick: string;
        };
        style: string;
    };
    elevation: {
        shadow: string;
        card: string;
        modal: string;
        hover: string;
    };
    branding: {
        logoSize: {
            small: string;
            medium: string;
            large: string;
        };
        letterSpacing: {
            tight: string;
            normal: string;
            wide: string;
            wider: string;
        };
        textTransform: {
            uppercase: string;
            lowercase: string;
            capitalize: string;
            normal: string;
        };
    };
    layout: {
        maxWidth: string;
        contentWidth: string;
        sidebarWidth: string;
        headerHeight: string;
        footerHeight: string;
    };
    emailStyles: IThemeEmailStyles;
}
//# sourceMappingURL=corporate.theme.d.ts.map