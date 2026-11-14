import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
export class SaffronTheme implements ITheme {
  id = ThemeType.SAFFRON; name = 'Saffron';
  light: IThemeColors = { primary: '#c2410c', secondary: '#ca8a04', background: '#fffaf0', text: '#3f1d0b', textMuted: '#92400e', border: '#fed7aa', success: '#166534', error: '#b91c1c', warning: '#a16207' };
  dark: IThemeColors = { primary: '#fb923c', secondary: '#facc15', background: '#21140d', text: '#fff7ed', textMuted: '#fed7aa', border: '#7c2d12', success: '#86efac', error: '#fca5a5', warning: '#fde68a' };
  typography: ITypography = { fontFamily: 'Arial, Helvetica, sans-serif', fontSizes: { small: '12px', medium: '14px', large: '17px', xlarge: '22px' }, fontWeights: { normal: 400, medium: 500, bold: 700 } };
  spacing: ISpacing = { xs: '5px', sm: '10px', md: '18px', lg: '26px', xl: '36px' };
  emailStyles: IThemeEmailStyles = { maxWidthPx: 600, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '9px', boxShadow: 'none' }, header: { accentColor: 'primary', accentWidth: '2px', horizontalPadding: '24px', logoColor: 'primary', logoLetterSpacing: '0.03em', imageBorderRadius: '8px' }, body: { accentColor: 'primary', accentWidth: '2px', borderRadius: '8px', boxShadow: 'none', horizontalPadding: '24px', lineHeight: 1.55 }, button: { appearance: 'solid', borderRadius: '6px', borderWidth: '0px', boxShadow: 'none' }, footer: { accentColor: 'border', accentWidth: '1px' } };
}
