import { ThemeType } from '../../core/enums/theme.enum';
import { DEFAULT_COMPOSITION } from './theme-composition';
import type { IThemeComposition } from './theme-composition';

// Email-safe font pairings: serif and monospace display faces use sans-serif copy.
const SANS = 'Arial, Helvetica, sans-serif';
const SERIF = 'Georgia, "Times New Roman", Times, serif';
const MONO = '"Courier New", Courier, monospace';
const DISPLAY = '"Arial Black", Arial, Helvetica, sans-serif';
const HUMANIST = 'Verdana, Geneva, Arial, sans-serif';

type HeaderSpec = [
  layout: IThemeComposition['header']['layout'], alignment: IThemeComposition['header']['alignment'],
  surface: IThemeComposition['header']['surface'], paddingY: number, logoSize: number
];
type BodySpec = [
  layout: IThemeComposition['body']['layout'], alignment: IThemeComposition['body']['alignment'],
  paddingX: number, paddingY: number, titleSize: number, titleFont: string,
  titleWeight: number, titleTracking: string, titleLineHeight: number, measurePx: number
];
type ButtonSpec = [
  style: IThemeComposition['button']['style'], fullWidth: boolean, paddingX: number, paddingY: number
];
type FooterSpec = [
  layout: IThemeComposition['footer']['layout'], alignment: IThemeComposition['footer']['alignment'],
  surface: IThemeComposition['footer']['surface'], paddingY: number
];

/** Small typed notation keeps every design in one readable central gallery. */
function compose(
  name: string, description: string, canvas: [light: string, dark: string],
  header: HeaderSpec, body: BodySpec, button: ButtonSpec, footer: FooterSpec
): IThemeComposition {
  return {
    name, description, canvas: { light: canvas[0], dark: canvas[1] },
    header: { layout: header[0], alignment: header[1], surface: header[2], paddingY: header[3], logoSize: header[4] },
    // Unchanging paper surface guarantees clear display-title contrast in either mode.
    body: { layout: body[0], alignment: body[1], surface: 'background', paddingX: body[2], paddingY: body[3],
      titleSize: body[4], titleFont: body[5], titleWeight: body[6], titleTracking: body[7], titleLineHeight: body[8], measurePx: body[9] },
    button: { style: button[0], fullWidth: button[1], paddingX: button[2], paddingY: button[3] },
    footer: { layout: footer[0], alignment: footer[1], surface: footer[2], paddingY: footer[3] }
  };
}

/** Complete enum coverage; these are structural art directions, not header-image variations. */
const COMPOSITIONS: Record<ThemeType, IThemeComposition> = {
  [ThemeType.SYSTEM]: compose(
    'Swiss utility',
    'A compact utility masthead, indexed body and precise ledger; blue-grey canvas with monospace hierarchy.',
    ['#D5D9DF', '#080D16'],
    ['quiet', 'left', 'background', 24, 22],
    ['index', 'left', 32, 36, 36, MONO, 700, '-0.045em', 1.12, 492],
    ['outline', false, 26, 14], ['ledger', 'left', 'border', 24]
  ),
  [ThemeType.MONOKAI]: compose(
    'Chromatic code journal',
    'An inverse terminal, outlined manuscript and terse colophon; raspberry and acid-lime on mineral paper.',
    ['#E2E7CB', '#10150C'],
    ['terminal', 'left', 'text', 28, 24],
    ['outline', 'left', 32, 40, 34, MONO, 700, '-0.04em', 1.15, 500],
    ['block', true, 28, 18], ['colophon', 'left', 'background', 28]
  ),
  [ThemeType.MODERN]: compose(
    'Metropolitan manifesto',
    'A dark split masthead leads into oversized sans typography and a full-width action above an inverse closing strip.',
    ['#C7CED7', '#070F1A'],
    ['split-band', 'left', 'primary', 36, 30],
    ['manifesto', 'left', 40, 52, 48, DISPLAY, 800, '-0.055em', 1.02, 544],
    ['block', true, 30, 20], ['minimal', 'left', 'text', 32]
  ),
  [ThemeType.CORPORATE]: compose(
    'Institutional folio',
    'A cobalt masthead anchors a two-column folio; classical display serif is paired with disciplined sans-serif copy.',
    ['#CAD8E7', '#071126'],
    ['masthead', 'left', 'primary', 36, 28],
    ['columns', 'left', 36, 40, 40, SERIF, 700, '-0.03em', 1.1, 528],
    ['outline', false, 28, 16], ['columns', 'left', 'background', 32]
  ),
  [ThemeType.MINIMAL]: compose(
    'White-space statement',
    'An unframed black-and-white statement with enormous sans type, quiet edges and an understated editorial action.',
    ['#E8E8E8', '#080808'],
    ['quiet', 'left', 'background', 32, 20],
    ['manifesto', 'left', 44, 56, 48, SANS, 700, '-0.055em', 1.02, 500],
    ['editorial', false, 0, 14], ['minimal', 'left', 'background', 32]
  ),
  [ThemeType.AURORA]: compose(
    'Northern colorfield',
    'A violet split band, centered two-column argument and teal closing band create a cool geometric rhythm.',
    ['#C8E7E2', '#071A1B'],
    ['split-band', 'center', 'secondary', 40, 30],
    ['columns', 'center', 32, 44, 42, SANS, 700, '-0.045em', 1.08, 520],
    ['pill', false, 34, 17], ['band', 'center', 'primary', 36]
  ),
  [ThemeType.OCEAN]: compose(
    'Maritime dispatch',
    'An expansive blue billboard gives way to a left-aligned serif story and a slate-blue footer ledger.',
    ['#BED4E2', '#051724'],
    ['billboard', 'left', 'primary', 52, 36],
    ['story', 'left', 40, 44, 44, SERIF, 700, '-0.035em', 1.08, 516],
    ['block', false, 32, 18], ['ledger', 'left', 'border', 28]
  ),
  [ThemeType.SUNSET]: compose(
    'Terracotta poster',
    'A warm billboard and centered heavy manifesto make the email read like a typographic poster, with an inverse footer.',
    ['#F2C5A4', '#21100A'],
    ['billboard', 'center', 'secondary', 48, 36],
    ['manifesto', 'center', 32, 52, 48, DISPLAY, 800, '-0.045em', 1.02, 520],
    ['offset', false, 34, 18], ['band', 'center', 'text', 36]
  ),
  [ThemeType.LAVENDER]: compose(
    'Literary violet',
    'A small violet label and centered serif letter leave generous margins; a signature closes the literary composition.',
    ['#DED3ED', '#150C24'],
    ['label', 'center', 'background', 32, 22],
    ['letter', 'center', 44, 48, 40, SERIF, 400, '-0.025em', 1.12, 452],
    ['editorial', false, 0, 15], ['signature', 'center', 'border', 36]
  ),
  [ThemeType.FOREST]: compose(
    'Botanical field notes',
    'A restrained monogram, moss-green side rail and serif field-note hierarchy end in a deep-green signature.',
    ['#C9D1B7', '#101908'],
    ['monogram', 'left', 'background', 36, 28],
    ['accent-rail', 'left', 36, 42, 38, SERIF, 700, '-0.025em', 1.12, 472],
    ['outline', false, 28, 16], ['signature', 'left', 'primary', 32]
  ),
  [ThemeType.EDITORIAL]: compose(
    'Red-ink broadsheet',
    'A ruled newspaper masthead, large serif story and ink-black colophon emphasize the warm paper and oxblood accents.',
    ['#D9C8B3', '#19130B'],
    ['ruled', 'left', 'background', 32, 32],
    ['story', 'left', 40, 44, 46, SERIF, 700, '-0.045em', 1.06, 520],
    ['editorial', false, 0, 16], ['colophon', 'left', 'text', 32]
  ),
  [ThemeType.PASTEL]: compose(
    'Rosewater correspondence',
    'A plum monogram and centered classical letter use blush paper without the usual boxed-card treatment.',
    ['#E5D0DB', '#1B0F1B'],
    ['monogram', 'center', 'secondary', 40, 30],
    ['letter', 'center', 40, 48, 38, SERIF, 400, '-0.025em', 1.15, 448],
    ['pill', false, 34, 17], ['minimal', 'center', 'background', 32]
  ),
  [ThemeType.NEOBRUTAL]: compose(
    'Cobalt protest print',
    'An electric-yellow label, oversized heavy manifesto and hard-edged ledger use cobalt rules and an offset square action.',
    ['#FFE05C', '#101108'],
    ['label', 'left', 'secondary', 28, 28],
    ['manifesto', 'left', 32, 44, 48, DISPLAY, 800, '-0.04em', 1.02, 528],
    ['offset', true, 28, 20], ['ledger', 'left', 'text', 28]
  ),
  [ThemeType.GLASS]: compose(
    'Architectural blueprints',
    'Opaque ice-blue surfaces, an inverse split band, framed panel and column footer; transparent effects are deliberately absent.',
    ['#CBDDE2', '#071820'],
    ['split-band', 'left', 'text', 36, 28],
    ['panel', 'left', 36, 44, 40, SANS, 700, '-0.045em', 1.08, 496],
    ['outline', true, 28, 17], ['columns', 'left', 'border', 32]
  ),
  [ThemeType.MIDNIGHT]: compose(
    'Gilded evening letter',
    'An inverse formal masthead and centered serif letter lead to a gold-toned signature; narrow measure feels intimate and luxurious.',
    ['#DDD1AE', '#090F1E'],
    ['masthead', 'center', 'text', 44, 32],
    ['letter', 'center', 44, 52, 44, SERIF, 400, '-0.035em', 1.1, 456],
    ['outline', false, 34, 18], ['signature', 'center', 'primary', 36]
  ),
  [ThemeType.SAAS]: compose(
    'Indigo product brief',
    'An indigo label and crisp panel organize a product brief, with a full-width rounded action and violet closing band.',
    ['#D3D5EE', '#101027'],
    ['label', 'left', 'primary', 28, 24],
    ['panel', 'left', 32, 40, 42, SANS, 700, '-0.05em', 1.08, 508],
    ['block', true, 28, 18], ['band', 'left', 'secondary', 32]
  ),
  [ThemeType.CITRUS]: compose(
    'Orange market gazette',
    'An orange billboard, serif index and column footer turn citrus warmth into a bold market-gazette composition.',
    ['#F2CF86', '#201306'],
    ['billboard', 'left', 'secondary', 44, 34],
    ['index', 'left', 36, 44, 44, SERIF, 700, '-0.03em', 1.1, 504],
    ['offset', false, 30, 18], ['columns', 'left', 'primary', 32]
  ),
  [ThemeType.BERRY]: compose(
    'Burgundy salon',
    'A formal berry masthead frames a centered large-serif story with an oval action and a subdued signature footer.',
    ['#D6B6C6', '#1D0A19'],
    ['masthead', 'center', 'primary', 40, 30],
    ['story', 'center', 40, 48, 44, SERIF, 400, '-0.035em', 1.08, 476],
    ['pill', false, 36, 18], ['signature', 'center', 'border', 36]
  ),
  [ThemeType.PAPER]: compose(
    'Archive correspondence',
    'Fine rules, rag-paper tones and a left-aligned serif letter recreate an archival folio with a modest colophon.',
    ['#D5C4A9', '#1C150B'],
    ['ruled', 'left', 'background', 28, 24],
    ['letter', 'left', 40, 44, 40, SERIF, 400, '-0.02em', 1.15, 460],
    ['editorial', false, 0, 15], ['colophon', 'left', 'background', 28]
  ),
  [ThemeType.NEON]: compose(
    'Signal terminal',
    'A teal terminal opens an oversized monospace manifesto; an offset full-width action and inverse footer amplify the signal.',
    ['#BCDDD3', '#031B15'],
    ['terminal', 'left', 'primary', 36, 28],
    ['manifesto', 'left', 32, 48, 46, MONO, 700, '-0.06em', 1.04, 532],
    ['offset', true, 28, 20], ['band', 'left', 'text', 32]
  ),
  [ThemeType.ALPINE]: compose(
    'Mountain survey',
    'A compact alpine label, green survey rail and neat footer ledger favor clear sans type and sturdy square geometry.',
    ['#D0D9C9', '#0D1C10'],
    ['label', 'left', 'background', 28, 24],
    ['accent-rail', 'left', 32, 40, 36, SANS, 700, '-0.04em', 1.1, 480],
    ['block', false, 28, 17], ['ledger', 'left', 'border', 28]
  ),
  [ThemeType.ORBIT]: compose(
    'Violet orbital study',
    'A centered monogram, geometric outline and violet band create a precise circular identity without decorative imagery.',
    ['#CFC6E9', '#110724'],
    ['monogram', 'center', 'primary', 44, 32],
    ['outline', 'center', 36, 48, 44, SANS, 700, '-0.05em', 1.06, 504],
    ['pill', true, 32, 18], ['band', 'center', 'secondary', 36]
  ),
  [ThemeType.LINEN]: compose(
    'Tailored linen note',
    'A quiet earth-grey mark, narrow serif letter and soft signature use generous unboxed space and measured typography.',
    ['#D9D1C2', '#17140E'],
    ['quiet', 'left', 'background', 36, 22],
    ['letter', 'left', 44, 48, 36, SERIF, 400, '-0.025em', 1.16, 432],
    ['editorial', false, 0, 15], ['signature', 'left', 'border', 36]
  ),
  [ThemeType.BLOOM]: compose(
    'Modern floral folio',
    'A rose monogram and centered serif story contrast with a structured column footer; organic warmth comes from color and proportion.',
    ['#ECD1DC', '#200B1A'],
    ['monogram', 'center', 'secondary', 40, 30],
    ['story', 'center', 36, 48, 42, SERIF, 400, '-0.03em', 1.12, 480],
    ['pill', false, 34, 18], ['columns', 'center', 'background', 36]
  ),
  [ThemeType.SLATE]: compose(
    'Engineering logbook',
    'An inverse monospace terminal, compact index and slate ledger favor technical precision and sharp borders.',
    ['#BDC8D1', '#0A1925'],
    ['terminal', 'left', 'text', 28, 24],
    ['index', 'left', 32, 36, 34, MONO, 700, '-0.035em', 1.12, 500],
    ['outline', true, 28, 16], ['ledger', 'left', 'border', 24]
  ),
  [ThemeType.MARIGOLD]: compose(
    'Golden arts review',
    'An ochre billboard and centered serif columns have the presence of an arts-review spread, finished with an inverse colophon.',
    ['#EDD49C', '#211605'],
    ['billboard', 'center', 'secondary', 48, 34],
    ['columns', 'center', 36, 48, 46, SERIF, 700, '-0.04em', 1.08, 512],
    ['block', false, 32, 18], ['colophon', 'center', 'text', 32]
  ),
  [ThemeType.INKWELL]: compose(
    'Black-letter proofs',
    'An inverse ruled masthead, outsized serif outline and sober ledger evoke typographic proofs in black ink.',
    ['#D2D0CB', '#101414'],
    ['ruled', 'left', 'text', 32, 30],
    ['outline', 'left', 36, 44, 46, SERIF, 700, '-0.045em', 1.06, 508],
    ['editorial', false, 0, 16], ['ledger', 'left', 'background', 28]
  ),
  [ThemeType.TIDE]: compose(
    'Coastal asymmetry',
    'A right-aligned teal split band, open story and minimal ledger balance the composition against its outer edge.',
    ['#B8D4D1', '#071C19'],
    ['split-band', 'right', 'primary', 40, 30],
    ['story', 'right', 40, 48, 40, SANS, 700, '-0.04em', 1.1, 488],
    ['pill', false, 34, 18], ['minimal', 'right', 'border', 32]
  ),
  [ThemeType.CLAY]: compose(
    'Earthen studio letter',
    'A small serif monogram, carefully framed terracotta panel and rust signature feel handcrafted without faux textures.',
    ['#DFBFA7', '#201209'],
    ['monogram', 'left', 'background', 36, 28],
    ['panel', 'left', 36, 44, 38, SERIF, 400, '-0.02em', 1.16, 460],
    ['block', false, 30, 18], ['signature', 'left', 'secondary', 32]
  ),
  [ThemeType.CLOUD]: compose(
    'Airspace bulletin',
    'A quiet centered identity and broad sans panel float on a cool blue-grey canvas, with a restrained minimal footer.',
    ['#DCE4ED', '#0D1B2C'],
    ['quiet', 'center', 'background', 36, 24],
    ['panel', 'center', 36, 44, 36, HUMANIST, 700, '-0.04em', 1.15, 488],
    ['pill', true, 30, 18], ['minimal', 'center', 'border', 32]
  ),
  [ThemeType.CAMPUS]: compose(
    'University circular',
    'An inverse collegiate masthead, serif index and russet column footer give this circular an institutional archive character.',
    ['#D9C5A2', '#18140A'],
    ['masthead', 'left', 'text', 36, 30],
    ['index', 'left', 36, 40, 40, SERIF, 700, '-0.025em', 1.12, 492],
    ['outline', false, 28, 16], ['columns', 'left', 'primary', 32]
  ),
  [ThemeType.NOIR]: compose(
    'Monochrome atelier',
    'A right-aligned black billboard and dramatic serif outline create an austere luxury atelier with a terse colophon.',
    ['#C6C5C4', '#030303'],
    ['billboard', 'right', 'text', 52, 38],
    ['outline', 'right', 44, 52, 48, SERIF, 400, '-0.055em', 1.04, 488],
    ['editorial', false, 0, 17], ['colophon', 'right', 'primary', 36]
  ),
  [ThemeType.MINT]: compose(
    'Fresh Swiss digest',
    'A green label, economical sans columns and clean band make a crisp digest; the smallest hero scale suits dense material.',
    ['#D1E6D7', '#0A1E13'],
    ['label', 'left', 'secondary', 28, 24],
    ['columns', 'left', 32, 40, 32, SANS, 700, '-0.035em', 1.15, 488],
    ['pill', false, 32, 17], ['band', 'left', 'background', 28]
  ),
  [ThemeType.SAFFRON]: compose(
    'Spice-house broadside',
    'A burnt-orange ruled masthead, heavy accent-rail body and inverse column footer create a vivid typographic broadside.',
    ['#ECC398', '#221206'],
    ['ruled', 'left', 'primary', 32, 30],
    ['accent-rail', 'left', 36, 48, 44, DISPLAY, 800, '-0.045em', 1.06, 504],
    ['offset', false, 30, 18], ['columns', 'left', 'text', 32]
  ),
};

/** Return a fresh profile so consumer changes cannot leak into another theme instance. */
export function getThemeComposition(id: ThemeType): IThemeComposition {
  const composition = COMPOSITIONS[id] ?? DEFAULT_COMPOSITION;
  return {
    ...composition,
    canvas: { ...composition.canvas },
    header: { ...composition.header },
    body: { ...composition.body },
    button: { ...composition.button },
    footer: { ...composition.footer }
  };
}
