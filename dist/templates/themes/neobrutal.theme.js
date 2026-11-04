"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeoBrutalTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class NeoBrutalTheme {
    id = theme_enum_1.ThemeType.NEOBRUTAL;
    name = 'Neo Brutal';
    light = {
        primary: '#1745C6',
        secondary: '#FFD400',
        background: '#FFFFFF',
        text: '#111111',
        textMuted: '#505050',
        border: '#767676',
        success: '#146C2E',
        error: '#B42318',
        warning: '#805B00'
    };
    dark = {
        primary: '#FFD400',
        secondary: '#4F7DFF',
        background: '#111111',
        text: '#FAFAFA',
        textMuted: '#C4C4C4',
        border: '#777777',
        success: '#75D99A',
        error: '#FF8B82',
        warning: '#FFD166'
    };
    typography = {
        fontFamily: 'Arial, Helvetica, "Liberation Sans", sans-serif',
        fontSizes: {
            small: '14px',
            medium: '16px',
            large: '20px',
            xlarge: '28px'
        },
        fontWeights: {
            normal: 400,
            medium: 600,
            bold: 800
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
exports.NeoBrutalTheme = NeoBrutalTheme;
