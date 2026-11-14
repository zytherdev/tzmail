"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoirTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class NoirTheme {
    id = theme_enum_1.ThemeType.NOIR;
    name = 'Noir';
    light = { primary: '#262626', secondary: '#737373', background: '#fafafa', text: '#171717', textMuted: '#525252', border: '#d4d4d4', success: '#166534', error: '#b91c1c', warning: '#a16207' };
    dark = { primary: '#f5f5f5', secondary: '#a3a3a3', background: '#0a0a0a', text: '#fafafa', textMuted: '#d4d4d4', border: '#404040', success: '#86efac', error: '#fca5a5', warning: '#fde68a' };
    typography = { fontFamily: 'Arial, Helvetica, sans-serif', fontSizes: { small: '11px', medium: '13px', large: '16px', xlarge: '21px' }, fontWeights: { normal: 400, medium: 500, bold: 700 } };
    spacing = { xs: '4px', sm: '8px', md: '16px', lg: '22px', xl: '30px' };
    emailStyles = { maxWidthPx: 560, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '0px', boxShadow: 'none' }, header: { accentColor: 'primary', accentWidth: '1px', horizontalPadding: '22px', logoColor: 'text', logoTextTransform: 'uppercase', logoLetterSpacing: '0.14em', imageBorderRadius: '0px' }, body: { accentColor: 'primary', accentWidth: '1px', borderRadius: '0px', boxShadow: 'none', horizontalPadding: '22px', lineHeight: 1.5 }, button: { appearance: 'solid', borderRadius: '0px', borderWidth: '0px', boxShadow: 'none', textTransform: 'uppercase', letterSpacing: '0.08em' }, footer: { accentColor: 'border', accentWidth: '1px' } };
}
exports.NoirTheme = NoirTheme;
