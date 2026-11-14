"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PastelTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class PastelTheme {
    id = theme_enum_1.ThemeType.PASTEL;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Pastel';
    light = {
        primary: '#74415F',
        secondary: '#61506F',
        background: '#F5E8ED',
        text: '#3C2938',
        textMuted: '#6C5262',
        border: '#CBB0BD',
        success: '#28613B',
        error: '#9C3832',
        warning: '#72550C'
    };
    dark = {
        primary: '#DDA3BF',
        secondary: '#CDB8E5',
        background: '#2F1F2E',
        text: '#FBEAF2',
        textMuted: '#D4B9CB',
        border: '#624456',
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
        xs: '6px',
        sm: '12px',
        md: '20px',
        lg: '30px',
        xl: '44px'
    };
    emailStyles = {
        maxWidthPx: 580,
        container: {
            borderColor: 'border',
            borderWidth: '0px',
            borderRadius: '16px',
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
            imageBorderRadius: '16px'
        },
        body: {
            accentColor: 'none',
            accentWidth: '0px',
            borderRadius: '8px',
            boxShadow: 'none',
            horizontalPadding: '40px',
            lineHeight: 1.8
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
            accentColor: 'none',
            accentWidth: '0px'
        }
    };
}
exports.PastelTheme = PastelTheme;
