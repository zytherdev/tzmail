import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing } from './theme.interface';

export class GlassTheme implements ITheme {
  id = ThemeType.GLASS;
  name = 'Glass';

  light: IThemeColors = {
    primary: '#155E91',
    secondary: '#526B7D',
    background: '#F3F7FA',
    text: '#183043',
    textMuted: '#526B7D',
    border: '#C9D7E1',
    success: '#176B50',
    error: '#A8323E',
    warning: '#805400'
  };

  dark: IThemeColors = {
    primary: '#83CEF5',
    secondary: '#B0C5D4',
    background: '#12202D',
    text: '#EDF5FA',
    textMuted: '#B0C5D4',
    border: '#344B5D',
    success: '#71D2A9',
    error: '#FF9297',
    warning: '#FFD078'
  };

  typography: ITypography = {
    fontFamily: 'Arial, Helvetica, "Segoe UI", sans-serif',
    fontSizes: {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '26px'
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      bold: 700
    }
  };

  spacing: ISpacing = {
    xs: '6px',
    sm: '12px',
    md: '20px',
    lg: '30px',
    xl: '44px'
  };
}
