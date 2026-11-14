import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';

export class LinenTheme implements ITheme {
  id = ThemeType.LINEN;
  name = 'Linen';
  light: IThemeColors = { primary: '#57534e', secondary: '#78716c', background: '#faf9f6', text: '#292524', textMuted: '#78716c', border: '#e7e5e4', success: '#166534', error: '#b91c1c', warning: '#a16207' };
  dark: IThemeColors = { primary: '#d6d3d1', secondary: '#a8a29e', background: '#211f1d', text: '#fafaf9', textMuted: '#d6d3d1', border: '#57534e', success: '#86efac', error: '#fca5a5', warning: '#fde68a' };
  typography: ITypography = { fontFamily: 'Georgia, Times New Roman, serif', fontSizes: { small: '12px', medium: '15px', large: '18px', xlarge: '23px' }, fontWeights: { normal: 400, medium: 500, bold: 700 } };
  spacing: ISpacing = { xs: '5px', sm: '10px', md: '18px', lg: '26px', xl: '38px' };
  emailStyles: IThemeEmailStyles = { maxWidthPx: 600, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '4px', boxShadow: 'none' }, header: { accentColor: 'border', accentWidth: '1px', horizontalPadding: '28px', logoColor: 'text', logoTextTransform: 'uppercase', logoLetterSpacing: '0.1em', imageBorderRadius: '0px' }, body: { accentColor: 'none', accentWidth: '0px', borderRadius: '0px', boxShadow: 'none', horizontalPadding: '28px', lineHeight: 1.65 }, button: { appearance: 'outline', borderRadius: '3px', borderWidth: '1px', boxShadow: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }, footer: { accentColor: 'border', accentWidth: '1px' } };
}
