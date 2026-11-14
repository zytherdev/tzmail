"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinimalTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class MinimalTheme {
    id = theme_enum_1.ThemeType.MINIMAL;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Minimal';
    light = {
        primary: '#151515',
        secondary: '#454545',
        background: '#FFFFFF',
        text: '#161616',
        textMuted: '#595959',
        border: '#BBBBBB',
        success: '#28613B',
        error: '#A33B34',
        warning: '#80600E'
    };
    dark = {
        primary: '#EEEEEE',
        secondary: '#C4C4C4',
        background: '#181818',
        text: '#FAFAFA',
        textMuted: '#C6C6C6',
        border: '#484848',
        success: '#97DDB2',
        error: '#F5ACA2',
        warning: '#EDCE8A'
    };
    typography = {
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
    spacing = {
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '32px',
        xl: '48px'
    };
    emailStyles = {
        maxWidthPx: 600,
        container: {
            borderColor: 'border',
            borderWidth: '0px',
            borderRadius: '0px',
            boxShadow: 'none'
        },
        header: {
            accentColor: 'none',
            accentWidth: '0px',
            horizontalPadding: '44px',
            logoColor: 'text',
            logoFontFamily: 'Arial, Helvetica, sans-serif',
            logoTextTransform: 'none',
            logoLetterSpacing: '0.02em',
            imageBorderRadius: '0px'
        },
        body: {
            accentColor: 'none',
            accentWidth: '0px',
            borderRadius: '0px',
            boxShadow: 'none',
            horizontalPadding: '44px',
            lineHeight: 1.7
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
            accentColor: 'none',
            accentWidth: '0px'
        }
    };
    // cores minimalistas
    minimalColors = {
        white: '#ffffff',
        black: '#000000',
        gray100: '#f5f5f5',
        gray200: '#e5e5e5',
        gray300: '#d4d4d4',
        gray400: '#a3a3a3',
        gray500: '#737373',
        gray600: '#525252',
        gray700: '#404040',
        gray800: '#262626',
        gray900: '#171717'
    };
    borderStyle = {
        radius: {
            none: '0px',
            small: '2px',
            medium: '4px',
            large: '8px',
            full: '9999px'
        },
        width: {
            thin: '1px',
            medium: '2px'
        },
        style: 'solid'
    };
    effects = {
        shadow: 'none',
        transition: 'all 0.2s ease',
        opacity: {
            hover: '0.7',
            disabled: '0.5'
        }
    };
    layout = {
        maxWidth: '640px',
        contentWidth: '560px',
        spacingMultiplier: 1.5,
        lineHeight: 1.6,
        paragraphSpacing: '1.5em'
    };
    designSystem = {
        grid: {
            columns: 12,
            gutter: '20px',
            margin: '20px'
        },
        breakpoints: {
            mobile: '480px',
            tablet: '768px',
            desktop: '1024px'
        },
        zIndex: {
            base: 1,
            overlay: 10,
            modal: 100
        }
    };
}
exports.MinimalTheme = MinimalTheme;
