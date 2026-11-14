"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OceanTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class OceanTheme {
    id = theme_enum_1.ThemeType.OCEAN;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Ocean';
    light = {
        primary: '#174E79',
        secondary: '#1F5D71',
        background: '#EEF5FC',
        text: '#16334D',
        textMuted: '#44596A',
        border: '#A0BACA',
        success: '#28613B',
        error: '#963630',
        warning: '#6E520C'
    };
    dark = {
        primary: '#8CCDF7',
        secondary: '#8AE2E5',
        background: '#122A40',
        text: '#EAF6FF',
        textMuted: '#AFCCD9',
        border: '#3A6077',
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
            accentWidth: '3px',
            horizontalPadding: '40px',
            logoColor: 'text',
            logoFontFamily: 'Georgia, "Times New Roman", Times, serif',
            logoTextTransform: 'none',
            logoLetterSpacing: '-0.035em',
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
            appearance: 'solid',
            borderRadius: '0px',
            borderWidth: '0px',
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
exports.OceanTheme = OceanTheme;
