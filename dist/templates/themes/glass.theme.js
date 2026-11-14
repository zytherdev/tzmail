"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class GlassTheme {
    id = theme_enum_1.ThemeType.GLASS;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Glass';
    light = {
        primary: '#205E7A',
        secondary: '#485F6A',
        background: '#EAF4F7',
        text: '#1D3744',
        textMuted: '#47606A',
        border: '#A2BDC6',
        success: '#28613B',
        error: '#A03A33',
        warning: '#75570D'
    };
    dark = {
        primary: '#94D5E8',
        secondary: '#BCD8E4',
        background: '#172C35',
        text: '#EAF7FC',
        textMuted: '#B8D0DB',
        border: '#42616E',
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
            accentColor: 'secondary',
            accentWidth: '3px',
            horizontalPadding: '36px',
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
            horizontalPadding: '36px',
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
exports.GlassTheme = GlassTheme;
