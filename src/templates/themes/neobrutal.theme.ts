import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
import { getThemeComposition } from './theme-designs';

export class NeoBrutalTheme implements ITheme {
  id = ThemeType.NEOBRUTAL;
  composition = getThemeComposition(this.id);
  name = 'Neo Brutal';

  light: IThemeColors = {
    primary: '#2148AF',
    secondary: '#FFE05C',
    background: '#FFF7CC',
    text: '#181D26',
    textMuted: '#555346',
    border: '#B4A95D',
    success: '#28613B',
    error: '#A33B34',
    warning: '#7B5C0D'
  };

  dark: IThemeColors = {
    primary: '#91A9FF',
    secondary: '#FFE05C',
    background: '#202117',
    text: '#FFF9DB',
    textMuted: '#D1CAA8',
    border: '#5D5E3F',
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
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '36px'
  };

  emailStyles: IThemeEmailStyles = {
    maxWidthPx: 640,
    container: {
      borderColor: 'primary',
      borderWidth: '3px',
      borderRadius: '0px',
      boxShadow: 'none'
    },
    header: {
      accentColor: 'primary',
      accentWidth: '6px',
      horizontalPadding: '32px',
      logoColor: 'text',
      logoFontFamily: '"Arial Black", Arial, Helvetica, sans-serif',
      logoTextTransform: 'uppercase',
      logoLetterSpacing: '0.12em',
      imageBorderRadius: '0px'
    },
    body: {
      accentColor: 'secondary',
      accentWidth: '3px',
      borderRadius: '0px',
      boxShadow: 'none',
      horizontalPadding: '32px',
      lineHeight: 1.55
    },
    button: {
      appearance: 'solid',
      borderRadius: '0px',
      borderWidth: '2px',
      boxShadow: 'none',
      textTransform: 'uppercase',
      letterSpacing: '0.06em'
    },
    footer: {
      accentColor: 'border',
      accentWidth: '2px'
    }
  };
}
