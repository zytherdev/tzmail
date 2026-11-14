"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloomTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class BloomTheme {
    id = theme_enum_1.ThemeType.BLOOM;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Bloom';
    light = {
        primary: '#9C3464',
        secondary: '#8C416D',
        background: '#FAEAF1',
        text: '#442638',
        textMuted: '#745162',
        border: '#D4ACBF',
        success: '#28613B',
        error: '#9E3933',
        warning: '#73570D'
    };
    dark = {
        primary: '#F2A4CB',
        secondary: '#DEABD3',
        background: '#34202E',
        text: '#FDEDF5',
        textMuted: '#DBBDCF',
        border: '#6E455E',
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
        maxWidthPx: 600,
        container: {
            borderColor: 'border',
            borderWidth: '0px',
            borderRadius: '14px',
            boxShadow: 'none'
        },
        header: {
            accentColor: 'primary',
            accentWidth: '3px',
            horizontalPadding: '36px',
            logoColor: 'text',
            logoFontFamily: 'Georgia, "Times New Roman", Times, serif',
            logoTextTransform: 'none',
            logoLetterSpacing: '0.02em',
            imageBorderRadius: '14px'
        },
        body: {
            accentColor: 'none',
            accentWidth: '0px',
            borderRadius: '8px',
            boxShadow: 'none',
            horizontalPadding: '36px',
            lineHeight: 1.8
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
            accentColor: 'border',
            accentWidth: '1px'
        }
    };
}
exports.BloomTheme = BloomTheme;
