"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForestTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class ForestTheme {
    id = theme_enum_1.ThemeType.FOREST;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Forest';
    light = {
        primary: '#315A32',
        secondary: '#4D592E',
        background: '#EDF0DC',
        text: '#25351F',
        textMuted: '#4E5841',
        border: '#ADB893',
        success: '#275F3A',
        error: '#93352F',
        warning: '#6B500C'
    };
    dark = {
        primary: '#AAD299',
        secondary: '#C2CF89',
        background: '#202B19',
        text: '#F0F4DD',
        textMuted: '#C3CBA9',
        border: '#4D5B36',
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
        maxWidthPx: 600,
        container: {
            borderColor: 'border',
            borderWidth: '1px',
            borderRadius: '6px',
            boxShadow: 'none'
        },
        header: {
            accentColor: 'primary',
            accentWidth: '3px',
            horizontalPadding: '36px',
            logoColor: 'primary',
            logoFontFamily: 'Georgia, "Times New Roman", Times, serif',
            logoTextTransform: 'none',
            logoLetterSpacing: '0.02em',
            imageBorderRadius: '6px'
        },
        body: {
            accentColor: 'primary',
            accentWidth: '5px',
            borderRadius: '6px',
            boxShadow: 'none',
            horizontalPadding: '36px',
            lineHeight: 1.8
        },
        button: {
            appearance: 'outline',
            borderRadius: '6px',
            borderWidth: '2px',
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
exports.ForestTheme = ForestTheme;
