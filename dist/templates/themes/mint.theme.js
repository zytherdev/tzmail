"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class MintTheme {
    id = theme_enum_1.ThemeType.MINT;
    name = 'Mint';
    light = { primary: '#047857', secondary: '#0f766e', background: '#f4fffb', text: '#064e3b', textMuted: '#4b7c6f', border: '#a7f3d0', success: '#166534', error: '#b91c1c', warning: '#a16207' };
    dark = { primary: '#6ee7b7', secondary: '#5eead4', background: '#0c1f1a', text: '#ecfdf5', textMuted: '#a7f3d0', border: '#065f46', success: '#86efac', error: '#fca5a5', warning: '#fde68a' };
    typography = { fontFamily: 'Arial, Helvetica, sans-serif', fontSizes: { small: '12px', medium: '14px', large: '17px', xlarge: '22px' }, fontWeights: { normal: 400, medium: 500, bold: 700 } };
    spacing = { xs: '5px', sm: '10px', md: '18px', lg: '25px', xl: '34px' };
    emailStyles = { maxWidthPx: 580, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '20px', boxShadow: 'none' }, header: { accentColor: 'primary', accentWidth: '2px', horizontalPadding: '24px', logoColor: 'primary', logoLetterSpacing: '0.04em', imageBorderRadius: '16px' }, body: { accentColor: 'primary', accentWidth: '1px', borderRadius: '12px', boxShadow: 'none', horizontalPadding: '24px', lineHeight: 1.55 }, button: { appearance: 'solid', borderRadius: '999px', borderWidth: '0px', boxShadow: 'none' }, footer: { accentColor: 'border', accentWidth: '1px' } };
}
exports.MintTheme = MintTheme;
