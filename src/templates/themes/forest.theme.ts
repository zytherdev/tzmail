import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
import { getThemeComposition } from './theme-designs';

export class ForestTheme implements ITheme {
  id = ThemeType.FOREST;
  composition = getThemeComposition(this.id);
  name = 'Forest';

  light: IThemeColors = {
    primary: '#315A32',
    secondary: '#4D592E',
    background: '#EDF0DC',
    text: '#25351F',
    textMuted: '#4E5841',
    border: '#ADB893',
    success: '#275F3A',
    error: '#93352F',
    warning: '#6B500C'
  };

  dark: IThemeColors = {
    primary: '#AAD299',
    secondary: '#C2CF89',
    background: '#202B19',
    text: '#F0F4DD',
    textMuted: '#C3CBA9',
    border: '#4D5B36',
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
    maxWidthPx: 600,
    container: {
      borderColor: 'border',
      borderWidth: '1px',
      borderRadius: '6px',
      boxShadow: 'none'
    },
    header: {
      accentColor: 'primary',
      accentWidth: '3px',
      horizontalPadding: '36px',
      logoColor: 'primary',
      logoFontFamily: 'Georgia, "Times New Roman", Times, serif',
      logoTextTransform: 'none',
      logoLetterSpacing: '0.02em',
      imageBorderRadius: '6px'
    },
    body: {
      accentColor: 'primary',
      accentWidth: '5px',
      borderRadius: '6px',
      boxShadow: 'none',
      horizontalPadding: '36px',
      lineHeight: 1.8
    },
    button: {
      appearance: 'outline',
      borderRadius: '6px',
      borderWidth: '2px',
      boxShadow: 'none',
      textTransform: 'none',
      letterSpacing: '0.01em'
    },
    footer: {
      accentColor: 'border',
      accentWidth: '1px'
    }
  };
}
