import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';

export class NeonTheme implements ITheme {
  id = ThemeType.NEON;
  name = 'Neon';
  light: IThemeColors = { primary: '#0f766e', secondary: '#0891b2', background: '#f0fdfa', text: '#102a2a', textMuted: '#466b6b', border: '#99f6e4', success: '#047857', error: '#be123c', warning: '#a16207' };
  dark: IThemeColors = { primary: '#5eead4', secondary: '#67e8f9', background: '#071b1b', text: '#ecfeff', textMuted: '#a5f3fc', border: '#115e59', success: '#6ee7b7', error: '#fda4af', warning: '#fde68a' };
  typography: ITypography = { fontFamily: 'Arial, Helvetica, sans-serif', fontSizes: { small: '13px', medium: '15px', large: '18px', xlarge: '25px' }, fontWeights: { normal: 400, medium: 600, bold: 700 } };
  spacing: ISpacing = { xs: '6px', sm: '12px', md: '20px', lg: '30px', xl: '44px' };
  emailStyles: IThemeEmailStyles = { maxWidthPx: 600, container: { borderColor: 'primary', borderWidth: '2px', borderRadius: '4px', boxShadow: 'none' }, header: { accentColor: 'primary', accentWidth: '3px', horizontalPadding: '24px', logoColor: 'primary', logoTextTransform: 'uppercase', logoLetterSpacing: '0.1em', imageBorderRadius: '4px' }, body: { accentColor: 'primary', accentWidth: '3px', borderRadius: '0px', boxShadow: 'none', horizontalPadding: '24px', lineHeight: 1.55 }, button: { appearance: 'solid', borderRadius: '3px', borderWidth: '0px', boxShadow: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }, footer: { accentColor: 'primary', accentWidth: '2px' } };
}
