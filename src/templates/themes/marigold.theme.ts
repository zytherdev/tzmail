import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
export class MarigoldTheme implements ITheme {
  id = ThemeType.MARIGOLD; name = 'Marigold';
  light: IThemeColors = { primary: '#b45309', secondary: '#d97706', background: '#fffbeb', text: '#422006', textMuted: '#92400e', border: '#fde68a', success: '#166534', error: '#b91c1c', warning: '#b45309' };
  dark: IThemeColors = { primary: '#fbbf24', secondary: '#f59e0b', background: '#21180b', text: '#fffbeb', textMuted: '#fde68a', border: '#78350f', success: '#86efac', error: '#fca5a5', warning: '#fde68a' };
  typography: ITypography = { fontFamily: 'Georgia, Times New Roman, serif', fontSizes: { small: '12px', medium: '15px', large: '18px', xlarge: '23px' }, fontWeights: { normal: 400, medium: 500, bold: 700 } };
  spacing: ISpacing = { xs: '5px', sm: '10px', md: '18px', lg: '26px', xl: '38px' };
  emailStyles: IThemeEmailStyles = { maxWidthPx: 600, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '3px', boxShadow: 'none' }, header: { accentColor: 'primary', accentWidth: '1px', horizontalPadding: '28px', logoColor: 'text', logoTextTransform: 'uppercase', logoLetterSpacing: '0.12em', imageBorderRadius: '0px' }, body: { accentColor: 'border', accentWidth: '1px', borderRadius: '0px', boxShadow: 'none', horizontalPadding: '28px', lineHeight: 1.7 }, button: { appearance: 'outline', borderRadius: '3px', borderWidth: '1px', boxShadow: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }, footer: { accentColor: 'border', accentWidth: '1px' } };
}
