import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';

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

  emailStyles: IThemeEmailStyles = {
    maxWidthPx: 600,
    container: {
      borderColor: 'border',
      borderWidth: '1px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
    },
    header: {
      accentColor: 'secondary',
      accentWidth: '4px',
      horizontalPadding: '28px',
      logoColor: 'primary',
      logoFontFamily: 'Arial, Helvetica, sans-serif',
      logoLetterSpacing: '0.02em',
      imageBorderRadius: '8px'
    },
    body: {
      accentColor: 'primary',
      accentWidth: '3px',
      borderRadius: '8px',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
      horizontalPadding: '28px',
      lineHeight: 1.6
    },
    button: {
      appearance: 'solid',
      borderRadius: '6px',
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
