import { ThemeType } from "../../core/enums/theme.enum";

export type IThemeColorToken = 'primary' | 'secondary' | 'border' | 'none';
export type IThemeTextTransform = 'none' | 'uppercase' | 'capitalize';

/**
 * Optional, email-client-conscious visual tokens used by TemplateBuilder.
 * Existing custom ITheme implementations remain compatible when this is omitted.
 */
export interface IThemeEmailStyles {
  /** Fixed-width fallback for desktop email clients; the renderer also emits fluid width styles. */
  maxWidthPx: number;
  container: {
    borderColor: IThemeColorToken;
    borderWidth: string;
    borderRadius: string;
    boxShadow: string;
  };
  header: {
    accentColor: IThemeColorToken;
    accentWidth: string;
    horizontalPadding: string;
    logoColor: 'text' | 'primary' | 'secondary';
    logoFontFamily?: string;
    logoTextTransform?: IThemeTextTransform;
    logoLetterSpacing?: string;
    imageBorderRadius: string;
  };
  body: {
    accentColor: IThemeColorToken;
    accentWidth: string;
    borderRadius: string;
    boxShadow: string;
    horizontalPadding: string;
    lineHeight: number;
  };
  button: {
    appearance: 'solid' | 'outline';
    borderRadius: string;
    borderWidth: string;
    boxShadow: string;
    textTransform?: IThemeTextTransform;
    letterSpacing?: string;
  };
  footer: {
    accentColor: IThemeColorToken;
    accentWidth: string;
  };
}

export interface ITheme {
  id: ThemeType;
  name: string;
  light: IThemeColors;
  dark: IThemeColors;
  typography: ITypography;
  spacing: ISpacing;
  /** Optional structural style tokens; omitted tokens fall back to conservative email-safe defaults. */
  emailStyles?: IThemeEmailStyles;
}

export interface IThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  error: string;
  warning: string;
}

export interface ITypography {
  fontFamily: string;
  fontSizes: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
  fontWeights: {
    normal: number;
    medium: number;
    bold: number;
  };
}

export interface ISpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}
