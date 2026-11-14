"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampusTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class CampusTheme {
    id = theme_enum_1.ThemeType.CAMPUS;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Campus';
    light = {
        primary: '#793B26',
        secondary: '#624E17',
        background: '#F2E8D0',
        text: '#392E21',
        textMuted: '#5D4E39',
        border: '#C5AE86',
        success: '#255A37',
        error: '#8B322C',
        warning: '#664C0B'
    };
    dark = {
        primary: '#E8B58F',
        secondary: '#E9D296',
        background: '#2B261C',
        text: '#F6ECD3',
        textMuted: '#CEBFA1',
        border: '#68583A',
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
            borderWidth: '1px',
            borderRadius: '0px',
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
            textTransform: 'none',
            letterSpacing: '0.01em'
        },
        footer: {
            accentColor: 'border',
            accentWidth: '1px'
        }
    };
}
exports.CampusTheme = CampusTheme;
