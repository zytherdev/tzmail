import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
import { getThemeComposition } from './theme-designs';
export class TideTheme implements ITheme {
  id = ThemeType.TIDE;
  composition = getThemeComposition(this.id);
  name = 'Tide';
  light: IThemeColors = {
    primary: '#1A5E59',
    secondary: '#265B6C',
    background: '#E8F3EF',
    text: '#233D38',
    textMuted: '#435954',
    border: '#9ABBB0',
    success: '#275F3A',
    error: '#94352F',
    warning: '#6B510C'
  };
  dark: IThemeColors = {
    primary: '#8ED7C7',
    secondary: '#9ED9E5',
    background: '#19302D',
    text: '#E9FAF4',
    textMuted: '#B9D5CA',
    border: '#436A60',
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
    maxWidthPx: 620,
    container: {
      borderColor: 'border',
      borderWidth: '0px',
      borderRadius: '12px',
      boxShadow: 'none'
    },
    header: {
      accentColor: 'secondary',
      accentWidth: '3px',
      horizontalPadding: '40px',
      logoColor: 'text',
      logoFontFamily: 'Arial, Helvetica, sans-serif',
      logoTextTransform: 'none',
      logoLetterSpacing: '0.02em',
      imageBorderRadius: '12px'
    },
    body: {
      accentColor: 'none',
      accentWidth: '0px',
      borderRadius: '8px',
      boxShadow: 'none',
      horizontalPadding: '40px',
      lineHeight: 1.75
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
