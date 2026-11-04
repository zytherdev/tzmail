
import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';

export class ModernTheme implements ITheme {
  id = ThemeType.MODERN;
  name = 'Modern';
  
  light: IThemeColors = {
    primary: '#0f172a',      
    secondary: '#64748b',     
    background: '#ffffff',     
    text: '#0f172a',          
    textMuted: '#64748b',     
    border: '#e2e8f0',        
    success: '#10b981',       
    error: '#ef4444',         
    warning: '#f59e0b'        
  };
  
  dark: IThemeColors = {
    primary: '#38bdf8',       
    secondary: '#94a3b8',     
    background: '#0f172a',     
    text: '#f1f5f9',          
    textMuted: '#94a3b8',     
    border: '#1e293b',        
    success: '#34d399',      
    error: '#f87171',         
    warning: '#fbbf24'   
  };
  
  typography: ITypography = {
    fontFamily: '"Inter", "SF Pro Display", "Segoe UI", system-ui, sans-serif',
    fontSizes: {
      small: '13px',
      medium: '15px',
      large: '17px',
      xlarge: '24px'
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
    lg: '32px',
    xl: '48px'
  };

  emailStyles: IThemeEmailStyles = {
    maxWidthPx: 600,
    container: {
      borderColor: 'border',
      borderWidth: '1px',
      borderRadius: '12px',
      boxShadow: 'none'
    },
    header: {
      accentColor: 'primary',
      accentWidth: '3px',
      horizontalPadding: '24px',
      logoColor: 'primary',
      logoFontFamily: '"Inter", "Segoe UI", sans-serif',
      logoLetterSpacing: '0.02em',
      imageBorderRadius: '8px'
    },
    body: {
      accentColor: 'primary',
      accentWidth: '2px',
      borderRadius: '8px',
      boxShadow: 'none',
      horizontalPadding: '24px',
      lineHeight: 1.55
    },
    button: {
      appearance: 'solid',
      borderRadius: '8px',
      borderWidth: '1px',
      boxShadow: 'none',
      letterSpacing: '0.01em'
    },
    footer: {
      accentColor: 'secondary',
      accentWidth: '1px'
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
