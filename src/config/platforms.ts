import { PlatformTheme } from '../types/media';

/**
 * Predefined Chameleon Glass themes matching the FastAPI backend definitions.
 */
export const PLATFORM_THEMES: Record<string, PlatformTheme> = {
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    icon: 'youtube',
    badge_text: 'YouTube 4K Ultra HDR',
    primary_color: '#FF0000',
    secondary_color: '#CC0000',
    accent_color: '#FF4D4D',
    gradient_css: 'linear-gradient(135deg, rgba(255, 0, 0, 0.85) 0%, rgba(180, 0, 0, 0.65) 100%)',
    glass_border: '1px solid rgba(255, 0, 0, 0.35)',
    glass_shadow: '0 8px 32px 0 rgba(255, 0, 0, 0.25)',
    glow_color: 'rgba(255, 0, 0, 0.5)',
    text_color: '#FFFFFF',
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'tiktok',
    badge_text: 'TikTok No-Watermark HD',
    primary_color: '#00F2FE',
    secondary_color: '#FE2C55',
    accent_color: '#00F2FE',
    gradient_css: 'linear-gradient(135deg, rgba(0, 242, 254, 0.75) 0%, rgba(254, 44, 85, 0.75) 100%)',
    glass_border: '1px solid rgba(0, 242, 254, 0.35)',
    glass_shadow: '0 8px 32px 0 rgba(0, 242, 254, 0.25)',
    glow_color: 'rgba(0, 242, 254, 0.5)',
    text_color: '#FFFFFF',
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    icon: 'instagram',
    badge_text: 'Instagram HD Carousel / Reel',
    primary_color: '#E1306C',
    secondary_color: '#FD1D1D',
    accent_color: '#F77737',
    gradient_css: 'linear-gradient(135deg, rgba(131, 58, 180, 0.8) 0%, rgba(253, 29, 29, 0.8) 50%, rgba(252, 176, 69, 0.8) 100%)',
    glass_border: '1px solid rgba(225, 48, 108, 0.35)',
    glass_shadow: '0 8px 32px 0 rgba(225, 48, 108, 0.25)',
    glow_color: 'rgba(225, 48, 108, 0.5)',
    text_color: '#FFFFFF',
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    icon: 'facebook',
    badge_text: 'Facebook Watch & Reels HD',
    primary_color: '#1877F2',
    secondary_color: '#0D65D9',
    accent_color: '#42B72A',
    gradient_css: 'linear-gradient(135deg, rgba(24, 119, 242, 0.85) 0%, rgba(13, 101, 217, 0.65) 100%)',
    glass_border: '1px solid rgba(24, 119, 242, 0.35)',
    glass_shadow: '0 8px 32px 0 rgba(24, 119, 242, 0.25)',
    glow_color: 'rgba(24, 119, 242, 0.5)',
    text_color: '#FFFFFF',
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter / X',
    icon: 'x-twitter',
    badge_text: 'X / Twitter Media 1080p',
    primary_color: '#1DA1F2',
    secondary_color: '#14171A',
    accent_color: '#AAB8C2',
    gradient_css: 'linear-gradient(135deg, rgba(20, 23, 26, 0.9) 0%, rgba(29, 161, 242, 0.7) 100%)',
    glass_border: '1px solid rgba(29, 161, 242, 0.35)',
    glass_shadow: '0 8px 32px 0 rgba(29, 161, 242, 0.25)',
    glow_color: 'rgba(29, 161, 242, 0.5)',
    text_color: '#FFFFFF',
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    icon: 'reddit',
    badge_text: 'Reddit Video & Gallery',
    primary_color: '#FF4500',
    secondary_color: '#CC3700',
    accent_color: '#5F99CF',
    gradient_css: 'linear-gradient(135deg, rgba(255, 69, 0, 0.85) 0%, rgba(180, 50, 0, 0.65) 100%)',
    glass_border: '1px solid rgba(255, 69, 0, 0.35)',
    glass_shadow: '0 8px 32px 0 rgba(255, 69, 0, 0.25)',
    glow_color: 'rgba(255, 69, 0, 0.5)',
    text_color: '#FFFFFF',
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    icon: 'pinterest',
    badge_text: 'Pinterest Ultra High-Res Pin',
    primary_color: '#E60023',
    secondary_color: '#BD081C',
    accent_color: '#FAFAFA',
    gradient_css: 'linear-gradient(135deg, rgba(230, 0, 35, 0.85) 0%, rgba(189, 8, 28, 0.65) 100%)',
    glass_border: '1px solid rgba(230, 0, 35, 0.35)',
    glass_shadow: '0 8px 32px 0 rgba(230, 0, 35, 0.25)',
    glow_color: 'rgba(230, 0, 35, 0.5)',
    text_color: '#FFFFFF',
  },
  soundcloud: {
    id: 'soundcloud',
    name: 'SoundCloud',
    icon: 'soundcloud',
    badge_text: 'SoundCloud Lossless HQ Audio',
    primary_color: '#FF5500',
    secondary_color: '#FF7700',
    accent_color: '#FFAA00',
    gradient_css: 'linear-gradient(135deg, rgba(255, 85, 0, 0.85) 0%, rgba(255, 119, 0, 0.65) 100%)',
    glass_border: '1px solid rgba(255, 85, 0, 0.35)',
    glass_shadow: '0 8px 32px 0 rgba(255, 85, 0, 0.25)',
    glow_color: 'rgba(255, 85, 0, 0.5)',
    text_color: '#FFFFFF',
  },
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    icon: 'spotify',
    badge_text: 'Spotify Track Metadata',
    primary_color: '#1DB954',
    secondary_color: '#191414',
    accent_color: '#1ED760',
    gradient_css: 'linear-gradient(135deg, rgba(29, 185, 84, 0.85) 0%, rgba(25, 20, 20, 0.85) 100%)',
    glass_border: '1px solid rgba(29, 185, 84, 0.35)',
    glass_shadow: '0 8px 32px 0 rgba(29, 185, 84, 0.25)',
    glow_color: 'rgba(29, 185, 84, 0.5)',
    text_color: '#FFFFFF',
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    icon: 'threads',
    badge_text: 'Threads Post Media',
    primary_color: '#FFFFFF',
    secondary_color: '#262626',
    accent_color: '#0095F6',
    gradient_css: 'linear-gradient(135deg, rgba(38, 38, 38, 0.9) 0%, rgba(0, 0, 0, 0.9) 100%)',
    glass_border: '1px solid rgba(255, 255, 255, 0.2)',
    glass_shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
    glow_color: 'rgba(255, 255, 255, 0.3)',
    text_color: '#FFFFFF',
  },
  twitch: {
    id: 'twitch',
    name: 'Twitch',
    icon: 'twitch',
    badge_text: 'Twitch Clip / VOD 1080p60',
    primary_color: '#9146FF',
    secondary_color: '#772CE8',
    accent_color: '#BF94FF',
    gradient_css: 'linear-gradient(135deg, rgba(145, 70, 255, 0.85) 0%, rgba(119, 44, 232, 0.65) 100%)',
    glass_border: '1px solid rgba(145, 70, 255, 0.35)',
    glass_shadow: '0 8px 32px 0 rgba(145, 70, 255, 0.25)',
    glow_color: 'rgba(145, 70, 255, 0.5)',
    text_color: '#FFFFFF',
  },
  vimeo: {
    id: 'vimeo',
    name: 'Vimeo',
    icon: 'vimeo',
    badge_text: 'Vimeo 4K Pro Video',
    primary_color: '#1AB7EA',
    secondary_color: '#0080B0',
    accent_color: '#B6ECF8',
    gradient_css: 'linear-gradient(135deg, rgba(26, 183, 234, 0.85) 0%, rgba(0, 128, 176, 0.65) 100%)',
    glass_border: '1px solid rgba(26, 183, 234, 0.35)',
    glass_shadow: '0 8px 32px 0 rgba(26, 183, 234, 0.25)',
    glow_color: 'rgba(26, 183, 234, 0.5)',
    text_color: '#FFFFFF',
  },
  bilibili: {
    id: 'bilibili',
    name: 'Bilibili',
    icon: 'bilibili',
    badge_text: 'Bilibili 1080p+ Stream',
    primary_color: '#00A1D6',
    secondary_color: '#FB7299',
    accent_color: '#23C9ED',
    gradient_css: 'linear-gradient(135deg, rgba(0, 161, 214, 0.8) 0%, rgba(251, 114, 153, 0.8) 100%)',
    glass_border: '1px solid rgba(0, 161, 214, 0.35)',
    glass_shadow: '0 8px 32px 0 rgba(0, 161, 214, 0.25)',
    glow_color: 'rgba(0, 161, 214, 0.5)',
    text_color: '#FFFFFF',
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'linkedin',
    badge_text: 'LinkedIn HD Post / Video',
    primary_color: '#0A66C2',
    secondary_color: '#004182',
    accent_color: '#70B5F9',
    gradient_css: 'linear-gradient(135deg, rgba(10, 102, 194, 0.85) 0%, rgba(0, 65, 130, 0.65) 100%)',
    glass_border: '1px solid rgba(10, 102, 194, 0.35)',
    glass_shadow: '0 8px 32px 0 rgba(10, 102, 194, 0.25)',
    glow_color: 'rgba(10, 102, 194, 0.5)',
    text_color: '#FFFFFF',
  },
  generic: {
    id: 'generic',
    name: 'Universal Media Stream',
    icon: 'globe',
    badge_text: 'Universal Stream Extraction',
    primary_color: '#6366F1',
    secondary_color: '#4F46E5',
    accent_color: '#818CF8',
    gradient_css: 'linear-gradient(135deg, rgba(99, 102, 241, 0.85) 0%, rgba(79, 70, 229, 0.65) 100%)',
    glass_border: '1px solid rgba(99, 102, 241, 0.35)',
    glass_shadow: '0 8px 32px 0 rgba(99, 102, 241, 0.25)',
    glow_color: 'rgba(99, 102, 241, 0.5)',
    text_color: '#FFFFFF',
  },
};

/**
 * Regex patterns matching social platforms for instant client-side detection.
 */
const PATTERNS: [RegExp, string][] = [
  [/(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?|shorts\/|live\/|embed\/)|youtu\.be\/)/i, 'youtube'],
  [/(?:https?:\/\/)?(?:www\.|vm\.|vt\.)?tiktok\.com\//i, 'tiktok'],
  [/(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p\/|reel\/|reels\/|stories\/|tv\/)/i, 'instagram'],
  [/(?:https?:\/\/)?(?:www\.|m\.|fb\.)?(?:facebook\.com|fb\.watch)\//i, 'facebook'],
  [/(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\//i, 'twitter'],
  [/(?:https?:\/\/)?(?:www\.)?reddit\.com\/r\/.+\/comments\//i, 'reddit'],
  [/(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?pinterest\.(?:com|[a-z]{2,3})\/pin\//i, 'pinterest'],
  [/(?:https?:\/\/)?(?:www\.)?soundcloud\.com\//i, 'soundcloud'],
  [/(?:https?:\/\/)?(?:open\.)?spotify\.com\//i, 'spotify'],
  [/(?:https?:\/\/)?(?:www\.)?threads\.net\//i, 'threads'],
  [/(?:https?:\/\/)?(?:www\.)?twitch\.tv\//i, 'twitch'],
  [/(?:https?:\/\/)?(?:www\.)?vimeo\.com\//i, 'vimeo'],
  [/(?:https?:\/\/)?(?:www\.)?bilibili\.com\/video\//i, 'bilibili'],
  [/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:posts\/|feed\/update\/|learning\/|video\/|pulse\/)/i, 'linkedin'],
];

/**
 * Detect platform synchronously from client-side URL input
 */
export function detectClientPlatform(url: string): PlatformTheme {
  if (!url || typeof url !== 'string') {
    return PLATFORM_THEMES.generic;
  }

  const trimmed = url.trim();
  for (const [pattern, platformKey] of PATTERNS) {
    if (pattern.test(trimmed)) {
      return PLATFORM_THEMES[platformKey] || PLATFORM_THEMES.generic;
    }
  }

  return PLATFORM_THEMES.generic;
}

/**
 * Featured platform pill badges for Hero section interaction
 */
export const FEATURED_PLATFORMS = [
  { id: 'youtube', name: 'YouTube', color: '#FF0000', icon: 'youtube' },
  { id: 'facebook', name: 'Facebook', color: '#1877F2', icon: 'facebook' },
  { id: 'twitter', name: 'X / Twitter', color: '#1DA1F2', icon: 'twitter' },
  { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2', icon: 'linkedin' },
  { id: 'tiktok', name: 'TikTok', color: '#00F2FE', icon: 'tiktok' },
  { id: 'instagram', name: 'Instagram', color: '#E1306C', icon: 'instagram' },
  { id: 'soundcloud', name: 'SoundCloud', color: '#FF5500', icon: 'soundcloud' },
  { id: 'pinterest', name: 'Pinterest', color: '#E60023', icon: 'pinterest' },
  { id: 'reddit', name: 'Reddit', color: '#FF4500', icon: 'reddit' },
];/**
 * Validate whether an input string is a valid media URL suitable for automatic analysis.
 */
export function isValidMediaUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim();
  if (clean.length < 8) return false;

  for (const [pattern] of PATTERNS) {
    if (pattern.test(clean)) {
      return true;
    }
  }

  try {
    const parsed = new URL(clean.startsWith('http://') || clean.startsWith('https://') ? clean : `https://${clean}`);
    return parsed.hostname.includes('.') && parsed.hostname.length > 3 && parsed.pathname.length > 1;
  } catch {
    return /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(clean);
  }
}
