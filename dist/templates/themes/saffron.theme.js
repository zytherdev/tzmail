"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaffronTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class SaffronTheme {
    id = theme_enum_1.ThemeType.SAFFRON;
    name = 'Saffron';
    light = { primary: '#c2410c', secondary: '#ca8a04', background: '#fffaf0', text: '#3f1d0b', textMuted: '#92400e', border: '#fed7aa', success: '#166534', error: '#b91c1c', warning: '#a16207' };
    dark = { primary: '#fb923c', secondary: '#facc15', background: '#21140d', text: '#fff7ed', textMuted: '#fed7aa', border: '#7c2d12', success: '#86efac', error: '#fca5a5', warning: '#fde68a' };
    typography = { fontFamily: 'Arial, Helvetica, sans-serif', fontSizes: { small: '12px', medium: '14px', large: '17px', xlarge: '22px' }, fontWeights: { normal: 400, medium: 500, bold: 700 } };
    spacing = { xs: '5px', sm: '10px', md: '18px', lg: '26px', xl: '36px' };
    emailStyles = { maxWidthPx: 600, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '9px', boxShadow: 'none' }, header: { accentColor: 'primary', accentWidth: '2px', horizontalPadding: '24px', logoColor: 'primary', logoLetterSpacing: '0.03em', imageBorderRadius: '8px' }, body: { accentColor: 'primary', accentWidth: '2px', borderRadius: '8px', boxShadow: 'none', horizontalPadding: '24px', lineHeight: 1.55 }, button: { appearance: 'solid', borderRadius: '6px', borderWidth: '0px', boxShadow: 'none' }, footer: { accentColor: 'border', accentWidth: '1px' } };
}
exports.SaffronTheme = SaffronTheme;
