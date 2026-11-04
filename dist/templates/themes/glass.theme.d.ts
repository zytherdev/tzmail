import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing } from './theme.interface';
export declare class GlassTheme implements ITheme {
    id: ThemeType;
    name: string;
    light: IThemeColors;
    dark: IThemeColors;
    typography: ITypography;
    spacing: ISpacing;
}
//# sourceMappingURL=glass.theme.d.ts.map