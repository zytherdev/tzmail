import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';

export class BerryTheme implements ITheme {
  id = ThemeType.BERRY;
  name = 'Berry';
  light: IThemeColors = { primary: '#9f1239', secondary: '#be185d', background: '#fff7fb', text: '#321525', textMuted: '#735268', border: '#f3c4d9', success: '#047857', error: '#be123c', warning: '#b45309' };
  dark: IThemeColors = { primary: '#f9a8d4', secondary: '#f472b6', background: '#241522', text: '#fff1f7', textMuted: '#f5c2dc', border: '#6b2148', success: '#6ee7b7', error: '#fda4af', warning: '#fcd34d' };
  typography: ITypography = { fontFamily: 'Arial, Helvetica, sans-serif', fontSizes: { small: '13px', medium: '15px', large: '18px', xlarge: '26px' }, fontWeights: { normal: 400, medium: 500, bold: 700 } };
  spacing: ISpacing = { xs: '6px', sm: '12px', md: '20px', lg: '32px', xl: '48px' };
  emailStyles: IThemeEmailStyles = { maxWidthPx: 600, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '16px', boxShadow: 'none' }, header: { accentColor: 'primary', accentWidth: '2px', horizontalPadding: '26px', logoColor: 'primary', logoLetterSpacing: '0.02em', imageBorderRadius: '10px' }, body: { accentColor: 'primary', accentWidth: '2px', borderRadius: '10px', boxShadow: 'none', horizontalPadding: '26px', lineHeight: 1.6 }, button: { appearance: 'solid', borderRadius: '999px', borderWidth: '0px', boxShadow: 'none' }, footer: { accentColor: 'border', accentWidth: '1px' } };
}
