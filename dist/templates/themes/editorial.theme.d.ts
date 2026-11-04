import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing } from './theme.interface';
export declare class EditorialTheme implements ITheme {
    id: ThemeType;
    name: string;
    light: IThemeColors;
    dark: IThemeColors;
    typography: ITypography;
    spacing: ISpacing;
}
//# sourceMappingURL=editorial.theme.d.ts.map