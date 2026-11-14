"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InkwellTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class InkwellTheme {
    id = theme_enum_1.ThemeType.INKWELL;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Inkwell';
    light = {
        primary: '#262829',
        secondary: '#4D5051',
        background: '#F0EFEB',
        text: '#292B2C',
        textMuted: '#565656',
        border: '#B5B3AD',
        success: '#28613B',
        error: '#963630',
        warning: '#6D520C'
    };
    dark = {
        primary: '#E5E4DD',
        secondary: '#C3C7C7',
        background: '#242627',
        text: '#F4F4EB',
        textMuted: '#C8CAC6',
        border: '#575C5A',
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
    spacing = { xs: '4px', sm: '9px', md: '17px', lg: '25px', xl: '36px' };
    emailStyles = {
        maxWidthPx: 620,
        container: {
            borderColor: 'primary',
            borderWidth: '1px',
            borderRadius: '0px',
            boxShadow: 'none'
        },
        header: {
            accentColor: 'primary',
            accentWidth: '2px',
            horizontalPadding: '36px',
            logoColor: 'text',
            logoFontFamily: 'Georgia, "Times New Roman", Times, serif',
            logoTextTransform: 'uppercase',
            logoLetterSpacing: '0.12em',
            imageBorderRadius: '0px'
        },
        body: {
            accentColor: 'primary',
            accentWidth: '1px',
            borderRadius: '0px',
            boxShadow: 'none',
            horizontalPadding: '36px',
            lineHeight: 1.75
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
exports.InkwellTheme = InkwellTheme;
