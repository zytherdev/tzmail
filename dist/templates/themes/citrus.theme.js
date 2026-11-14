"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitrusTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class CitrusTheme {
    id = theme_enum_1.ThemeType.CITRUS;
    name = 'Citrus';
    light = { primary: '#c2410c', secondary: '#ea580c', background: '#fffaf5', text: '#2b2118', textMuted: '#6b5b4d', border: '#fed7aa', success: '#15803d', error: '#b91c1c', warning: '#a16207' };
    dark = { primary: '#fdba74', secondary: '#fb923c', background: '#261914', text: '#fff7ed', textMuted: '#fed7aa', border: '#713f12', success: '#86efac', error: '#fca5a5', warning: '#fde68a' };
    typography = { fontFamily: 'Georgia, Times New Roman, serif', fontSizes: { small: '13px', medium: '16px', large: '19px', xlarge: '27px' }, fontWeights: { normal: 400, medium: 600, bold: 700 } };
    spacing = { xs: '6px', sm: '12px', md: '20px', lg: '30px', xl: '46px' };
    emailStyles = { maxWidthPx: 600, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '6px', boxShadow: 'none' }, header: { accentColor: 'primary', accentWidth: '3px', horizontalPadding: '28px', logoColor: 'primary', logoTextTransform: 'uppercase', logoLetterSpacing: '0.08em', imageBorderRadius: '4px' }, body: { accentColor: 'none', accentWidth: '0px', borderRadius: '0px', boxShadow: 'none', horizontalPadding: '28px', lineHeight: 1.65 }, button: { appearance: 'solid', borderRadius: '4px', borderWidth: '0px', boxShadow: 'none', textTransform: 'uppercase', letterSpacing: '0.04em' }, footer: { accentColor: 'border', accentWidth: '1px' } };
}
exports.CitrusTheme = CitrusTheme;
