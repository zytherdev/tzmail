"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitrusTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class CitrusTheme {
    id = theme_enum_1.ThemeType.CITRUS;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Citrus';
    light = {
        primary: '#973B0F',
        secondary: '#784F0F',
        background: '#FFF1D1',
        text: '#422D12',
        textMuted: '#6B5438',
        border: '#D7B47A',
        success: '#28613B',
        error: '#993731',
        warning: '#6F540C'
    };
    dark = {
        primary: '#FFB36E',
        secondary: '#F4CF76',
        background: '#342415',
        text: '#FFF2D9',
        textMuted: '#DCC49A',
        border: '#765536',
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
    spacing = { xs: '6px', sm: '12px', md: '20px', lg: '30px', xl: '46px' };
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
            logoLetterSpacing: '-0.035em',
            imageBorderRadius: '0px'
        },
        body: {
            accentColor: 'primary',
            accentWidth: '1px',
            borderRadius: '0px',
            boxShadow: 'none',
            horizontalPadding: '36px',
            lineHeight: 1.7
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
exports.CitrusTheme = CitrusTheme;
