import { ThemeType } from "../enums/theme.enum";

export interface ITemplate {
  name: string;
  theme: ThemeType;
  variant: 'light' | 'dark';
  config: ITemplateConfig;
  render(data: any): Promise<string>;
}

export interface ITemplateConfig {
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
  /** HTML intencionalmente confiável; os demais campos textuais são escapados pelo renderer. */
  content?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonVariant?: 'primary' | 'secondary' | 'success' | 'danger';
  alignment?: 'left' | 'center' | 'right';
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
  /** URL opcional do link de cancelamento; sem ela, o texto é exibido sem href fictício. */
  unsubscribeUrl?: string;
  backgroundColor?: string;
  textColor?: string;
}
