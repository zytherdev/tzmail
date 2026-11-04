import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing } from './theme.interface';

export class OceanTheme implements ITheme {
  id = ThemeType.OCEAN;
  name = 'Ocean';

  light: IThemeColors = {
    primary: '#075985',
    secondary: '#0E7490',
    background: '#F4FAFC',
    text: '#102A43',
    textMuted: '#486581',
    border: '#C7DCE5',
    success: '#166534',
    error: '#B42318',
    warning: '#92400E'
  };

  dark: IThemeColors = {
    primary: '#67E8F9',
    secondary: '#5EEAD4',
    background: '#071B2B',
    text: '#E6F4F7',
    textMuted: '#A6C8D1',
    border: '#244657',
    success: '#6EE7B7',
    error: '#FDA4AF',
    warning: '#FCD34D'
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
      bold: 600
    }
  };

  spacing: ISpacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '36px'
  };
}
