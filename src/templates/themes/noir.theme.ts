import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
import { getThemeComposition } from './theme-designs';
export class NoirTheme implements ITheme {
  id = ThemeType.NOIR;
  composition = getThemeComposition(this.id);
  name = 'Noir';
  light: IThemeColors = {
    primary: '#242424',
    secondary: '#504E4E',
    background: '#F0EFED',
    text: '#232322',
    textMuted: '#504F4C',
    border: '#B4B1AC',
    success: '#255936',
    error: '#89322C',
    warning: '#654B0B'
  };
  dark: IThemeColors = {
    primary: '#E7E3DD',
    secondary: '#BEBBB7',
    background: '#1C1C1B',
    text: '#F8F4EC',
    textMuted: '#CAC5BB',
    border: '#504D48',
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
  spacing: ISpacing = { xs: '4px', sm: '8px', md: '16px', lg: '22px', xl: '30px' };
  emailStyles: IThemeEmailStyles = {
    maxWidthPx: 620,
    container: {
      borderColor: 'primary',
      borderWidth: '1px',
      borderRadius: '0px',
      boxShadow: 'none'
    },
    header: {
      accentColor: 'primary',
      accentWidth: '3px',
      horizontalPadding: '44px',
      logoColor: 'text',
      logoFontFamily: 'Georgia, "Times New Roman", Times, serif',
      logoTextTransform: 'none',
      logoLetterSpacing: '-0.035em',
      imageBorderRadius: '0px'
    },
    body: {
      accentColor: 'primary',
      accentWidth: '1px',
      borderRadius: '0px',
      boxShadow: 'none',
      horizontalPadding: '44px',
      lineHeight: 1.8
    },
    button: {
      appearance: 'outline',
      borderRadius: '0px',
      borderWidth: '2px',
      boxShadow: 'none',
      textTransform: 'uppercase',
      letterSpacing: '0.08em'
    },
    footer: {
      accentColor: 'border',
      accentWidth: '1px'
    }
  };
}
