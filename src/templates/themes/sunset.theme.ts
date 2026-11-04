import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing } from './theme.interface';

export class SunsetTheme implements ITheme {
  id = ThemeType.SUNSET;
  name = 'Sunset';

  light: IThemeColors = {
    primary: '#A63F32',
    secondary: '#8A5548',
    background: '#FFF7F0',
    text: '#38242E',
    textMuted: '#755B60',
    border: '#E8CFC4',
    success: '#286B4D',
    error: '#A52E35',
    warning: '#81500A'
  };

  dark: IThemeColors = {
    primary: '#FF927A',
    secondary: '#E8B077',
    background: '#211923',
    text: '#FFF1E8',
    textMuted: '#C8B3B8',
    border: '#503842',
    success: '#81D0A4',
    error: '#FF8A91',
    warning: '#F5C36B'
  };

  typography: ITypography = {
    fontFamily: 'Arial, Helvetica, sans-serif',
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
