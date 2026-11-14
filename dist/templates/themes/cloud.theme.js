"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class CloudTheme {
    id = theme_enum_1.ThemeType.CLOUD;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Cloud';
    light = {
        primary: '#305DA3',
        secondary: '#506479',
        background: '#F0F5FA',
        text: '#263950',
        textMuted: '#536473',
        border: '#B4C4D4',
        success: '#28613B',
        error: '#A33B34',
        warning: '#7D5D0E'
    };
    dark = {
        primary: '#B2CEF4',
        secondary: '#BFD7E8',
        background: '#1E2C3D',
        text: '#F0F7FF',
        textMuted: '#C5D5E1',
        border: '#496178',
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
    spacing = { xs: '5px', sm: '10px', md: '18px', lg: '25px', xl: '34px' };
    emailStyles = {
        maxWidthPx: 620,
        container: {
            borderColor: 'border',
            borderWidth: '0px',
            borderRadius: '16px',
            boxShadow: 'none'
        },
        header: {
            accentColor: 'none',
            accentWidth: '0px',
            horizontalPadding: '36px',
            logoColor: 'text',
            logoFontFamily: 'Verdana, Geneva, Arial, sans-serif',
            logoTextTransform: 'none',
            logoLetterSpacing: '0.02em',
            imageBorderRadius: '16px'
        },
        body: {
            accentColor: 'primary',
            accentWidth: '1px',
            borderRadius: '8px',
            boxShadow: 'none',
            horizontalPadding: '36px',
            lineHeight: 1.75
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
exports.CloudTheme = CloudTheme;
