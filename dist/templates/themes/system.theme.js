"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class SystemTheme {
    id = theme_enum_1.ThemeType.SYSTEM;
    name = 'System';
    light = {
        primary: '#3b82f6',
        secondary: '#6b7280',
        background: '#ffffff',
        text: '#111827',
        textMuted: '#6b7280',
        border: '#e5e7eb',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
    };
    dark = {
        primary: '#3b82f6',
        secondary: '#9ca3af',
        background: '#111827',
        text: '#f9fafb',
        textMuted: '#9ca3af',
        border: '#374151',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
    };
    typography = {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSizes: {
            small: '12px',
            medium: '14px',
            large: '16px',
            xlarge: '20px'
        },
        fontWeights: {
            normal: 400,
            medium: 500,
            bold: 700
        }
    };
    spacing = {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px'
    };
}
exports.SystemTheme = SystemTheme;
