"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonokaiTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class MonokaiTheme {
    id = theme_enum_1.ThemeType.MONOKAI;
    name = 'Monokai';
    light = {
        primary: '#f92672',
        secondary: '#a6e22e',
        background: '#f9f9f9',
        text: '#272822',
        textMuted: '#75715e',
        border: '#e5e5e5',
        success: '#a6e22e',
        error: '#f92672',
        warning: '#fd971f'
    };
    dark = {
        primary: '#f92672',
        secondary: '#a6e22e',
        background: '#272822',
        text: '#f8f8f2',
        textMuted: '#75715e',
        border: '#3e3d32',
        success: '#a6e22e',
        error: '#f92672',
        warning: '#fd971f'
    };
    typography = {
        fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
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
    // cores adicionais
    codeHighlight = {
        comment: '#75715e',
        keyword: '#f92672',
        string: '#e6db74',
        number: '#ae81ff',
        function: '#a6e22e',
        variable: '#fd971f'
    };
    borderStyle = {
        radius: '4px',
        width: '2px',
        style: 'solid'
    };
    effects = {
        glow: '0 0 10px rgba(249, 38, 114, 0.3)',
        shadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease'
    };
}
exports.MonokaiTheme = MonokaiTheme;
