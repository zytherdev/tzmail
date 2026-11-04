import { ITemplate, ITemplateConfig } from '../core/interfaces/template.interface';
import { ThemeType } from '../core/enums/theme.enum';
interface TemplateCache {
    template: ITemplate;
    createdAt: Date;
    expiresAt: Date;
    hits: number;
}
export interface ITemplateServiceOptions {
    /** Cache ligado por padrão; pode ser desligado por chamada. */
    cache?: boolean;
    /** TTL em segundos. Zero desabilita o cache para aquela criação; valores negativos/não finitos são inválidos. */
    cacheTTL?: number;
    validateConfig?: boolean;
    /** Mantido por compatibilidade. A transformação destrutiva foi desativada. */
    minify?: boolean;
    preview?: boolean;
    /** Limite de templates em cache; padrão finito de 100. */
    maxCacheEntries?: number;
    /** Limite de IDs de template guardados no histórico; padrão finito de 100. */
    maxHistoryEntries?: number;
    /** Máximo de versões por ID de template; padrão 10. */
    maxVersionsPerTemplate?: number;
}
type TemplateOptions = ITemplateServiceOptions;
/**
 * TemplateService - criação, renderização e gestão de templates de email.
 * Cache e histórico mantêm limites finitos e retornam snapshots defensivos.
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
    /** Encerrar o timer de limpeza quando a instância não for mais necessária. */
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