import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
import { getThemeComposition } from './theme-designs';

export class BerryTheme implements ITheme {
  id = ThemeType.BERRY;
  composition = getThemeComposition(this.id);
  name = 'Berry';
  light: IThemeColors = {
    primary: '#85274C',
    secondary: '#7F2B58',
    background: '#F4E5ED',
    text: '#402537',
    textMuted: '#5D4352',
    border: '#C9A5BA',
    success: '#235433',
    error: '#822F2A',
    warning: '#5F470A'
  };
  dark: IThemeColors = {
    primary: '#EE9CBD',
    secondary: '#E9A6D4',
    background: '#311D2B',
    text: '#FBEAF3',
    textMuted: '#D5B5C8',
    border: '#674059',
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
  spacing: ISpacing = { xs: '6px', sm: '12px', md: '20px', lg: '32px', xl: '48px' };
  emailStyles: IThemeEmailStyles = {
    maxWidthPx: 600,
    container: {
      borderColor: 'border',
      borderWidth: '1px',
      borderRadius: '10px',
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
      imageBorderRadius: '10px'
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
      accentColor: 'border',
      accentWidth: '1px'
    }
  };
}
