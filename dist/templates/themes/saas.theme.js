"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaaSTheme = void 0;
const theme_enum_1 = require("../../core/enums/theme.enum");
class SaaSTheme {
    id = theme_enum_1.ThemeType.SAAS;
    name = 'SaaS';
    light = { primary: '#4f46e5', secondary: '#6366f1', background: '#ffffff', text: '#172033', textMuted: '#64748b', border: '#e2e8f0', success: '#059669', error: '#dc2626', warning: '#d97706' };
    dark = { primary: '#a5b4fc', secondary: '#818cf8', background: '#171827', text: '#f8fafc', textMuted: '#cbd5e1', border: '#34364f', success: '#34d399', error: '#fca5a5', warning: '#fbbf24' };
    typography = { fontFamily: 'Arial, Helvetica, sans-serif', fontSizes: { small: '13px', medium: '15px', large: '18px', xlarge: '25px' }, fontWeights: { normal: 400, medium: 600, bold: 700 } };
    spacing = { xs: '6px', sm: '12px', md: '20px', lg: '30px', xl: '44px' };
    emailStyles = { maxWidthPx: 600, container: { borderColor: 'border', borderWidth: '1px', borderRadius: '12px', boxShadow: 'none' }, header: { accentColor: 'primary', accentWidth: '4px', horizontalPadding: '28px', logoColor: 'primary', logoLetterSpacing: '0.01em', imageBorderRadius: '8px' }, body: { accentColor: 'none', accentWidth: '0px', borderRadius: '0px', boxShadow: 'none', horizontalPadding: '28px', lineHeight: 1.6 }, button: { appearance: 'solid', borderRadius: '7px', borderWidth: '0px', boxShadow: 'none', textTransform: 'none' }, footer: { accentColor: 'border', accentWidth: '1px' } };
}
exports.SaaSTheme = SaaSTheme;
