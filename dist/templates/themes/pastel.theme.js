"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PastelTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class PastelTheme {
    id = theme_enum_1.ThemeType.PASTEL;
    name = 'Pastel';
    light = {
        primary: '#76536B',
        secondary: '#796C78',
        background: '#FFFAF4',
        text: '#352D36',
        textMuted: '#655B65',
        border: '#E8DCD9',
        success: '#356B56',
        error: '#9B4148',
        warning: '#80551F'
    };
    dark = {
        primary: '#765A80',
        secondary: '#C7B7CB',
        background: '#211D27',
        text: '#F7F0F5',
        textMuted: '#C9BEC9',
        border: '#49404D',
        success: '#8FCBAA',
        error: '#F0A0A4',
        warning: '#E8C17B'
    };
    typography = {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSizes: {
            small: '14px',
            medium: '16px',
            large: '18px',
            xlarge: '26px'
        },
        fontWeights: {
            normal: 400,
            medium: 500,
            bold: 700
        }
    };
    spacing = {
        xs: '6px',
        sm: '12px',
        md: '20px',
        lg: '30px',
        xl: '44px'
    };
    emailStyles = {
        maxWidthPx: 600,
        container: {
            borderColor: 'border',
            borderWidth: '1px',
            borderRadius: '14px',
            boxShadow: '0 2px 10px rgba(53, 45, 54, 0.08)'
        },
        header: {
            accentColor: 'primary',
            accentWidth: '3px',
            horizontalPadding: '28px',
            logoColor: 'primary',
            logoFontFamily: 'Georgia, "Times New Roman", serif',
            logoLetterSpacing: '0.03em',
            imageBorderRadius: '10px'
        },
        body: {
            accentColor: 'secondary',
            accentWidth: '2px',
            borderRadius: '10px',
            boxShadow: 'none',
            horizontalPadding: '28px',
            lineHeight: 1.6
        },
        button: {
            appearance: 'solid',
            borderRadius: '18px',
            borderWidth: '1px',
            boxShadow: 'none',
            letterSpacing: '0.01em'
        },
        footer: {
            accentColor: 'border',
            accentWidth: '1px'
        }
    };
}
exports.PastelTheme = PastelTheme;
