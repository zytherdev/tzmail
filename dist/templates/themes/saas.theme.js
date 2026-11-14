"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaaSTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class SaaSTheme {
    id = theme_enum_1.ThemeType.SAAS;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'SaaS';
    light = {
        primary: '#443CAA',
        secondary: '#624D9B',
        background: '#F0F0FB',
        text: '#242846',
        textMuted: '#565876',
        border: '#B3B4D5',
        success: '#28613B',
        error: '#9C3932',
        warning: '#72560D'
    };
    dark = {
        primary: '#B1AFFA',
        secondary: '#CCAFF4',
        background: '#20203A',
        text: '#F3F2FF',
        textMuted: '#C6C4DF',
        border: '#4C4B70',
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
    spacing = { xs: '6px', sm: '12px', md: '20px', lg: '30px', xl: '44px' };
    emailStyles = {
        maxWidthPx: 620,
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
            accentColor: 'primary',
            accentWidth: '1px',
            borderRadius: '8px',
            boxShadow: 'none',
            horizontalPadding: '32px',
            lineHeight: 1.65
        },
        button: {
            appearance: 'solid',
            borderRadius: '8px',
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
exports.SaaSTheme = SaaSTheme;
