"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorialTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class EditorialTheme {
    id = theme_enum_1.ThemeType.EDITORIAL;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Editorial';
    light = {
        primary: '#86352B',
        secondary: '#614F40',
        background: '#F4EAD6',
        text: '#31271E',
        textMuted: '#5F4F40',
        border: '#C9B89E',
        success: '#265D39',
        error: '#8F342E',
        warning: '#694E0B'
    };
    dark = {
        primary: '#EEAF92',
        secondary: '#D7C298',
        background: '#2D251A',
        text: '#F9EED6',
        textMuted: '#D0C1A4',
        border: '#685740',
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
        xl: '36px'
    };
    emailStyles = {
        maxWidthPx: 640,
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
            lineHeight: 1.75
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
exports.EditorialTheme = EditorialTheme;
