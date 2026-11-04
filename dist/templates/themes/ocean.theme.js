"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OceanTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class OceanTheme {
    id = theme_enum_1.ThemeType.OCEAN;
    name = 'Ocean';
    light = {
        primary: '#075985',
        secondary: '#0E7490',
        background: '#F4FAFC',
        text: '#102A43',
        textMuted: '#486581',
        border: '#C7DCE5',
        success: '#166534',
        error: '#B42318',
        warning: '#92400E'
    };
    dark = {
        primary: '#67E8F9',
        secondary: '#5EEAD4',
        background: '#071B2B',
        text: '#E6F4F7',
        textMuted: '#A6C8D1',
        border: '#244657',
        success: '#6EE7B7',
        error: '#FDA4AF',
        warning: '#FCD34D'
    };
    typography = {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSizes: {
            small: '14px',
            medium: '16px',
            large: '18px',
            xlarge: '26px'
        },
        fontWeights: {
            normal: 400,
            medium: 500,
            bold: 600
        }
    };
    spacing = {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '36px'
    };
}
exports.OceanTheme = OceanTheme;
