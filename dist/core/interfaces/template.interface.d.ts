import { ThemeType } from "../enums/theme.enum";
export interface ITemplate {
    name: string;
    theme: ThemeType;
    variant: 'light' | 'dark';
    config: ITemplateConfig;
    render(data: any): Promise<string>;
}
export interface ITemplateConfig {
    /** BCP 47 language tag written to the generated document; defaults to en. */
    language?: string;
    /** Text direction for right-to-left or automatic-script content; defaults to ltr. */
    direction?: 'ltr' | 'rtl' | 'auto';
    /** Hidden inbox preview text shown beside the subject; limited to 500 characters. */
    preheader?: string;
    /** Decoration for generated footer links; defaults to none. Set to underline when desired. */
    linkDecoration?: 'none' | 'underline';
    header?: IHeaderConfig;
    body?: IBodyConfig;
    footer?: IFooterConfig;
    layout?: 'full' | 'minimal';
    spacing?: 'compact' | 'normal' | 'relaxed';
    borderRadius?: 'none' | 'small' | 'medium' | 'large';
}
export interface IBodyConfig {
    title?: string;
    message?: string;
    /** Intentionally trusted HTML; other textual fields are escaped by the renderer. */
    content?: string;
    /** Explicit alias for content when callers prefer to name the field html. */
    html?: string;
    buttonText?: string;
    buttonUrl?: string;
    buttonVariant?: 'primary' | 'secondary' | 'success' | 'danger';
    alignment?: 'left' | 'center' | 'right';
    /** CTA alignment; when omitted, follows body.alignment. */
    buttonAlignment?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    textColor?: string;
    fontSize?: number;
}
export interface IHeaderConfig {
    show: boolean;
    logo?: {
        type: 'text' | 'image';
        text?: string;
        imageUrl?: string;
        alt?: string;
        size?: 'small' | 'medium' | 'large';
    };
    /** Optional full-width header image rendered above the logo/content. */
    heroImageUrl?: string;
    heroAlt?: string;
    backgroundColor?: string;
    textColor?: string;
}
export interface IFooterConfig {
    show: boolean;
    links?: Array<{
        text: string;
        url: string;
    }>;
    socialLinks?: Array<{
        platform: 'facebook' | 'twitter' | 'linkedin' | 'github' | 'instagram' | 'youtube' | 'tiktok' | 'pinterest' | 'reddit' | 'gitlab' | 'stackoverflow' | 'medium' | 'dribbble' | 'behance' | 'telegram';
        url: string;
    }>;
    copyrightText?: string;
    unsubscribeText?: string;
    /** Optional unsubscribe URL; without it, the text is rendered without a fake href. */
    unsubscribeUrl?: string;
    backgroundColor?: string;
    textColor?: string;
}
//# sourceMappingURL=template.interface.d.ts.map