import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
import { getThemeComposition } from './theme-designs';

export class NeonTheme implements ITheme {
  id = ThemeType.NEON;
  composition = getThemeComposition(this.id);
  name = 'Neon';
  light: IThemeColors = {
    primary: '#076355',
    secondary: '#15626E',
    background: '#E8F8EF',
    text: '#18392F',
    textMuted: '#426055',
    border: '#92BBA6',
    success: '#28613B',
    error: '#9C3832',
    warning: '#72550C'
  };
  dark: IThemeColors = {
    primary: '#71F4B9',
    secondary: '#78E4F3',
    background: '#112C27',
    text: '#E8FFF5',
    textMuted: '#A6DCCB',
    border: '#32695B',
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
  spacing: ISpacing = { xs: '6px', sm: '12px', md: '20px', lg: '30px', xl: '44px' };
  emailStyles: IThemeEmailStyles = {
    maxWidthPx: 640,
    container: {
      borderColor: 'primary',
      borderWidth: '3px',
      borderRadius: '0px',
      boxShadow: 'none'
    },
    header: {
      accentColor: 'secondary',
      accentWidth: '6px',
      horizontalPadding: '32px',
      logoColor: 'text',
      logoFontFamily: '"Courier New", Courier, monospace',
      logoTextTransform: 'uppercase',
      logoLetterSpacing: '0.02em',
      imageBorderRadius: '0px'
    },
    body: {
      accentColor: 'secondary',
      accentWidth: '3px',
      borderRadius: '0px',
      boxShadow: 'none',
      horizontalPadding: '32px',
      lineHeight: 1.6
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
      accentColor: 'primary',
      accentWidth: '2px'
    }
  };
}
