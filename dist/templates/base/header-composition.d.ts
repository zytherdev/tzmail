import type { ITemplateConfig } from '../../core/interfaces/template.interface';
import type { ITheme } from '../themes/theme.interface';
/**
 * Header art direction is structural: caller-provided words/images are the only content.
 * All layout tables are email-safe, with explicit surfaces for dark-mode/client fallbacks.
 */
export declare function renderThemeHeader(theme: ITheme, config: ITemplateConfig, variant: 'light' | 'dark', content?: string): string;
//# sourceMappingURL=header-composition.d.ts.map