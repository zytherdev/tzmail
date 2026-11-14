import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
import { getThemeComposition } from './theme-designs';

export class ModernTheme implements ITheme {
  id = ThemeType.MODERN;
  composition = getThemeComposition(this.id);
  name = 'Modern';
  
  light: IThemeColors = {
    primary: '#202D40',
    secondary: '#42566B',
    background: '#F5F6F8',
    text: '#162235',
    textMuted: '#4A5567',
    border: '#A7B4C4',
    success: '#275F3A',
    error: '#92352F',
    warning: '#6B500C'
  };
  
  dark: IThemeColors = {
    primary: '#ACC4E6',
    secondary: '#8FC4DB',
    background: '#141F2D',
    text: '#EFF5FF',
    textMuted: '#BDCBDF',
    border: '#3B4E65',
    success: '#97DDB2',
    error: '#F5ACA2',
    warning: '#EDCE8A'
  };
  
  typography: ITypography = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSizes: {
      small: '12px',
      medium: '16px',
      large: '22px',
      xlarge: `${this.composition.body.titleSize}px`
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
    lg: '32px',
    xl: '48px'
  };

  emailStyles: IThemeEmailStyles = {
    maxWidthPx: 640,
    container: {
      borderColor: 'border',
      borderWidth: '1px',
      borderRadius: '0px',
      boxShadow: 'none'
    },
    header: {
      accentColor: 'secondary',
      accentWidth: '3px',
      horizontalPadding: '40px',
      logoColor: 'text',
      logoFontFamily: 'Arial, Helvetica, sans-serif',
      logoTextTransform: 'none',
      logoLetterSpacing: '0.02em',
      imageBorderRadius: '0px'
    },
    body: {
      accentColor: 'none',
      accentWidth: '0px',
      borderRadius: '0px',
      boxShadow: 'none',
      horizontalPadding: '40px',
      lineHeight: 1.6
    },
    button: {
      appearance: 'solid',
      borderRadius: '0px',
      borderWidth: '0px',
      boxShadow: 'none',
      textTransform: 'none',
      letterSpacing: '0.01em'
    },
    footer: {
      accentColor: 'none',
      accentWidth: '0px'
    }
  };
  
  gradients = {
    primary: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    secondary: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
    accent: 'linear-gradient(135deg, #38bdf8 0%, #0f172a 100%)',
    dark: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
    light: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
  };
  
  borderStyle = {
    radius: {
      small: '8px',
      medium: '12px',
      large: '16px',
      full: '9999px'
    },
    width: '1px',
    style: 'solid'
  };
  
  glassmorphism = {
    light: 'rgba(255, 255, 255, 0.8)',
    dark: 'rgba(15, 23, 42, 0.8)',
    blur: '12px'
  };
  
  animations = {
    hover: 'transform 0.2s ease, box-shadow 0.2s ease',
    fade: 'opacity 0.3s ease',
    slide: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  };
}
