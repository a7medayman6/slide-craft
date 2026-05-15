import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, Layers, Zap, Type, Code2, Palette,
  Sparkles, FileText, Globe, Play, ChevronRight,
  Star, Command, Monitor
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { themeList } from '../lib/themes'
import { Button } from '../components/ui/Button'
import type { ThemeName } from '../types'

const demoMarkdown = `# Ship Faster

Your ideas → beautiful slides

---

## The Stack

- Write in Markdown
- Present anywhere
- Export to HTML

---

## Live Preview

Changes render instantly

\`\`\`bash
Just write and watch the magic
\`\`\``

function ThemeCard({ theme, isActive, onClick }: { theme: typeof themeList[0]; isActive: boolean; onClick: () => void }) {
  const isGradient = theme.bg.startsWith('linear-gradient')

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative rounded-2xl overflow-hidden cursor-pointer text-left transition-all ${
        isActive ? 'ring-2 ring-[var(--accent-cyan)]' : 'ring-1 ring-white/10 hover:ring-white/20'
      }`}
      style={{ background: isGradient ? theme.bg : theme.bg }}
    >
      <div className="p-6 h-36" style={{ color: theme.text }}>
        {theme.name === 'futuristic' && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,136,0.08) 3px, rgba(0,255,136,0.08) 4px)`,
            }}
          />
        )}
        <div
          className="relative z-10 text-lg font-bold mb-1"
          style={{
            fontFamily: theme.name === 'editorial' ? 'Playfair Display, serif' : theme.name === 'futuristic' ? 'JetBrains Mono' : 'Syne, sans-serif',
          }}
        >
          {theme.label}
        </div>
        <div
          className="relative z-10 text-xs opacity-70"
          style={{
            fontFamily: theme.name === 'futuristic' ? 'JetBrains Mono' : 'Outfit, sans-serif',
          }}
        >
          {theme.description}
        </div>

        {/* Decorative accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ background: theme.accent, opacity: isActive ? 1 : 0.3 }}
        />
      </div>

      {isActive && (
        <div className="absolute top-3 right-3">
          <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
        </div>
      )}
    </motion.button>
  )
}

const features = [
  {
    icon: <Type size={20} />,
    title: 'Markdown First',
    desc: 'Write naturally in Markdown. Use --- to create slide breaks. It just works.',
    color: 'var(--accent-cyan)',
  },
  {
    icon: <Globe size={20} />,
    title: 'HTML Support',
    desc: 'Full HTML rendering with inline styles, custom layouts, and media.',
    color: 'var(--accent-violet)',
  },
  {
    icon: <Zap size={20} />,
    title: 'Instant Preview',
    desc: 'Live preview updates as you type. No compile step, no delays.',
    color: 'var(--accent-amber)',
  },
  {
    icon: <Palette size={20} />,
    title: '5 Themes',
    desc: 'Minimal, Startup, Glass, Editorial, Cyber. Each one production-grade.',
    color: 'var(--accent-coral)',
  },
  {
    icon: <Monitor size={20} />,
    title: 'Present Mode',
    desc: 'Fullscreen presentation with cinematic transitions and keyboard navigation.',
    color: 'var(--accent-green)',
  },
  {
    icon: <Code2 size={20} />,
    title: 'Syntax Highlighting',
    desc: 'Beautiful code blocks with language detection and VS Code-quality highlighting.',
    color: 'var(--accent-cyan)',
  },
  {
    icon: <Command size={20} />,
    title: 'Command Palette',
    desc: 'Hit ⌘K to switch themes, export, present, and more — all from keyboard.',
    color: 'var(--accent-violet)',
  },
  {
    icon: <Layers size={20} />,
    title: 'Export to HTML',
    desc: 'Download your presentation as a standalone HTML file. Share anywhere.',
    color: 'var(--accent-amber)',
  },
]

const DEMO_SLIDES = [
  { bg: '#03030a', heading: 'Turn Documents Into', sub: 'Beautiful Presentations', accent: '#00d9ff' },
  { bg: 'linear-gradient(135deg, #1a0533, #0a0a2e)', heading: 'Write in Markdown', sub: 'Present instantly', accent: '#c084fc' },
  { bg: '#ffffff', heading: 'Minimal. Elegant.', sub: 'Distraction-free design', accent: '#0f0f1a', dark: false },
  { bg: '#faf8f4', heading: 'Editorial Quality', sub: 'Magazine-grade typography', accent: '#b45309', dark: false },
  { bg: '#000000', heading: 'SYS_ONLINE', sub: '// All systems operational', accent: '#00ff88' },
]

export default function Landing() {
  const navigate = useNavigate()
  const store = useAppStore()
  const [activeTheme, setActiveTheme] = useState<ThemeName>('startup')
  const [demoSlide, setDemoSlide] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60])

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoSlide(s => (s + 1) % DEMO_SLIDES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleGetStarted = () => {
    navigate('/editor')
  }

  const handleTryTheme = (theme: ThemeName) => {
    setActiveTheme(theme)
    store.setTheme(theme)
  }

  const current = DEMO_SLIDES[demoSlide]
  const isDark = current.dark !== false

  return (
    <div className="min-h-screen bg-[var(--bg-void)] overflow-x-hidden">
      {/* Grid bg */}
      <div className="fixed inset-0 grid-bg opacity-50 pointer-events-none" />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-[var(--border)]"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-violet)] flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Layers size={15} className="text-black" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">DeckCraft</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Features</a>
          <a href="#themes" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Themes</a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleGetStarted}>
            Open Editor
          </Button>
          <Button variant="primary" size="sm" onClick={handleGetStarted}>
            Get Started <ArrowRight size={14} />
          </Button>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 text-center"
      >
        {/* Glow orbs */}
        <div
          className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none animate-float"
          style={{ background: 'var(--accent-cyan)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none animate-float-slow"
          style={{ background: 'var(--accent-violet)' }}
        />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[var(--border-accent)] mb-8"
        >
          <Sparkles size={12} className="text-[var(--accent-cyan)]" />
          <span className="text-xs text-[var(--accent-cyan)] font-medium font-[Syne]">Frontend Only · No Server · No Auth</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight max-w-5xl mb-6"
        >
          Turn Documents Into{' '}
          <span className="gradient-text">Beautiful</span>{' '}
          <br className="hidden sm:block" />
          Presentations
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mb-10 leading-relaxed"
        >
          Write in <span className="text-[var(--text-primary)] font-medium">Markdown</span> or{' '}
          <span className="text-[var(--text-primary)] font-medium">HTML</span>. Present{' '}
          <span className="text-[var(--accent-cyan)] font-medium">instantly</span>.{' '}
          No PowerPoint. No servers. Just beautiful slides.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <motion.button
            onClick={handleGetStarted}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-3 px-8 py-4 bg-[var(--accent-cyan)] text-black font-semibold rounded-2xl text-base hover:brightness-110 transition-all shadow-lg shadow-cyan-500/25 font-[Syne]"
          >
            Start Creating
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            onClick={handleGetStarted}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 px-8 py-4 glass border border-[var(--border-strong)] text-[var(--text-primary)] font-medium rounded-2xl text-base hover:border-[var(--accent-cyan)] hover:border-opacity-50 transition-all font-[Syne]"
          >
            <Play size={16} className="text-[var(--accent-cyan)]" />
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Animated slide preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="relative w-full max-w-4xl mx-auto"
        >
          {/* Browser chrome */}
          <div className="glass-strong rounded-2xl overflow-hidden border border-[var(--border-strong)] shadow-2xl shadow-black/60">
            {/* Chrome bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-surface)]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 mx-3">
                <div className="flex items-center gap-2 bg-[var(--bg-elevated)] rounded-lg px-3 py-1 text-xs text-[var(--text-muted)] font-mono max-w-xs mx-auto">
                  <span className="text-[var(--accent-green)] text-xs">●</span>
                  deckcraft.app/editor
                </div>
              </div>
            </div>

            {/* Slide area */}
            <div
              className="relative flex items-center justify-center overflow-hidden"
              style={{ height: '56.25vw', maxHeight: 500 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={demoSlide}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 flex flex-col items-center justify-center px-16"
                  style={{ background: current.bg }}
                >
                  {current.bg === '#000000' && (
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,136,0.06) 3px, rgba(0,255,136,0.06) 4px)`,
                      }}
                    />
                  )}

                  <div
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4 relative z-10"
                    style={{
                      fontFamily: current.dark === false ? 'Playfair Display, serif' : 'Syne, sans-serif',
                      color: isDark ? '#e8e8ff' : '#1c1917',
                      letterSpacing: '-0.03em',
                      lineHeight: 1.1,
                    }}
                  >
                    {current.heading}
                  </div>
                  <div
                    className="text-lg sm:text-xl relative z-10 text-center"
                    style={{
                      color: current.accent,
                      fontFamily: current.bg === '#000000' ? 'JetBrains Mono, monospace' : 'Outfit, sans-serif',
                      opacity: 0.9,
                    }}
                  >
                    {current.sub}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {DEMO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setDemoSlide(i)}
                    className={`rounded-full transition-all ${
                      i === demoSlide ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-void)] to-transparent pointer-events-none" />
        </motion.div>
      </motion.section>

      {/* Features */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] text-xs text-[var(--text-muted)] mb-4 font-[Syne] uppercase tracking-wider">
              <Zap size={10} className="text-[var(--accent-amber)]" />
              Everything you need
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Built for creators who{' '}
              <span className="gradient-text-warm">ship</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              Every feature designed to get you from idea to presentation in seconds.
              No friction. No fuss.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl p-6 border border-[var(--border)] hover:border-[var(--border-strong)] transition-all group cursor-default"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                  style={{ background: `${feature.color}20`, color: feature.color }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-[var(--text-primary)] mb-2 text-sm">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes */}
      <section id="themes" className="relative py-32 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, var(--accent-violet), transparent 70%)',
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] text-xs text-[var(--text-muted)] mb-4 font-[Syne] uppercase tracking-wider">
              <Palette size={10} className="text-[var(--accent-violet)]" />
              Visual Themes
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Every aesthetic,{' '}
              <span className="gradient-text">perfectly crafted</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              Five premium themes, each with its own character. Switch instantly.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {themeList.map((theme, i) => (
              <motion.div
                key={theme.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
              >
                <ThemeCard
                  theme={theme}
                  isActive={activeTheme === theme.name}
                  onClick={() => handleTryTheme(theme.name as ThemeName)}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-10"
          >
            <Button variant="outline" size="lg" onClick={handleGetStarted}>
              Try all themes in the editor <ChevronRight size={16} />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-6">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div
            className="absolute inset-0 -m-20 rounded-3xl opacity-10 blur-3xl pointer-events-none"
            style={{ background: 'var(--accent-cyan)' }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-accent)] text-xs text-[var(--accent-cyan)] mb-6 font-[Syne] uppercase tracking-wider">
              <Star size={10} />
              100% Free · No Sign Up
            </div>

            <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.05]">
              Start presenting in
              <br />
              <span className="gradient-text">seconds, not hours</span>
            </h2>

            <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-lg mx-auto">
              Open the editor. Write your first slide. Present to the world.
              No account needed.
            </p>

            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-3 px-10 py-5 bg-[var(--accent-cyan)] text-black font-bold rounded-2xl text-lg hover:brightness-110 transition-all shadow-2xl shadow-cyan-500/30 font-[Syne]"
            >
              Open DeckCraft
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-violet)] flex items-center justify-center">
              <Layers size={11} className="text-black" />
            </div>
            <span className="font-display text-sm font-bold text-[var(--text-secondary)]">DeckCraft</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Frontend only · Runs in your browser · No data leaves your device
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--text-muted)]">Built with ❤️ and Markdown</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
