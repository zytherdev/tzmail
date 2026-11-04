import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';

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

  emailStyles: IThemeEmailStyles = {
    maxWidthPx: 600,
    container: {
      borderColor: 'border',
      borderWidth: '1px',
      borderRadius: '4px',
      boxShadow: 'none'
    },
    header: {
      accentColor: 'primary',
      accentWidth: '3px',
      horizontalPadding: '32px',
      logoColor: 'primary',
      logoFontFamily: 'Georgia, "Times New Roman", serif',
      logoTextTransform: 'none',
      logoLetterSpacing: '0.04em',
      imageBorderRadius: '2px'
    },
    body: {
      accentColor: 'secondary',
      accentWidth: '1px',
      borderRadius: '4px',
      boxShadow: 'none',
      horizontalPadding: '32px',
      lineHeight: 1.65
    },
    button: {
      appearance: 'outline',
      borderRadius: '2px',
      borderWidth: '1px',
      boxShadow: 'none',
      textTransform: 'uppercase',
      letterSpacing: '0.08em'
    },
    footer: {
      accentColor: 'secondary',
      accentWidth: '1px'
    }
  };
}
