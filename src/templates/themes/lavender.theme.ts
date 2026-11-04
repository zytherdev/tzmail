import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';

export class LavenderTheme implements ITheme {
  id = ThemeType.LAVENDER;
  name = 'Lavender';

  light: IThemeColors = {
    primary: '#623B8C',
    secondary: '#8A4F68',
    background: '#FCFAFF',
    text: '#241B2B',
    textMuted: '#62596A',
    border: '#D9CFE2',
    success: '#246B4A',
    error: '#A12F45',
    warning: '#815400'
  };

  dark: IThemeColors = {
    primary: '#D7B8FF',
    secondary: '#F0B5CA',
    background: '#17121F',
    text: '#F7F1FC',
    textMuted: '#C3B8CC',
    border: '#51465C',
    success: '#8BD6AD',
    error: '#FF9EAE',
    warning: '#FFD27A'
  };

  typography: ITypography = {
    fontFamily: 'Arial, "Segoe UI", system-ui, sans-serif',
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
    xs: '6px',
    sm: '12px',
    md: '20px',
    lg: '30px',
    xl: '44px'
  };

  emailStyles: IThemeEmailStyles = {
    maxWidthPx: 600,
    container: {
      borderColor: 'border',
      borderWidth: '1px',
      borderRadius: '16px',
      boxShadow: 'none'
    },
    header: {
      accentColor: 'primary',
      accentWidth: '3px',
      horizontalPadding: '28px',
      logoColor: 'primary',
      logoFontFamily: 'Arial, "Segoe UI", system-ui, sans-serif',
      logoTextTransform: 'none',
      logoLetterSpacing: '0.02em',
      imageBorderRadius: '12px'
    },
    body: {
      accentColor: 'secondary',
      accentWidth: '2px',
      borderRadius: '12px',
      boxShadow: 'none',
      horizontalPadding: '28px',
      lineHeight: 1.65
    },
    button: {
      appearance: 'solid',
      borderRadius: '10px',
      borderWidth: '1px',
      boxShadow: 'none',
      textTransform: 'none',
      letterSpacing: '0.01em'
    },
    footer: {
      accentColor: 'secondary',
      accentWidth: '2px'
    }
  };
}
