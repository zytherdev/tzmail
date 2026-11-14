import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';

export class OrbitTheme implements ITheme {
  id = ThemeType.ORBIT;
  name = 'Orbit';
  light: IThemeColors = { primary: '#4338ca', secondary: '#7c3aed', background: '#fbfaff', text: '#20203a', textMuted: '#68688a', border: '#ddd6fe', success: '#047857', error: '#be123c', warning: '#a16207' };
  dark: IThemeColors = { primary: '#c4b5fd', secondary: '#a78bfa', background: '#19152b', text: '#f5f3ff', textMuted: '#d8b4fe', border: '#4c1d95', success: '#6ee7b7', error: '#fda4af', warning: '#fde68a' };
  typography: ITypography = { fontFamily: 'Arial, Helvetica, sans-serif', fontSizes: { small: '12px', medium: '14px', large: '17px', xlarge: '22px' }, fontWeights: { normal: 400, medium: 500, bold: 700 } };
  spacing: ISpacing = { xs: '5px', sm: '10px', md: '18px', lg: '26px', xl: '36px' };
  emailStyles: IThemeEmailStyles = { maxWidthPx: 580, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '18px', boxShadow: 'none' }, header: { accentColor: 'primary', accentWidth: '2px', horizontalPadding: '24px', logoColor: 'primary', logoLetterSpacing: '0.03em', imageBorderRadius: '12px' }, body: { accentColor: 'none', accentWidth: '0px', borderRadius: '0px', boxShadow: 'none', horizontalPadding: '24px', lineHeight: 1.55 }, button: { appearance: 'solid', borderRadius: '999px', borderWidth: '0px', boxShadow: 'none' }, footer: { accentColor: 'border', accentWidth: '1px' } };
}
