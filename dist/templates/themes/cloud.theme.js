"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class CloudTheme {
    id = theme_enum_1.ThemeType.CLOUD;
    name = 'Cloud';
    light = { primary: '#2563eb', secondary: '#64748b', background: '#f8fbff', text: '#172554', textMuted: '#64748b', border: '#dbeafe', success: '#166534', error: '#b91c1c', warning: '#a16207' };
    dark = { primary: '#93c5fd', secondary: '#cbd5e1', background: '#111827', text: '#eff6ff', textMuted: '#cbd5e1', border: '#1e3a8a', success: '#86efac', error: '#fca5a5', warning: '#fde68a' };
    typography = { fontFamily: 'Arial, Helvetica, sans-serif', fontSizes: { small: '12px', medium: '14px', large: '17px', xlarge: '22px' }, fontWeights: { normal: 400, medium: 500, bold: 700 } };
    spacing = { xs: '5px', sm: '10px', md: '18px', lg: '25px', xl: '34px' };
    emailStyles = { maxWidthPx: 600, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '14px', boxShadow: 'none' }, header: { accentColor: 'primary', accentWidth: '1px', horizontalPadding: '24px', logoColor: 'primary', imageBorderRadius: '10px' }, body: { accentColor: 'none', accentWidth: '0px', borderRadius: '10px', boxShadow: 'none', horizontalPadding: '24px', lineHeight: 1.55 }, button: { appearance: 'solid', borderRadius: '6px', borderWidth: '0px', boxShadow: 'none' }, footer: { accentColor: 'border', accentWidth: '1px' } };
}
exports.CloudTheme = CloudTheme;
