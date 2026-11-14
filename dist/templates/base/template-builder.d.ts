import { ITemplateConfig } from '../../core/interfaces/template.interface';
import { ITheme } from '../themes/theme.interface';
/** Email-safe structure is composed from the theme, never from a fixed theme-id layout map. */
export declare class TemplateBuilder {
    private theme;
    private config;
    private variant;
    private preheader;
    private header;
    private footer;
    private content;
    private button;
    constructor(theme: ITheme, config: ITemplateConfig, variant: 'light' | 'dark');
    private get design();
    buildPreheader(): this;
    buildHeader(content?: string): this;
    buildMessage(title: string, message: string, fontSize: number): this;
    /** Explicitly trusted HTML still receives the theme's outer composition, not rewritten headings. */
    buildBody(content: string): this;
    private highlightCode;
    private applySyntaxHighlighting;
    buildButton(text: string, url: string, variant?: 'primary' | 'secondary' | 'success' | 'danger'): this;
    buildFooter(): this;
    build(): string;
}
//# sourceMappingURL=template-builder.d.ts.map