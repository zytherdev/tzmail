import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
import { getThemeComposition } from './theme-designs';
export class ClayTheme implements ITheme {
  id = ThemeType.CLAY;
  composition = getThemeComposition(this.id);
  name = 'Clay';
  light: IThemeColors = {
    primary: '#7A3E27',
    secondary: '#704428',
    background: '#F6E7D7',
    text: '#453025',
    textMuted: '#644939',
    border: '#CBAB90',
    success: '#245836',
    error: '#89322C',
    warning: '#644B0B'
  };
  dark: IThemeColors = {
    primary: '#EAB18C',
    secondary: '#EAC49E',
    background: '#34251D',
    text: '#FBEAD8',
    textMuted: '#DAC1AC',
    border: '#73543F',
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
  spacing: ISpacing = { xs: '5px', sm: '10px', md: '18px', lg: '26px', xl: '36px' };
  emailStyles: IThemeEmailStyles = {
    maxWidthPx: 580,
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
      accentWidth: '1px',
      borderRadius: '6px',
      boxShadow: 'none',
      horizontalPadding: '36px',
      lineHeight: 1.8
    },
    button: {
      appearance: 'solid',
      borderRadius: '6px',
      borderWidth: '0px',
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
