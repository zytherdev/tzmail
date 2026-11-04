"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinimalTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class MinimalTheme {
    id = theme_enum_1.ThemeType.MINIMAL;
    name = 'Minimal';
    light = {
        primary: '#000000',
        secondary: '#404040',
        background: '#ffffff',
        text: '#111111',
        textMuted: '#666666',
        border: '#e5e5e5',
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f97316'
    };
    dark = {
        primary: '#ffffff',
        secondary: '#a3a3a3',
        background: '#000000',
        text: '#ffffff',
        textMuted: '#737373',
        border: '#262626',
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f97316'
    };
    typography = {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSizes: {
            small: '13px',
            medium: '15px',
            large: '17px',
            xlarge: '21px'
        },
        fontWeights: {
            normal: 400,
            medium: 500,
            bold: 600
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
            borderWidth: '1px',
            borderRadius: '2px',
            boxShadow: 'none'
        },
        header: {
            accentColor: 'primary',
            accentWidth: '2px',
            horizontalPadding: '24px',
            logoColor: 'text',
            logoLetterSpacing: '0.02em',
            imageBorderRadius: '0px'
        },
        body: {
            accentColor: 'border',
            accentWidth: '1px',
            borderRadius: '2px',
            boxShadow: 'none',
            horizontalPadding: '24px',
            lineHeight: 1.6
        },
        button: {
            appearance: 'outline',
            borderRadius: '2px',
            borderWidth: '1px',
            boxShadow: 'none',
            textTransform: 'none',
            letterSpacing: '0.02em'
        },
        footer: {
            accentColor: 'border',
            accentWidth: '1px'
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
