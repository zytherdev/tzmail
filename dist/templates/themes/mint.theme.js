"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class MintTheme {
    id = theme_enum_1.ThemeType.MINT;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Mint';
    light = {
        primary: '#1E6651',
        secondary: '#276A64',
        background: '#EBF6EC',
        text: '#233A2F',
        textMuted: '#4F6657',
        border: '#A8C5AF',
        success: '#28613B',
        error: '#A33B34',
        warning: '#7A5C0D'
    };
    dark = {
        primary: '#9AE0B8',
        secondary: '#8FD6C8',
        background: '#1C3027',
        text: '#EEFCF1',
        textMuted: '#BED8C5',
        border: '#496D59',
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
        maxWidthPx: 600,
        container: {
            borderColor: 'border',
            borderWidth: '1px',
            borderRadius: '8px',
            boxShadow: 'none'
        },
        header: {
            accentColor: 'primary',
            accentWidth: '3px',
            horizontalPadding: '32px',
            logoColor: 'text',
            logoFontFamily: 'Arial, Helvetica, sans-serif',
            logoTextTransform: 'uppercase',
            logoLetterSpacing: '0.12em',
            imageBorderRadius: '8px'
        },
        body: {
            accentColor: 'none',
            accentWidth: '0px',
            borderRadius: '8px',
            boxShadow: 'none',
            horizontalPadding: '32px',
            lineHeight: 1.7
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
exports.MintTheme = MintTheme;
