"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarigoldTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class MarigoldTheme {
    id = theme_enum_1.ThemeType.MARIGOLD;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Marigold';
    light = {
        primary: '#7B510B',
        secondary: '#884A13',
        background: '#FFF0C7',
        text: '#493418',
        textMuted: '#6B5733',
        border: '#D1B277',
        success: '#28613B',
        error: '#9C3932',
        warning: '#72560C'
    };
    dark = {
        primary: '#F1CA6C',
        secondary: '#F6B86C',
        background: '#342715',
        text: '#FFF3CF',
        textMuted: '#DFCAA2',
        border: '#7A5E31',
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
    spacing = { xs: '5px', sm: '10px', md: '18px', lg: '26px', xl: '38px' };
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
            horizontalPadding: '36px',
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
            horizontalPadding: '36px',
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
exports.MarigoldTheme = MarigoldTheme;
