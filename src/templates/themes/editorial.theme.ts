import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing } from './theme.interface';

export class EditorialTheme implements ITheme {
  id = ThemeType.EDITORIAL;
  name = 'Editorial';

  light: IThemeColors = {
    primary: '#8B342D',
    secondary: '#5D5148',
    background: '#F7F3EA',
    text: '#292522',
    textMuted: '#655C54',
    border: '#D8CFC1',
    success: '#286146',
    error: '#963B34',
    warning: '#75500F'
  };

  dark: IThemeColors = {
    primary: '#E49A8E',
    secondary: '#C8BBA9',
    background: '#211F1C',
    text: '#F3EEE4',
    textMuted: '#C2B8AA',
    border: '#4A433C',
    success: '#91CBA5',
    error: '#F0A097',
    warning: '#E9C77B'
  };

  typography: ITypography = {
    fontFamily: 'Georgia, "Times New Roman", Times, serif',
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
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '36px'
  };
}
