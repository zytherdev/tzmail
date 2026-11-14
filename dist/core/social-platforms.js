"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCIAL_PLATFORM_INFO = void 0;
exports.isSocialPlatform = isSocialPlatform;
exports.SOCIAL_PLATFORM_INFO = {
    facebook: { label: 'Facebook', glyph: 'f', color: '#1877F2' },
    twitter: { label: 'Twitter', glyph: 't', color: '#1D9BF0' },
    x: { label: 'X', glyph: 'X', color: '#000000' },
    linkedin: { label: 'LinkedIn', glyph: 'in', color: '#0A66C2' },
    github: { label: 'GitHub', glyph: 'gh', color: '#24292F' },
    instagram: { label: 'Instagram', glyph: '◎', color: '#C13584' },
    youtube: { label: 'YouTube', glyph: '▶', color: '#FF0033' },
    tiktok: { label: 'TikTok', glyph: '♪', color: '#111111' },
    pinterest: { label: 'Pinterest', glyph: 'p', color: '#BD081C' },
    reddit: { label: 'Reddit', glyph: 'r/', color: '#FF4500' },
    gitlab: { label: 'GitLab', glyph: 'gl', color: '#FC6D26' },
    stackoverflow: { label: 'Stack Overflow', glyph: 'so', color: '#F48024' },
    medium: { label: 'Medium', glyph: 'M', color: '#000000' },
    dribbble: { label: 'Dribbble', glyph: 'd', color: '#EA4C89' },
    behance: { label: 'Behance', glyph: 'Bē', color: '#1769FF' },
    telegram: { label: 'Telegram', glyph: '➤', color: '#26A5E4' },
    threads: { label: 'Threads', glyph: '@', color: '#101010' },
    bluesky: { label: 'Bluesky', glyph: 'b', color: '#0085FF' },
    mastodon: { label: 'Mastodon', glyph: 'm', color: '#6364FF' },
    whatsapp: { label: 'WhatsApp', glyph: 'w', color: '#25D366' },
    discord: { label: 'Discord', glyph: 'd', color: '#5865F2' },
    slack: { label: 'Slack', glyph: 's', color: '#611F69' },
    snapchat: { label: 'Snapchat', glyph: 'sc', color: '#111111' },
    twitch: { label: 'Twitch', glyph: 'tw', color: '#9146FF' },
    spotify: { label: 'Spotify', glyph: 's', color: '#1DB954' },
    soundcloud: { label: 'SoundCloud', glyph: 'sc', color: '#FF5500' },
    vimeo: { label: 'Vimeo', glyph: 'v', color: '#1AB7EA' },
    tumblr: { label: 'Tumblr', glyph: 't', color: '#35465C' },
    flickr: { label: 'Flickr', glyph: 'f', color: '#0063DC' },
    vk: { label: 'VK', glyph: 'vk', color: '#0077FF' },
    wechat: { label: 'WeChat', glyph: 'w', color: '#07C160' },
    line: { label: 'LINE', glyph: 'L', color: '#06C755' },
    signal: { label: 'Signal', glyph: 's', color: '#3A76F0' },
    quora: { label: 'Quora', glyph: 'Q', color: '#B92B27' },
    producthunt: { label: 'Product Hunt', glyph: 'ph', color: '#DA552F' },
    devto: { label: 'DEV Community', glyph: 'dev', color: '#0A0A0A' },
    hashnode: { label: 'Hashnode', glyph: 'h', color: '#2962FF' },
    substack: { label: 'Substack', glyph: 's', color: '#FF6719' },
    patreon: { label: 'Patreon', glyph: 'p', color: '#FF424D' },
    buymeacoffee: { label: 'Buy Me a Coffee', glyph: '☕', color: '#FFDD00' },
    kofi: { label: 'Ko-fi', glyph: 'K', color: '#FF5E5B' },
    wordpress: { label: 'WordPress', glyph: 'W', color: '#21759B' },
    blogger: { label: 'Blogger', glyph: 'B', color: '#FF5722' },
    rss: { label: 'RSS', glyph: '◔', color: '#F26522' }
};
function isSocialPlatform(value) {
    return typeof value === 'string' && Object.prototype.hasOwnProperty.call(exports.SOCIAL_PLATFORM_INFO, value);
}
