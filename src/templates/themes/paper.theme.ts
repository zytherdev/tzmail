import { ThemeType } from '../../core/enums/theme.enum';
import { ITheme, IThemeColors, ITypography, ISpacing, IThemeEmailStyles } from './theme.interface';
import { getThemeComposition } from './theme-designs';

export class PaperTheme implements ITheme {
  id = ThemeType.PAPER;
  composition = getThemeComposition(this.id);
  name = 'Paper';
  light: IThemeColors = {
    primary: '#71442F',
    secondary: '#5F4D22',
    background: '#F3E8D4',
    text: '#342A21',
    textMuted: '#5A4D40',
    border: '#C4B292',
    success: '#255936',
    error: '#8A322C',
    warning: '#654B0B'
  };
  dark: IThemeColors = {
    primary: '#D9AF88',
    secondary: '#DFC58B',
    background: '#30281C',
    text: '#F5EAD3',
    textMuted: '#CBBCA1',
    border: '#6A5940',
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
  spacing: ISpacing = { xs: '6px', sm: '12px', md: '22px', lg: '34px', xl: '52px' };
  emailStyles: IThemeEmailStyles = {
    maxWidthPx: 580,
    container: {
      borderColor: 'border',
      borderWidth: '1px',
      borderRadius: '0px',
      boxShadow: 'none'
    },
    header: {
      accentColor: 'primary',
      accentWidth: '2px',
      horizontalPadding: '40px',
      logoColor: 'primary',
      logoFontFamily: 'Georgia, "Times New Roman", Times, serif',
      logoTextTransform: 'uppercase',
      logoLetterSpacing: '0.12em',
      imageBorderRadius: '0px'
    },
    body: {
      accentColor: 'none',
      accentWidth: '0px',
      borderRadius: '0px',
      boxShadow: 'none',
      horizontalPadding: '40px',
      lineHeight: 1.85
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
