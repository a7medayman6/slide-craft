import type React from 'react'
import type { Theme, ThemeName } from '../types'

export const themes: Record<ThemeName, Theme> = {
  minimal: {
    name: 'minimal',
    label: 'Minimal',
    description: 'Clean white canvas. Timeless and distraction-free.',
    preview: 'bg-white text-gray-900',
    bg: '#ffffff',
    text: '#0f0f1a',
    textMuted: '#6b7280',
    accent: '#0f0f1a',
    surface: '#f8f8fb',
    border: 'rgba(0,0,0,0.08)',
    headingFont: 'Syne',
    bodyFont: 'Outfit',
    codeStyle: 'light',
  },
  startup: {
    name: 'startup',
    label: 'Startup',
    description: 'Bold, electric. Built for founders who ship fast.',
    preview: 'bg-gray-950 text-cyan-400',
    bg: '#03030a',
    text: '#e8e8ff',
    textMuted: '#6b6b9a',
    accent: '#00d9ff',
    surface: '#0a0a18',
    border: 'rgba(0,217,255,0.12)',
    headingFont: 'Syne',
    bodyFont: 'Outfit',
    codeStyle: 'dark',
  },
  glassmorphism: {
    name: 'glassmorphism',
    label: 'Glass',
    description: 'Frosted panels floating in gradient space.',
    preview: 'bg-violet-950 text-violet-100',
    bg: 'linear-gradient(135deg, #1a0533 0%, #0a0a2e 50%, #001a33 100%)',
    text: '#f0f0ff',
    textMuted: '#a78bca',
    accent: '#c084fc',
    surface: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.12)',
    headingFont: 'Syne',
    bodyFont: 'Outfit',
    codeStyle: 'dark',
  },
  editorial: {
    name: 'editorial',
    label: 'Editorial',
    description: 'Magazine-quality typography. Serif elegance.',
    preview: 'bg-amber-50 text-gray-900',
    bg: '#faf8f4',
    text: '#1c1917',
    textMuted: '#78716c',
    accent: '#b45309',
    surface: '#f5f0e8',
    border: 'rgba(0,0,0,0.08)',
    headingFont: 'Playfair Display',
    bodyFont: 'Outfit',
    codeStyle: 'light',
  },
  futuristic: {
    name: 'futuristic',
    label: 'Cyber',
    description: 'Terminal aesthetics. Scan lines and grid.',
    preview: 'bg-black text-green-400',
    bg: '#000000',
    text: '#00ff88',
    textMuted: '#006633',
    accent: '#00ff88',
    surface: '#050f05',
    border: 'rgba(0,255,136,0.2)',
    headingFont: 'JetBrains Mono',
    bodyFont: 'JetBrains Mono',
    codeStyle: 'dark',
  },
}

export const themeList = Object.values(themes)

export function getTheme(name: ThemeName): Theme {
  return themes[name]
}

export function getSlideStyles(theme: Theme): React.CSSProperties {
  const isGradient = theme.bg.startsWith('linear-gradient') || theme.bg.startsWith('radial-gradient')
  return {
    background: isGradient ? theme.bg : theme.bg,
    color: theme.text,
    fontFamily: `'${theme.bodyFont}', sans-serif`,
  }
}
