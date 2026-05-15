import { motion } from 'framer-motion'
import { getTheme } from '../../lib/themes'

const sampleSlides = [
  {
    theme: 'startup',
    title: 'We Ship Fast',
    sub: 'Deploy at the speed of thought',
    accent: '#00d9ff',
  },
  {
    theme: 'glassmorphism',
    title: 'Q4 Results',
    sub: '↑ 340% growth YoY',
    accent: '#c084fc',
  },
  {
    theme: 'editorial',
    title: 'The Future',
    sub: 'A new paradigm for creators',
    accent: '#b45309',
  },
  {
    theme: 'minimal',
    title: 'Product Vision',
    sub: 'Simple. Powerful. Yours.',
    accent: '#0f0f1a',
  },
  {
    theme: 'futuristic',
    title: 'SYS_ONLINE',
    sub: '// Initiating sequence...',
    accent: '#00ff88',
  },
]

interface MiniSlideProps {
  title: string
  sub: string
  theme: string
  accent: string
  style?: React.CSSProperties
  className?: string
}

function MiniSlide({ title, sub, theme, accent, style, className }: MiniSlideProps) {
  const t = getTheme(theme as any)
  const isGradient = t.bg.startsWith('linear-gradient')

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ${className}`}
      style={{
        background: isGradient ? t.bg : t.bg,
        color: t.text,
        width: 240,
        height: 135,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '20px 24px',
        position: 'relative',
        ...style,
      }}
    >
      {theme === 'futuristic' && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,136,0.05) 3px, rgba(0,255,136,0.05) 4px)`,
          }}
        />
      )}
      {theme === 'glassmorphism' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}
      <div
        className="relative z-10"
        style={{
          fontFamily: theme === 'editorial' ? 'Playfair Display, serif' : theme === 'futuristic' ? 'JetBrains Mono, monospace' : 'Syne, sans-serif',
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: theme === 'futuristic' ? '0.05em' : '-0.02em',
          color: t.text,
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div
        className="relative z-10"
        style={{
          fontFamily: theme === 'futuristic' ? 'JetBrains Mono, monospace' : 'Outfit, sans-serif',
          fontSize: 12,
          color: theme === 'minimal' || theme === 'editorial' ? t.textMuted : accent,
          opacity: theme === 'futuristic' ? 0.8 : 0.85,
        }}
      >
        {sub}
      </div>

      {/* Border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          border: `1px solid ${theme === 'minimal' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'}`,
        }}
      />
    </div>
  )
}

export default function FloatingCards() {
  const cards = [
    { ...sampleSlides[0], delay: 0, x: 60, y: -20, rotate: -6, animDelay: 0 },
    { ...sampleSlides[1], delay: 0.1, x: 320, y: 40, rotate: 4, animDelay: 0.5 },
    { ...sampleSlides[2], delay: 0.2, x: 160, y: 80, rotate: -2, animDelay: 1 },
    { ...sampleSlides[3], delay: 0.3, x: -80, y: 60, rotate: 8, animDelay: 1.5 },
    { ...sampleSlides[4], delay: 0.4, x: 460, y: -30, rotate: -5, animDelay: 0.8 },
  ]

  return (
    <div className="relative w-full h-full" style={{ minHeight: 400 }}>
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: card.delay + 0.3, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'absolute',
            left: card.x,
            top: card.y,
            rotate: card.rotate,
            animationDelay: `${card.animDelay}s`,
          }}
          className="animate-float"
        >
          <MiniSlide {...card} />
        </motion.div>
      ))}
    </div>
  )
}
