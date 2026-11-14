"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlpineTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class AlpineTheme {
    id = theme_enum_1.ThemeType.ALPINE;
    name = 'Alpine';
    light = { primary: '#166534', secondary: '#15803d', background: '#f7fcf8', text: '#17251b', textMuted: '#58705e', border: '#bbd8c0', success: '#166534', error: '#b91c1c', warning: '#a16207' };
    dark = { primary: '#86efac', secondary: '#4ade80', background: '#102018', text: '#f0fdf4', textMuted: '#bbd8c0', border: '#285437', success: '#86efac', error: '#fca5a5', warning: '#fde68a' };
    typography = { fontFamily: 'Arial, Helvetica, sans-serif', fontSizes: { small: '13px', medium: '15px', large: '18px', xlarge: '25px' }, fontWeights: { normal: 400, medium: 500, bold: 700 } };
    spacing = { xs: '6px', sm: '12px', md: '20px', lg: '30px', xl: '46px' };
    emailStyles = { maxWidthPx: 600, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '20px', boxShadow: 'none' }, header: { accentColor: 'secondary', accentWidth: '2px', horizontalPadding: '28px', logoColor: 'primary', logoLetterSpacing: '0.03em', imageBorderRadius: '12px' }, body: { accentColor: 'none', accentWidth: '0px', borderRadius: '12px', boxShadow: 'none', horizontalPadding: '28px', lineHeight: 1.6 }, button: { appearance: 'solid', borderRadius: '999px', borderWidth: '0px', boxShadow: 'none' }, footer: { accentColor: 'border', accentWidth: '1px' } };
}
exports.AlpineTheme = AlpineTheme;
