import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
export class CampusTheme implements ITheme {
  id = ThemeType.CAMPUS; name = 'Campus';
  light: IThemeColors = { primary: '#7c2d12', secondary: '#a16207', background: '#fffbeb', text: '#292524', textMuted: '#78716c', border: '#d6d3d1', success: '#166534', error: '#b91c1c', warning: '#a16207' };
  dark: IThemeColors = { primary: '#fdba74', secondary: '#fde68a', background: '#1c1917', text: '#fafaf9', textMuted: '#d6d3d1', border: '#57534e', success: '#86efac', error: '#fca5a5', warning: '#fde68a' };
  typography: ITypography = { fontFamily: 'Georgia, Times New Roman, serif', fontSizes: { small: '12px', medium: '15px', large: '18px', xlarge: '23px' }, fontWeights: { normal: 400, medium: 500, bold: 700 } };
  spacing: ISpacing = { xs: '5px', sm: '10px', md: '18px', lg: '26px', xl: '38px' };
  emailStyles: IThemeEmailStyles = { maxWidthPx: 600, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '2px', boxShadow: 'none' }, header: { accentColor: 'primary', accentWidth: '3px', horizontalPadding: '28px', logoColor: 'primary', logoTextTransform: 'uppercase', logoLetterSpacing: '0.1em', imageBorderRadius: '0px' }, body: { accentColor: 'border', accentWidth: '1px', borderRadius: '0px', boxShadow: 'none', horizontalPadding: '28px', lineHeight: 1.7 }, button: { appearance: 'outline', borderRadius: '2px', borderWidth: '1px', boxShadow: 'none', textTransform: 'uppercase', letterSpacing: '0.06em' }, footer: { accentColor: 'primary', accentWidth: '2px' } };
}
