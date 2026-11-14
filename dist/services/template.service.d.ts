import { ITemplate, ITemplateConfig } from '../core/interfaces/template.interface';
import { ThemeType } from '../core/enums/theme.enum';
interface TemplateCache {
    template: ITemplate;
    createdAt: Date;
    expiresAt: Date;
    hits: number;
}
export interface ITemplateServiceOptions {
    /** Cache enabled by default; can be disabled per call. */
    cache?: boolean;
    /** TTL in seconds. Zero disables storage for that creation; negative/non-finite values are invalid. */
    cacheTTL?: number;
    validateConfig?: boolean;
    /** Retained for compatibility. The destructive transformation has been disabled. */
    minify?: boolean;
    preview?: boolean;
    /** Limit on cached templates; finite default of 100. */
    maxCacheEntries?: number;
    /** Limit on template IDs retained in history; finite default of 100. */
    maxHistoryEntries?: number;
    /** Maximum versions per template ID; default 10. */
    maxVersionsPerTemplate?: number;
}
type TemplateOptions = ITemplateServiceOptions;
/**
 * TemplateService - creation, rendering, and management of email templates.
 * Cache and history use finite limits and return defensive snapshots.
 */
export declare class TemplateService {
    private templateCache;
    private templateHistory;
    private cacheRequests;
    private cacheHits;
    private readonly options;
    private cleanupTimer;
    constructor(options?: TemplateOptions);
    createTemplate(themeType: ThemeType, variant: 'light' | 'dark', config: ITemplateConfig, options?: TemplateOptions): ITemplate;
    cloneTemplate(template: ITemplate, modifications?: Partial<ITemplateConfig>): ITemplate;
    renderTemplate(template: ITemplate, data: any, options?: {
        preview?: boolean;
    }): Promise<string>;
    previewTemplate(themeType: ThemeType, variant: 'light' | 'dark', config: ITemplateConfig, data: any): Promise<string>;
    getThemeInfo(themeType: ThemeType): {
        name: string;
        description: string;
        features: string[];
        availableVariants: ('light' | 'dark')[];
        defaultConfig: Partial<ITemplateConfig>;
    };
    listThemes(): ThemeType[];
    getTemplateStats(): {
        totalTemplates: number;
        cachedTemplates: number;
        totalHits: number;
        cacheRequests: number;
        templatesByTheme: Record<ThemeType, number>;
        cacheHitRate: number;
    };
    clearCache(themeType?: ThemeType): number;
    getTemplateHistory(templateId: string): ITemplate[];
    restoreTemplateVersion(templateId: string, versionIndex: number): ITemplate | null;
    /** Stop the cleanup timer when the instance is no longer needed. */
    dispose(): void;
    private validateTemplateConfig;
    private assertThemeAndVariant;
    private generateTemplateId;
    private enhanceTemplate;
    private copyTemplate;
    private addToHistory;
    private trimCache;
    private cleanExpiredCache;
    private minifyHtml;
    private validateLimit;
    private getDefaultConfigForTheme;
    preloadTemplates(templates: Array<{
        themeType: ThemeType;
        variant: 'light' | 'dark';
        config: ITemplateConfig;
    }>): Promise<void>;
    exportTemplate(template: ITemplate): string;
    importTemplate(jsonData: string): ITemplate;
    generateExampleTemplate(themeType?: ThemeType, variant?: 'light' | 'dark'): ITemplate;
    isValidTemplate(template: any): boolean;
    getTemplateDetails(templateId: string): {
        template: ITemplate | null;
        history: ITemplate[];
        cacheInfo: TemplateCache | null;
        usageCount: number;
    };
}
export {};
//# sourceMappingURL=template.service.d.ts.map