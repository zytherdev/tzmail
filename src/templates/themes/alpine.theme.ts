import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
import { getThemeComposition } from './theme-designs';

export class AlpineTheme implements ITheme {
  id = ThemeType.ALPINE;
  composition = getThemeComposition(this.id);
  name = 'Alpine';
  light: IThemeColors = {
    primary: '#295B3A',
    secondary: '#3F623F',
    background: '#F0F4E8',
    text: '#273A2A',
    textMuted: '#4B5F4B',
    border: '#AEBC9F',
    success: '#28613B',
    error: '#9C3832',
    warning: '#72550C'
  };
  dark: IThemeColors = {
    primary: '#A4D9AC',
    secondary: '#B4D58F',
    background: '#202E23',
    text: '#F2F8E9',
    textMuted: '#C1D0B5',
    border: '#4B6650',
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
  spacing: ISpacing = { xs: '6px', sm: '12px', md: '20px', lg: '30px', xl: '46px' };
  emailStyles: IThemeEmailStyles = {
    maxWidthPx: 600,
    container: {
      borderColor: 'border',
      borderWidth: '1px',
      borderRadius: '0px',
      boxShadow: 'none'
    },
    header: {
      accentColor: 'primary',
      accentWidth: '3px',
      horizontalPadding: '32px',
      logoColor: 'primary',
      logoFontFamily: '"Courier New", Courier, monospace',
      logoTextTransform: 'uppercase',
      logoLetterSpacing: '0.12em',
      imageBorderRadius: '0px'
    },
    body: {
      accentColor: 'primary',
      accentWidth: '5px',
      borderRadius: '0px',
      boxShadow: 'none',
      horizontalPadding: '32px',
      lineHeight: 1.7
    },
    button: {
      appearance: 'solid',
      borderRadius: '0px',
      borderWidth: '0px',
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
