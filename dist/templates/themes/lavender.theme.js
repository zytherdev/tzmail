"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LavenderTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class LavenderTheme {
    id = theme_enum_1.ThemeType.LAVENDER;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Lavender';
    light = {
        primary: '#593982',
        secondary: '#7F496E',
        background: '#F1ECF8',
        text: '#30213E',
        textMuted: '#65536E',
        border: '#BFAACE',
        success: '#28613B',
        error: '#9D3932',
        warning: '#73560D'
    };
    dark = {
        primary: '#C5A5F4',
        secondary: '#E4A5CA',
        background: '#251A35',
        text: '#F5ECFF',
        textMuted: '#CDBCDC',
        border: '#59466F',
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
            borderWidth: '1px',
            borderRadius: '0px',
            boxShadow: 'none'
        },
        header: {
            accentColor: 'primary',
            accentWidth: '3px',
            horizontalPadding: '44px',
            logoColor: 'primary',
            logoFontFamily: 'Georgia, "Times New Roman", Times, serif',
            logoTextTransform: 'uppercase',
            logoLetterSpacing: '0.12em',
            imageBorderRadius: '0px'
        },
        body: {
            accentColor: 'none',
            accentWidth: '0px',
            borderRadius: '0px',
            boxShadow: 'none',
            horizontalPadding: '44px',
            lineHeight: 1.8
        },
        button: {
            appearance: 'outline',
            borderRadius: '0px',
            borderWidth: '2px',
            boxShadow: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
        },
        footer: {
            accentColor: 'border',
            accentWidth: '1px'
        }
    };
}
exports.LavenderTheme = LavenderTheme;
