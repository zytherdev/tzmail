import { ITemplateConfig } from '../../core/interfaces/template.interface';
import { ITheme } from '../themes/theme.interface';
export type BodyContent = {
    title: string;
    message: string;
    fontSize: number;
} | {
    html: string;
};
export declare function renderThemeBody(theme: ITheme, config: ITemplateConfig, variant: 'light' | 'dark', content: BodyContent, button: string): string;
//# sourceMappingURL=body-composition.d.ts.map