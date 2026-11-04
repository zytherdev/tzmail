import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing } from './theme.interface';

export class MidnightTheme implements ITheme {
  id = ThemeType.MIDNIGHT;
  name = 'Midnight';

  light: IThemeColors = {
    primary: '#72551F',
    secondary: '#655B49',
    background: '#FFFCF5',
    text: '#20232B',
    textMuted: '#5B5D62',
    border: '#D9D2C4',
    success: '#286447',
    error: '#A33138',
    warning: '#795000'
  };

  dark: IThemeColors = {
    primary: '#E6C982',
    secondary: '#C7B991',
    background: '#11151D',
    text: '#F5F1E8',
    textMuted: '#C2BEAF',
    border: '#3A3B3B',
    success: '#82C99C',
    error: '#F08A8D',
    warning: '#F0C66A'
  };

  typography: ITypography = {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSizes: {
      small: '14px',
      medium: '16px',
      large: '19px',
      xlarge: '28px'
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      bold: 700
    }
  };

  spacing: ISpacing = {
    xs: '4px',
    sm: '10px',
    md: '18px',
    lg: '28px',
    xl: '44px'
  };
}
