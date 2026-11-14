"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TideTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class TideTheme {
    id = theme_enum_1.ThemeType.TIDE;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Tide';
    light = {
        primary: '#1A5E59',
        secondary: '#265B6C',
        background: '#E8F3EF',
        text: '#233D38',
        textMuted: '#435954',
        border: '#9ABBB0',
        success: '#275F3A',
        error: '#94352F',
        warning: '#6B510C'
    };
    dark = {
        primary: '#8ED7C7',
        secondary: '#9ED9E5',
        background: '#19302D',
        text: '#E9FAF4',
        textMuted: '#B9D5CA',
        border: '#436A60',
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
    spacing = { xs: '5px', sm: '10px', md: '18px', lg: '26px', xl: '36px' };
    emailStyles = {
        maxWidthPx: 620,
        container: {
            borderColor: 'border',
            borderWidth: '0px',
            borderRadius: '12px',
            boxShadow: 'none'
        },
        header: {
            accentColor: 'secondary',
            accentWidth: '3px',
            horizontalPadding: '40px',
            logoColor: 'text',
            logoFontFamily: 'Arial, Helvetica, sans-serif',
            logoTextTransform: 'none',
            logoLetterSpacing: '0.02em',
            imageBorderRadius: '12px'
        },
        body: {
            accentColor: 'none',
            accentWidth: '0px',
            borderRadius: '8px',
            boxShadow: 'none',
            horizontalPadding: '40px',
            lineHeight: 1.75
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
            accentColor: 'none',
            accentWidth: '0px'
        }
    };
}
exports.TideTheme = TideTheme;
