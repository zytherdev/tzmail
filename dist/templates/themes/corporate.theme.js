"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorporateTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class CorporateTheme {
    id = theme_enum_1.ThemeType.CORPORATE;
    name = 'Corporate';
    light = {
        primary: '#1e40af',
        secondary: '#334155',
        background: '#ffffff',
        text: '#0f172a',
        textMuted: '#475569',
        border: '#e2e8f0',
        success: '#059669',
        error: '#dc2626',
        warning: '#d97706'
    };
    dark = {
        primary: '#3b82f6',
        secondary: '#64748b',
        background: '#0f172a',
        text: '#f1f5f9',
        textMuted: '#94a3b8',
        border: '#1e293b',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
    };
    typography = {
        fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
        fontSizes: {
            small: '12px',
            medium: '14px',
            large: '16px',
            xlarge: '24px'
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
        maxWidthPx: 600,
        container: {
            borderColor: 'border',
            borderWidth: '1px',
            borderRadius: '4px',
            boxShadow: 'none'
        },
        header: {
            accentColor: 'primary',
            accentWidth: '3px',
            horizontalPadding: '28px',
            logoColor: 'text',
            logoFontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
            logoTextTransform: 'uppercase',
            logoLetterSpacing: '1px',
            imageBorderRadius: '2px'
        },
        body: {
            accentColor: 'secondary',
            accentWidth: '1px',
            borderRadius: '4px',
            boxShadow: 'none',
            horizontalPadding: '32px',
            lineHeight: 1.6
        },
        button: {
            appearance: 'solid',
            borderRadius: '2px',
            borderWidth: '1px',
            boxShadow: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        footer: {
            accentColor: 'border',
            accentWidth: '1px'
        }
    };
}
exports.CorporateTheme = CorporateTheme;
