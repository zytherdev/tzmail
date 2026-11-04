import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeEmailStyles } from './theme.interface';
export declare class SystemTheme implements ITheme {
    id: ThemeType;
    name: string;
    light: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        textMuted: string;
        border: string;
        success: string;
        error: string;
        warning: string;
    };
    dark: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        textMuted: string;
        border: string;
        success: string;
        error: string;
        warning: string;
    };
    typography: {
        fontFamily: string;
        fontSizes: {
            small: string;
            medium: string;
            large: string;
            xlarge: string;
        };
        fontWeights: {
            normal: number;
            medium: number;
            bold: number;
        };
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    emailStyles: IThemeEmailStyles;
}
//# sourceMappingURL=system.theme.d.ts.map