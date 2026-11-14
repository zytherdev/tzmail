"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrbitTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class OrbitTheme {
    id = theme_enum_1.ThemeType.ORBIT;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Orbit';
    light = {
        primary: '#4936A0',
        secondary: '#693B9D',
        background: '#EEEAFB',
        text: '#2A2549',
        textMuted: '#584E6B',
        border: '#B5A6D1',
        success: '#275D39',
        error: '#90342E',
        warning: '#694E0B'
    };
    dark = {
        primary: '#BBABFA',
        secondary: '#D0AEF9',
        background: '#251C3F',
        text: '#F5EEFF',
        textMuted: '#CCC0E2',
        border: '#57456F',
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
    spacing = { xs: '5px', sm: '10px', md: '18px', lg: '26px', xl: '36px' };
    emailStyles = {
        maxWidthPx: 620,
        container: {
            borderColor: 'primary',
            borderWidth: '1px',
            borderRadius: '18px',
            boxShadow: 'none'
        },
        header: {
            accentColor: 'primary',
            accentWidth: '3px',
            horizontalPadding: '36px',
            logoColor: 'text',
            logoFontFamily: 'Arial, Helvetica, sans-serif',
            logoTextTransform: 'none',
            logoLetterSpacing: '0.02em',
            imageBorderRadius: '18px'
        },
        body: {
            accentColor: 'primary',
            accentWidth: '1px',
            borderRadius: '8px',
            boxShadow: 'none',
            horizontalPadding: '36px',
            lineHeight: 1.65
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
            accentColor: 'primary',
            accentWidth: '1px'
        }
    };
}
exports.OrbitTheme = OrbitTheme;
