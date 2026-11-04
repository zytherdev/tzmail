"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForestTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class ForestTheme {
    id = theme_enum_1.ThemeType.FOREST;
    name = 'Forest';
    light = {
        primary: '#315A3D',
        secondary: '#657B5D',
        background: '#F7F5EC',
        text: '#26362B',
        textMuted: '#58665A',
        border: '#D9DFD2',
        success: '#356B48',
        error: '#A34037',
        warning: '#805713'
    };
    dark = {
        primary: '#A9C69A',
        secondary: '#B4C2A8',
        background: '#18231C',
        text: '#F1F2E9',
        textMuted: '#B7C2B5',
        border: '#3A4A3D',
        success: '#9BC99E',
        error: '#F0A39A',
        warning: '#E5C078'
    };
    typography = {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSizes: {
            small: '14px',
            medium: '16px',
            large: '18px',
            xlarge: '26px'
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
}
exports.ForestTheme = ForestTheme;
