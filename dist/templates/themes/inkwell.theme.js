"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InkwellTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class InkwellTheme {
    id = theme_enum_1.ThemeType.INKWELL;
    name = 'Inkwell';
    light = { primary: '#18181b', secondary: '#52525b', background: '#fafafa', text: '#27272a', textMuted: '#71717a', border: '#d4d4d8', success: '#166534', error: '#b91c1c', warning: '#a16207' };
    dark = { primary: '#fafafa', secondary: '#d4d4d8', background: '#18181b', text: '#fafafa', textMuted: '#d4d4d8', border: '#52525b', success: '#86efac', error: '#fca5a5', warning: '#fde68a' };
    typography = { fontFamily: 'Georgia, Times New Roman, serif', fontSizes: { small: '12px', medium: '15px', large: '18px', xlarge: '23px' }, fontWeights: { normal: 400, medium: 500, bold: 700 } };
    spacing = { xs: '4px', sm: '9px', md: '17px', lg: '25px', xl: '36px' };
    emailStyles = { maxWidthPx: 580, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '0px', boxShadow: 'none' }, header: { accentColor: 'primary', accentWidth: '3px', horizontalPadding: '26px', logoColor: 'text', logoLetterSpacing: '0.02em', imageBorderRadius: '0px' }, body: { accentColor: 'primary', accentWidth: '2px', borderRadius: '0px', boxShadow: 'none', horizontalPadding: '26px', lineHeight: 1.7 }, button: { appearance: 'solid', borderRadius: '0px', borderWidth: '0px', boxShadow: 'none' }, footer: { accentColor: 'primary', accentWidth: '2px' } };
}
exports.InkwellTheme = InkwellTheme;
