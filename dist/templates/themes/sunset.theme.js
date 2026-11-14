"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SunsetTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class SunsetTheme {
    id = theme_enum_1.ThemeType.SUNSET;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Sunset';
    light = {
        primary: '#92362D',
        secondary: '#754B27',
        background: '#FFF0DC',
        text: '#462B26',
        textMuted: '#6A4E46',
        border: '#D2A68C',
        success: '#275F3A',
        error: '#93352F',
        warning: '#6B500C'
    };
    dark = {
        primary: '#FFAC8D',
        secondary: '#F5C78C',
        background: '#352019',
        text: '#FFF0DC',
        textMuted: '#DFC0AC',
        border: '#785342',
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
            horizontalPadding: '32px',
            logoColor: 'text',
            logoFontFamily: 'Arial, Helvetica, sans-serif',
            logoTextTransform: 'none',
            logoLetterSpacing: '-0.035em',
            imageBorderRadius: '0px'
        },
        body: {
            accentColor: 'none',
            accentWidth: '0px',
            borderRadius: '0px',
            boxShadow: 'none',
            horizontalPadding: '32px',
            lineHeight: 1.65
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
            accentColor: 'primary',
            accentWidth: '1px'
        }
    };
}
exports.SunsetTheme = SunsetTheme;
