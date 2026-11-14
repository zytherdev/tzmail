"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinenTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class LinenTheme {
    id = theme_enum_1.ThemeType.LINEN;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Linen';
    light = {
        primary: '#625548',
        secondary: '#665443',
        background: '#F0EBE0',
        text: '#342F27',
        textMuted: '#5E564A',
        border: '#BFB3A0',
        success: '#28613B',
        error: '#973730',
        warning: '#6E530C'
    };
    dark = {
        primary: '#D0BEA4',
        secondary: '#C2B196',
        background: '#2A2721',
        text: '#F2EADD',
        textMuted: '#C8BEAD',
        border: '#5F5747',
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
        maxWidthPx: 560,
        container: {
            borderColor: 'border',
            borderWidth: '0px',
            borderRadius: '0px',
            boxShadow: 'none'
        },
        header: {
            accentColor: 'none',
            accentWidth: '0px',
            horizontalPadding: '44px',
            logoColor: 'text',
            logoFontFamily: 'Georgia, "Times New Roman", Times, serif',
            logoTextTransform: 'none',
            logoLetterSpacing: '0.02em',
            imageBorderRadius: '0px'
        },
        body: {
            accentColor: 'none',
            accentWidth: '0px',
            borderRadius: '0px',
            boxShadow: 'none',
            horizontalPadding: '44px',
            lineHeight: 1.85
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
exports.LinenTheme = LinenTheme;
