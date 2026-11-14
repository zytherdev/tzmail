import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
export class ClayTheme implements ITheme {
  id = ThemeType.CLAY; name = 'Clay';
  light: IThemeColors = { primary: '#9a3412', secondary: '#c2410c', background: '#fff7ed', text: '#431407', textMuted: '#9a3412', border: '#fed7aa', success: '#166534', error: '#b91c1c', warning: '#b45309' };
  dark: IThemeColors = { primary: '#fdba74', secondary: '#fb923c', background: '#29150e', text: '#fff7ed', textMuted: '#fed7aa', border: '#7c2d12', success: '#86efac', error: '#fca5a5', warning: '#fde68a' };
  typography: ITypography = { fontFamily: 'Arial, Helvetica, sans-serif', fontSizes: { small: '12px', medium: '14px', large: '17px', xlarge: '22px' }, fontWeights: { normal: 400, medium: 500, bold: 700 } };
  spacing: ISpacing = { xs: '5px', sm: '10px', md: '18px', lg: '26px', xl: '36px' };
  emailStyles: IThemeEmailStyles = { maxWidthPx: 580, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '12px', boxShadow: 'none' }, header: { accentColor: 'primary', accentWidth: '1px', horizontalPadding: '24px', logoColor: 'primary', imageBorderRadius: '10px' }, body: { accentColor: 'border', accentWidth: '1px', borderRadius: '10px', boxShadow: 'none', horizontalPadding: '24px', lineHeight: 1.55 }, button: { appearance: 'outline', borderRadius: '8px', borderWidth: '1px', boxShadow: 'none' }, footer: { accentColor: 'border', accentWidth: '1px' } };
}
