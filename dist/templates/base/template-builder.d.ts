import { ITemplateConfig } from '../../core/interfaces/template.interface';
import { ITheme } from '../themes/theme.interface';
export declare class TemplateBuilder {
    private template;
    private theme;
    private config;
    private variant;
    constructor(theme: ITheme, config: ITemplateConfig, variant: 'light' | 'dark');
    private get emailStyles();
    buildPreheader(): this;
    buildHeader(content?: string): this;
    private buildLogo;
    buildBody(content: string): this;
    private formatCorporateContent;
    private formatMinimalContent;
    private highlightCode;
    private applySyntaxHighlighting;
    buildButton(text: string, url: string, variant?: 'primary' | 'secondary' | 'success' | 'danger'): this;
    buildFooter(): this;
    private buildFooterLinks;
    private buildSocialLinks;
    private getSocialIcon;
    build(): string;
}
//# sourceMappingURL=template-builder.d.ts.map