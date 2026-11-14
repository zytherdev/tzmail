import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
import { getThemeComposition } from './theme-designs';

export class PastelTheme implements ITheme {
  id = ThemeType.PASTEL;
  composition = getThemeComposition(this.id);
  name = 'Pastel';

  light: IThemeColors = {
    primary: '#74415F',
    secondary: '#61506F',
    background: '#F5E8ED',
    text: '#3C2938',
    textMuted: '#6C5262',
    border: '#CBB0BD',
    success: '#28613B',
    error: '#9C3832',
    warning: '#72550C'
  };

  dark: IThemeColors = {
    primary: '#DDA3BF',
    secondary: '#CDB8E5',
    background: '#2F1F2E',
    text: '#FBEAF2',
    textMuted: '#D4B9CB',
    border: '#624456',
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
    lg: '30px',
    xl: '44px'
  };

  emailStyles: IThemeEmailStyles = {
    maxWidthPx: 580,
    container: {
      borderColor: 'border',
      borderWidth: '0px',
      borderRadius: '16px',
      boxShadow: 'none'
    },
    header: {
      accentColor: 'primary',
      accentWidth: '3px',
      horizontalPadding: '40px',
      logoColor: 'text',
      logoFontFamily: 'Georgia, "Times New Roman", Times, serif',
      logoTextTransform: 'none',
      logoLetterSpacing: '0.02em',
      imageBorderRadius: '16px'
    },
    body: {
      accentColor: 'none',
      accentWidth: '0px',
      borderRadius: '8px',
      boxShadow: 'none',
      horizontalPadding: '40px',
      lineHeight: 1.8
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
      accentColor: 'none',
      accentWidth: '0px'
    }
  };
}
