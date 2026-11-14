"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlateTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class SlateTheme {
    id = theme_enum_1.ThemeType.SLATE;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Slate';
    light = {
        primary: '#3D5266',
        secondary: '#405162',
        background: '#EAF0F4',
        text: '#20313F',
        textMuted: '#43525B',
        border: '#A5B7C3',
        success: '#255A37',
        error: '#8B322C',
        warning: '#654C0B'
    };
    dark = {
        primary: '#B2CADA',
        secondary: '#9AB9D2',
        background: '#1B2A35',
        text: '#EFF7FC',
        textMuted: '#BED0DB',
        border: '#475E70',
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
    spacing = { xs: '5px', sm: '10px', md: '18px', lg: '24px', xl: '34px' };
    emailStyles = {
        maxWidthPx: 620,
        container: {
            borderColor: 'border',
            borderWidth: '1px',
            borderRadius: '0px',
            boxShadow: 'none'
        },
        header: {
            accentColor: 'secondary',
            accentWidth: '3px',
            horizontalPadding: '32px',
            logoColor: 'text',
            logoFontFamily: '"Courier New", Courier, monospace',
            logoTextTransform: 'uppercase',
            logoLetterSpacing: '0.06em',
            imageBorderRadius: '0px'
        },
        body: {
            accentColor: 'primary',
            accentWidth: '1px',
            borderRadius: '0px',
            boxShadow: 'none',
            horizontalPadding: '32px',
            lineHeight: 1.65
        },
        button: {
            appearance: 'outline',
            borderRadius: '0px',
            borderWidth: '2px',
            boxShadow: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
        },
        footer: {
            accentColor: 'border',
            accentWidth: '1px'
        }
    };
}
exports.SlateTheme = SlateTheme;
