import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeEmailStyles } from './theme.interface';
import { getThemeComposition } from './theme-designs';

export class SystemTheme implements ITheme {
  id = ThemeType.SYSTEM;
  composition = getThemeComposition(this.id);
  name = 'System';

  light = {
    primary: '#2754A5',
    secondary: '#4D5B70',
    background: '#F2F4F6',
    text: '#171D29',
    textMuted: '#535C6A',
    border: '#B4BCC8',
    success: '#28613B',
    error: '#9F3933',
    warning: '#74570D'
  };

  dark = {
    primary: '#89B5FF',
    secondary: '#B4C5DB',
    background: '#151B26',
    text: '#F0F5FD',
    textMuted: '#BBC6D5',
    border: '#3B4659',
    success: '#97DDB2',
    error: '#F5ACA2',
    warning: '#EDCE8A'
  };

  typography = {
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
      borderRadius: '0px',
      boxShadow: 'none'
    },
    header: {
      accentColor: 'none',
      accentWidth: '0px',
      horizontalPadding: '32px',
      logoColor: 'text',
      logoFontFamily: '"Courier New", Courier, monospace',
      logoTextTransform: 'uppercase',
      logoLetterSpacing: '0.06em',
      imageBorderRadius: '0px'
    },
    body: {
      accentColor: 'primary',
      accentWidth: '1px',
      borderRadius: '0px',
      boxShadow: 'none',
      horizontalPadding: '32px',
      lineHeight: 1.6
    },
    button: {
      appearance: 'outline',
      borderRadius: '0px',
      borderWidth: '2px',
      boxShadow: 'none',
      textTransform: 'uppercase',
      letterSpacing: '0.06em'
    },
    footer: {
      accentColor: 'border',
      accentWidth: '1px'
    }
  };
}
