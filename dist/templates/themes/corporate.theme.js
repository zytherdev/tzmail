"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorporateTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class CorporateTheme {
    id = theme_enum_1.ThemeType.CORPORATE;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Corporate';
    light = {
        primary: '#173F8A',
        secondary: '#3C536F',
        background: '#F0F5FB',
        text: '#152942',
        textMuted: '#4B5B73',
        border: '#ADBDD2',
        success: '#28613B',
        error: '#9C3932',
        warning: '#72550C'
    };
    dark = {
        primary: '#9BBEFF',
        secondary: '#C2D2E8',
        background: '#14223B',
        text: '#EDF3FF',
        textMuted: '#B9C9E1',
        border: '#405574',
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
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px'
    };
    // cores adicionais
    corporateColors = {
        gold: '#d4af37',
        silver: '#c0c0c0',
        bronze: '#cd7f32',
        navy: '#0a2540',
        charcoal: '#36454f',
        ivory: '#fffff0'
    };
    borderStyle = {
        radius: {
            small: '2px',
            medium: '4px',
            large: '8px',
            pill: '20px'
        },
        width: {
            thin: '1px',
            medium: '2px',
            thick: '3px'
        },
        style: 'solid'
    };
    elevation = {
        shadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        hover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    };
    branding = {
        logoSize: {
            small: '32px',
            medium: '48px',
            large: '64px'
        },
        letterSpacing: {
            tight: '-0.5px',
            normal: '0px',
            wide: '0.5px',
            wider: '1px'
        },
        textTransform: {
            uppercase: 'uppercase',
            lowercase: 'lowercase',
            capitalize: 'capitalize',
            normal: 'none'
        }
    };
    layout = {
        maxWidth: '600px',
        contentWidth: '560px',
        sidebarWidth: '200px',
        headerHeight: '80px',
        footerHeight: '120px'
    };
    emailStyles = {
        maxWidthPx: 620,
        container: {
            borderColor: 'border',
            borderWidth: '1px',
            borderRadius: '0px',
            boxShadow: 'none'
        },
        header: {
            accentColor: 'primary',
            accentWidth: '3px',
            horizontalPadding: '36px',
            logoColor: 'text',
            logoFontFamily: 'Georgia, "Times New Roman", Times, serif',
            logoTextTransform: 'none',
            logoLetterSpacing: '0.02em',
            imageBorderRadius: '0px'
        },
        body: {
            accentColor: 'none',
            accentWidth: '0px',
            borderRadius: '0px',
            boxShadow: 'none',
            horizontalPadding: '36px',
            lineHeight: 1.65
        },
        button: {
            appearance: 'outline',
            borderRadius: '0px',
            borderWidth: '2px',
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
exports.CorporateTheme = CorporateTheme;
