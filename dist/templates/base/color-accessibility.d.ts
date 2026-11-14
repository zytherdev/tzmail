/** Resolve CSS colors to an opaque, measurable surface before emitting email section backgrounds. */
export declare function normalizeCssColor(color: string, underneath?: string): string | undefined;
export declare function contrastRatio(foreground: string, background: string): number;
export declare function accessibleTextColor(background: string): '#000000' | '#ffffff';
export declare function readableTextColor(preferred: string, background: string, fallback?: string): string;
//# sourceMappingURL=color-accessibility.d.ts.map