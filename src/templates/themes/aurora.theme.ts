import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
import { getThemeComposition } from './theme-designs';

export class AuroraTheme implements ITheme {
  id = ThemeType.AURORA;
  composition = getThemeComposition(this.id);
  name = 'Aurora';

  light: IThemeColors = {
    primary: '#08645E',
    secondary: '#634491',
    background: '#EDF8F3',
    text: '#183932',
    textMuted: '#4E6560',
    border: '#9FBFB2',
    success: '#28613B',
    error: '#A33B34',
    warning: '#7A5C0D'
  };

  dark: IThemeColors = {
    primary: '#7DE4CD',
    secondary: '#C7AAEF',
    background: '#142D2B',
    text: '#EDFCF6',
    textMuted: '#B4D2C9',
    border: '#3C625B',
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
      borderColor: 'border',
      borderWidth: '1px',
      borderRadius: '12px',
      boxShadow: 'none'
    },
    header: {
      accentColor: 'secondary',
      accentWidth: '3px',
      horizontalPadding: '32px',
      logoColor: 'text',
      logoFontFamily: 'Verdana, Geneva, Arial, sans-serif',
      logoTextTransform: 'none',
      logoLetterSpacing: '0.02em',
      imageBorderRadius: '12px'
    },
    body: {
      accentColor: 'none',
      accentWidth: '0px',
      borderRadius: '8px',
      boxShadow: 'none',
      horizontalPadding: '32px',
      lineHeight: 1.65
    },
    button: {
      appearance: 'solid',
      borderRadius: '999px',
      borderWidth: '0px',
      boxShadow: 'none',
      textTransform: 'none',
      letterSpacing: '0.01em'
    },
    footer: {
      accentColor: 'primary',
      accentWidth: '1px'
    }
  };
}
