"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TideTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class TideTheme {
    id = theme_enum_1.ThemeType.TIDE;
    name = 'Tide';
    light = { primary: '#0f766e', secondary: '#0e7490', background: '#f0fdfa', text: '#134e4a', textMuted: '#4b7c78', border: '#99f6e4', success: '#166534', error: '#b91c1c', warning: '#a16207' };
    dark = { primary: '#5eead4', secondary: '#67e8f9', background: '#0b2020', text: '#ecfeff', textMuted: '#99f6e4', border: '#115e59', success: '#86efac', error: '#fca5a5', warning: '#fde68a' };
    typography = { fontFamily: 'Arial, Helvetica, sans-serif', fontSizes: { small: '12px', medium: '14px', large: '17px', xlarge: '22px' }, fontWeights: { normal: 400, medium: 500, bold: 700 } };
    spacing = { xs: '5px', sm: '10px', md: '18px', lg: '26px', xl: '36px' };
    emailStyles = { maxWidthPx: 600, container: { borderColor: 'border', borderWidth: '0px', borderRadius: '16px', boxShadow: 'none' }, header: { accentColor: 'primary', accentWidth: '2px', horizontalPadding: '24px', logoColor: 'primary', logoLetterSpacing: '0.04em', imageBorderRadius: '12px' }, body: { accentColor: 'none', accentWidth: '0px', borderRadius: '0px', boxShadow: 'none', horizontalPadding: '24px', lineHeight: 1.6 }, button: { appearance: 'solid', borderRadius: '999px', borderWidth: '0px', boxShadow: 'none' }, footer: { accentColor: 'border', accentWidth: '1px' } };
}
exports.TideTheme = TideTheme;
