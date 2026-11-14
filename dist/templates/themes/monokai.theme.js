"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonokaiTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
const theme_designs_1 = require("./theme-designs");
class MonokaiTheme {
    id = theme_enum_1.ThemeType.MONOKAI;
    composition = (0, theme_designs_1.getThemeComposition)(this.id);
    name = 'Monokai';
    light = {
        primary: '#AE1B57',
        secondary: '#516B12',
        background: '#F3F5E8',
        text: '#24291B',
        textMuted: '#555C42',
        border: '#B5BE9A',
        success: '#28613B',
        error: '#A33B34',
        warning: '#7D5D0E'
    };
    dark = {
        primary: '#FF79AB',
        secondary: '#C5F36C',
        background: '#22271B',
        text: '#F1F8E0',
        textMuted: '#C3CEAB',
        border: '#465035',
        success: '#97DDB2',
        error: '#F5ACA2',
        warning: '#EDCE8A'
    };
    typography = {
        fontFamily: '"Courier New", Courier, monospace',
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
    emailStyles = {
        maxWidthPx: 620,
        container: {
            borderColor: 'primary',
            borderWidth: '1px',
            borderRadius: '0px',
            boxShadow: 'none'
        },
        header: {
            accentColor: 'secondary',
            accentWidth: '3px',
            horizontalPadding: '32px',
            logoColor: 'text',
            logoFontFamily: '"Courier New", Courier, monospace',
            logoTextTransform: 'uppercase',
            logoLetterSpacing: '0.06em',
            imageBorderRadius: '0px'
        },
        body: {
            accentColor: 'primary',
            accentWidth: '1px',
            borderRadius: '0px',
            boxShadow: 'none',
            horizontalPadding: '32px',
            lineHeight: 1.65
        },
        button: {
            appearance: 'solid',
            borderRadius: '0px',
            borderWidth: '0px',
            boxShadow: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
        },
        footer: {
            accentColor: 'border',
            accentWidth: '1px'
        }
    };
}
exports.MonokaiTheme = MonokaiTheme;
