
import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeEmailStyles } from './theme.interface';

export class SystemTheme implements ITheme {
  id = ThemeType.SYSTEM;
  name = 'System';

  light = {
    primary: '#3b82f6',
    secondary: '#6b7280',
    background: '#ffffff',
    text: '#111827',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b'
  };

  dark = {
    primary: '#3b82f6',
    secondary: '#9ca3af',
    background: '#111827',
    text: '#f9fafb',
    textMuted: '#9ca3af',
    border: '#374151',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b'
  };

  typography = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSizes: {
      small: '12px',
      medium: '14px',
      large: '16px',
      xlarge: '20px'
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      bold: 700
    }
  };

  spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  };

  emailStyles: IThemeEmailStyles = {
    maxWidthPx: 600,
    container: {
      borderColor: 'border',
      borderWidth: '1px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
    },
    header: {
      accentColor: 'primary',
      accentWidth: '3px',
      horizontalPadding: '24px',
      logoColor: 'primary',
      logoLetterSpacing: '0.01em',
      imageBorderRadius: '4px'
    },
    body: {
      accentColor: 'primary',
      accentWidth: '2px',
      borderRadius: '4px',
      boxShadow: 'none',
      horizontalPadding: '24px',
      lineHeight: 1.6
    },
    button: {
      appearance: 'solid',
      borderRadius: '6px',
      borderWidth: '0px',
      boxShadow: 'none',
      letterSpacing: '0.01em'
    },
    footer: {
      accentColor: 'secondary',
      accentWidth: '1px'
    }
  };
}
