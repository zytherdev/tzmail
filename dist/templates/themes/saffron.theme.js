"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaffronTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class SaffronTheme {
    id = theme_enum_1.ThemeType.SAFFRON;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Saffron';
    light = {
        primary: '#873C19',
        secondary: '#6B4D0E',
        background: '#FFF0D6',
        text: '#48301C',
        textMuted: '#684C35',
        border: '#D1AC7A',
        success: '#265C38',
        error: '#8F342E',
        warning: '#694E0B'
    };
    dark = {
        primary: '#F7B374',
        secondary: '#E9D075',
        background: '#342317',
        text: '#FFF0D4',
        textMuted: '#DCC4A0',
        border: '#7C5734',
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
            borderColor: 'border',
            borderWidth: '1px',
            borderRadius: '0px',
            boxShadow: 'none'
        },
        header: {
            accentColor: 'primary',
            accentWidth: '2px',
            horizontalPadding: '36px',
            logoColor: 'text',
            logoFontFamily: '"Arial Black", Arial, Helvetica, sans-serif',
            logoTextTransform: 'uppercase',
            logoLetterSpacing: '0.12em',
            imageBorderRadius: '0px'
        },
        body: {
            accentColor: 'primary',
            accentWidth: '5px',
            borderRadius: '0px',
            boxShadow: 'none',
            horizontalPadding: '36px',
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
            accentColor: 'border',
            accentWidth: '1px'
        }
    };
}
exports.SaffronTheme = SaffronTheme;
