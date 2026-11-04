"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MidnightTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class MidnightTheme {
    id = theme_enum_1.ThemeType.MIDNIGHT;
    name = 'Midnight';
    light = {
        primary: '#72551F',
        secondary: '#655B49',
        background: '#FFFCF5',
        text: '#20232B',
        textMuted: '#5B5D62',
        border: '#D9D2C4',
        success: '#286447',
        error: '#A33138',
        warning: '#795000'
    };
    dark = {
        primary: '#E6C982',
        secondary: '#C7B991',
        background: '#11151D',
        text: '#F5F1E8',
        textMuted: '#C2BEAF',
        border: '#3A3B3B',
        success: '#82C99C',
        error: '#F08A8D',
        warning: '#F0C66A'
    };
    typography = {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSizes: {
            small: '14px',
            medium: '16px',
            large: '19px',
            xlarge: '28px'
        },
        fontWeights: {
            normal: 400,
            medium: 500,
            bold: 700
        }
    };
    spacing = {
        xs: '4px',
        sm: '10px',
        md: '18px',
        lg: '28px',
        xl: '44px'
    };
}
exports.MidnightTheme = MidnightTheme;
