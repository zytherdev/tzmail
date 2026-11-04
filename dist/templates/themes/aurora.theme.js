"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuroraTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class AuroraTheme {
    id = theme_enum_1.ThemeType.AURORA;
    name = 'Aurora';
    light = {
        primary: '#06727D',
        secondary: '#6750A4',
        background: '#F3F8FA',
        text: '#112B3A',
        textMuted: '#536B78',
        border: '#CBD9DF',
        success: '#18794E',
        error: '#B42332',
        warning: '#8A5A00'
    };
    dark = {
        primary: '#5ADBC7',
        secondary: '#B9A5FF',
        background: '#0B1624',
        text: '#EDF5F8',
        textMuted: '#B0C0CA',
        border: '#334454',
        success: '#69D5A0',
        error: '#FF8A8A',
        warning: '#FFD166'
    };
    typography = {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
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
exports.AuroraTheme = AuroraTheme;
