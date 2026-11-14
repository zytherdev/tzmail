import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';

export class PaperTheme implements ITheme {
  id = ThemeType.PAPER;
  name = 'Paper';
  light: IThemeColors = { primary: '#7c2d12', secondary: '#a16207', background: '#fffdf8', text: '#292524', textMuted: '#78716c', border: '#d6d3d1', success: '#166534', error: '#b91c1c', warning: '#a16207' };
  dark: IThemeColors = { primary: '#fdba74', secondary: '#fbbf24', background: '#211b18', text: '#fafaf9', textMuted: '#d6d3d1', border: '#57534e', success: '#86efac', error: '#fca5a5', warning: '#fde68a' };
  typography: ITypography = { fontFamily: 'Georgia, Times New Roman, serif', fontSizes: { small: '13px', medium: '16px', large: '19px', xlarge: '28px' }, fontWeights: { normal: 400, medium: 500, bold: 700 } };
  spacing: ISpacing = { xs: '6px', sm: '12px', md: '22px', lg: '34px', xl: '52px' };
  emailStyles: IThemeEmailStyles = { maxWidthPx: 620, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '0px', boxShadow: 'none' }, header: { accentColor: 'border', accentWidth: '1px', horizontalPadding: '32px', logoColor: 'text', logoTextTransform: 'uppercase', logoLetterSpacing: '0.12em', imageBorderRadius: '0px' }, body: { accentColor: 'none', accentWidth: '0px', borderRadius: '0px', boxShadow: 'none', horizontalPadding: '32px', lineHeight: 1.7 }, button: { appearance: 'outline', borderRadius: '0px', borderWidth: '2px', boxShadow: 'none', textTransform: 'uppercase', letterSpacing: '0.06em' }, footer: { accentColor: 'border', accentWidth: '1px' } };
}
