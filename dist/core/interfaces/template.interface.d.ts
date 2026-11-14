import { ThemeType } from "../enums/theme.enum";
import type { SocialPlatform } from '../social-platforms';
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
    /** CTA alignment; when omitted, follows body.alignment or the theme's default. */
    buttonAlignment?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    textColor?: string;
    fontSize?: number;
}
export interface IHeaderConfig {
    show: boolean;
    /** Overrides the theme's header alignment. */
    alignment?: 'left' | 'center' | 'right';
    logo?: {
        type: 'text' | 'image';
        text?: string;
        imageUrl?: string;
        alt?: string;
        size?: 'small' | 'medium' | 'large';
    };
    /** Optional image; never required for a theme's visual identity. */
    heroImageUrl?: string;
    heroAlt?: string;
    backgroundColor?: string;
    textColor?: string;
}
export interface IFooterConfig {
    show: boolean;
    /** Overrides the theme's footer alignment. */
    alignment?: 'left' | 'center' | 'right';
    links?: Array<{
        text: string;
        url: string;
    }>;
    socialLinks?: Array<{
        platform: SocialPlatform;
        url: string;
    }>;
    /** Social footer links show only the icon by default; choose icon-and-name to include a visible label. */
    socialLinkDisplay?: 'icon' | 'icon-and-name';
    copyrightText?: string;
    unsubscribeText?: string;
    /** Optional unsubscribe URL; without it, the text is rendered without a fake href. */
    unsubscribeUrl?: string;
    backgroundColor?: string;
    textColor?: string;
}
//# sourceMappingURL=template.interface.d.ts.map