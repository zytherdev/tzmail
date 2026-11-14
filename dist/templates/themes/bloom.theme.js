"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloomTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class BloomTheme {
    id = theme_enum_1.ThemeType.BLOOM;
    name = 'Bloom';
    light = { primary: '#be185d', secondary: '#db2777', background: '#fffafd', text: '#351b2b', textMuted: '#80556d', border: '#fbcfe8', success: '#047857', error: '#be123c', warning: '#a16207' };
    dark = { primary: '#f9a8d4', secondary: '#f472b6', background: '#241521', text: '#fff1f7', textMuted: '#f5c2dc', border: '#701a45', success: '#6ee7b7', error: '#fda4af', warning: '#fde68a' };
    typography = { fontFamily: 'Arial, Helvetica, sans-serif', fontSizes: { small: '12px', medium: '14px', large: '17px', xlarge: '22px' }, fontWeights: { normal: 400, medium: 500, bold: 700 } };
    spacing = { xs: '5px', sm: '10px', md: '18px', lg: '26px', xl: '38px' };
    emailStyles = { maxWidthPx: 580, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '14px', boxShadow: 'none' }, header: { accentColor: 'primary', accentWidth: '1px', horizontalPadding: '24px', logoColor: 'primary', logoLetterSpacing: '0.02em', imageBorderRadius: '14px' }, body: { accentColor: 'primary', accentWidth: '1px', borderRadius: '8px', boxShadow: 'none', horizontalPadding: '24px', lineHeight: 1.55 }, button: { appearance: 'solid', borderRadius: '999px', borderWidth: '0px', boxShadow: 'none' }, footer: { accentColor: 'border', accentWidth: '1px' } };
}
exports.BloomTheme = BloomTheme;
