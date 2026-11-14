import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
export class SlateTheme implements ITheme {
  id = ThemeType.SLATE; name = 'Slate';
  light: IThemeColors = { primary: '#334155', secondary: '#64748b', background: '#f8fafc', text: '#1e293b', textMuted: '#64748b', border: '#cbd5e1', success: '#166534', error: '#b91c1c', warning: '#a16207' };
  dark: IThemeColors = { primary: '#cbd5e1', secondary: '#94a3b8', background: '#111827', text: '#f8fafc', textMuted: '#cbd5e1', border: '#475569', success: '#86efac', error: '#fca5a5', warning: '#fde68a' };
  typography: ITypography = { fontFamily: 'Arial, Helvetica, sans-serif', fontSizes: { small: '12px', medium: '14px', large: '17px', xlarge: '22px' }, fontWeights: { normal: 400, medium: 500, bold: 700 } };
  spacing: ISpacing = { xs: '5px', sm: '10px', md: '18px', lg: '24px', xl: '34px' };
  emailStyles: IThemeEmailStyles = { maxWidthPx: 600, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '10px', boxShadow: 'none' }, header: { accentColor: 'primary', accentWidth: '2px', horizontalPadding: '24px', logoColor: 'primary', logoLetterSpacing: '0.05em', imageBorderRadius: '8px' }, body: { accentColor: 'none', accentWidth: '0px', borderRadius: '8px', boxShadow: 'none', horizontalPadding: '24px', lineHeight: 1.55 }, button: { appearance: 'solid', borderRadius: '5px', borderWidth: '0px', boxShadow: 'none' }, footer: { accentColor: 'border', accentWidth: '1px' } };
}
