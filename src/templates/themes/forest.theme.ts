import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';

export class ForestTheme implements ITheme {
  id = ThemeType.FOREST;
  name = 'Forest';

  light: IThemeColors = {
    primary: '#315A3D',
    secondary: '#657B5D',
    background: '#F7F5EC',
    text: '#26362B',
    textMuted: '#58665A',
    border: '#D9DFD2',
    success: '#356B48',
    error: '#A34037',
    warning: '#805713'
  };

  dark: IThemeColors = {
    primary: '#A9C69A',
    secondary: '#B4C2A8',
    background: '#18231C',
    text: '#F1F2E9',
    textMuted: '#B7C2B5',
    border: '#3A4A3D',
    success: '#9BC99E',
    error: '#F0A39A',
    warning: '#E5C078'
  };

  typography: ITypography = {
    fontFamily: 'Georgia, "Times New Roman", serif',
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

  emailStyles: IThemeEmailStyles = {
    maxWidthPx: 600,
    container: {
      borderColor: 'border',
      borderWidth: '1px',
      borderRadius: '8px',
      boxShadow: 'none'
    },
    header: {
      accentColor: 'primary',
      accentWidth: '4px',
      horizontalPadding: '28px',
      logoColor: 'primary',
      logoFontFamily: 'Georgia, "Times New Roman", serif',
      imageBorderRadius: '6px'
    },
    body: {
      accentColor: 'secondary',
      accentWidth: '3px',
      borderRadius: '6px',
      boxShadow: 'none',
      horizontalPadding: '28px',
      lineHeight: 1.65
    },
    button: {
      appearance: 'solid',
      borderRadius: '4px',
      borderWidth: '1px',
      boxShadow: 'none',
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    },
    footer: {
      accentColor: 'secondary',
      accentWidth: '1px'
    }
  };
}
