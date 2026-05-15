import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, X, Maximize2, Minimize2,
  LayoutGrid, Layers
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { getTheme } from '../lib/themes'
import SlideRenderer from '../components/presentation/SlideRenderer'
import SlideThumbnail from '../components/presentation/SlideThumbnail'
import type { TransitionName } from '../types'
import { clsx } from 'clsx'

function getVariants(transition: TransitionName) {
  switch (transition) {
    case 'fade':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    case 'zoom':
      return {
        initial: { opacity: 0, scale: 1.08 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.93 },
      }
    case 'flip':
      return {
        initial: { opacity: 0, rotateY: -15, perspective: 1200 },
        animate: { opacity: 1, rotateY: 0 },
        exit: { opacity: 0, rotateY: 15 },
      }
    case 'reveal':
      return {
        initial: { clipPath: 'inset(0 100% 0 0)' },
        animate: { clipPath: 'inset(0 0% 0 0)' },
        exit: { clipPath: 'inset(0 0 0 100%)' },
      }
    case 'slide':
    default:
      return {
        initial: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
        animate: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
      }
  }
}

export default function Present() {
  const navigate = useNavigate()
  const store = useAppStore()
  const { presentation, currentSlideIndex } = store

  const [direction, setDirection] = useState(1)
  const [showThumbs, setShowThumbs] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [controlsTimeout, setControlsTimeout] = useState<ReturnType<typeof setTimeout> | null>(null)

  const theme = getTheme(presentation.theme)
  const slide = presentation.slides[currentSlideIndex]
  const total = presentation.slides.length
  const variants = getVariants(presentation.transition)

  const go = useCallback((delta: number) => {
    const next = currentSlideIndex + delta
    if (next < 0 || next >= total) return
    setDirection(delta)
    store.setCurrentSlideIndex(next)
  }, [currentSlideIndex, total, store])

  const exit = useCallback(() => {
    navigate('/editor')
  }, [navigate])

  const resetControlsTimer = useCallback(() => {
    setShowControls(true)
    if (controlsTimeout) clearTimeout(controlsTimeout)
    const t = setTimeout(() => setShowControls(false), 3000)
    setControlsTimeout(t)
  }, [controlsTimeout])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          go(1)
          break
        case 'ArrowLeft':
          go(-1)
          break
        case 'Escape':
          exit()
          break
        case 'f':
        case 'F':
          document.documentElement.requestFullscreen?.()
          break
        case 'g':
        case 'G':
          setShowThumbs(t => !t)
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [go, exit])

  useEffect(() => {
    resetControlsTimer()
    return () => { if (controlsTimeout) clearTimeout(controlsTimeout) }
  }, [currentSlideIndex])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  if (!slide) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--bg-void)]">
        <div className="text-center">
          <p className="text-[var(--text-secondary)] mb-4">No slides to present</p>
          <button
            onClick={() => navigate('/editor')}
            className="text-[var(--accent-cyan)] hover:underline text-sm"
          >
            Back to editor
          </button>
        </div>
      </div>
    )
  }

  const progressPct = total > 1 ? (currentSlideIndex / (total - 1)) * 100 : 100

  return (
    <div
      className="h-screen w-screen overflow-hidden relative select-none"
      onMouseMove={resetControlsTimer}
      onClick={resetControlsTimer}
      style={{ cursor: showControls ? 'default' : 'none' }}
    >
      {/* Slide */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${slide.id}-${presentation.theme}`}
            custom={direction}
            variants={variants as any}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <SlideRenderer slide={slide} theme={theme} className="h-full" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <motion.div
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 left-0 right-0 h-0.5 z-20"
        style={{ background: theme.border }}
      >
        <motion.div
          className="h-full"
          style={{ background: theme.accent }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        />
      </motion.div>

      {/* Top bar */}
      <motion.div
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-20"
        style={{
          background: `linear-gradient(to bottom, ${
            theme.name === 'minimal' || theme.name === 'editorial' ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.4)'
          }, transparent)`,
        }}
      >
        <div
          className="flex items-center gap-2 text-sm font-[Syne] font-medium opacity-70"
          style={{ color: theme.name === 'minimal' || theme.name === 'editorial' ? theme.text : '#ffffff' }}
        >
          <Layers size={14} />
          {presentation.title}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowThumbs(t => !t)}
            className={clsx(
              'p-2 rounded-xl transition-all text-sm',
              showThumbs
                ? 'bg-white/20 text-white'
                : 'bg-black/20 text-white/70 hover:text-white hover:bg-black/30',
              (theme.name === 'minimal' || theme.name === 'editorial') && 'bg-black/10 text-black/70 hover:text-black hover:bg-black/20'
            )}
            title="Toggle thumbnails (G)"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={toggleFullscreen}
            className={clsx(
              'p-2 rounded-xl transition-all',
              'bg-black/20 text-white/70 hover:text-white hover:bg-black/30',
              (theme.name === 'minimal' || theme.name === 'editorial') && 'bg-black/10 text-black/70 hover:text-black hover:bg-black/20'
            )}
            title="Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={exit}
            className={clsx(
              'p-2 rounded-xl transition-all',
              'bg-black/20 text-white/70 hover:text-white hover:bg-black/30',
              (theme.name === 'minimal' || theme.name === 'editorial') && 'bg-black/10 text-black/70 hover:text-black hover:bg-black/20'
            )}
            title="Exit (Esc)"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>

      {/* Navigation arrows */}
      <motion.button
        animate={{ opacity: showControls && currentSlideIndex > 0 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/30 text-white/80 hover:text-white hover:bg-black/50 transition-all z-20 backdrop-blur-sm"
        title="Previous (←)"
      >
        <ChevronLeft size={24} />
      </motion.button>

      <motion.button
        animate={{ opacity: showControls && currentSlideIndex < total - 1 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/30 text-white/80 hover:text-white hover:bg-black/50 transition-all z-20 backdrop-blur-sm"
        title="Next (→)"
      >
        <ChevronRight size={24} />
      </motion.button>

      {/* Bottom bar */}
      <motion.div
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-4 z-20"
        style={{
          background: `linear-gradient(to top, ${
            theme.name === 'minimal' || theme.name === 'editorial' ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.3)'
          }, transparent)`,
        }}
      >
        {/* Slide dots */}
        <div className="flex items-center gap-2">
          {presentation.slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > currentSlideIndex ? 1 : -1); store.setCurrentSlideIndex(i) }}
              className={clsx(
                'rounded-full transition-all',
                i === currentSlideIndex
                  ? 'w-6 h-2'
                  : 'w-2 h-2 hover:opacity-70',
              )}
              style={{
                background: theme.name === 'minimal' || theme.name === 'editorial'
                  ? i === currentSlideIndex ? theme.text : `${theme.text}40`
                  : i === currentSlideIndex ? '#ffffff' : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>

        {/* Counter */}
        <div
          className="absolute right-6 text-xs font-mono opacity-50"
          style={{
            color: theme.name === 'minimal' || theme.name === 'editorial' ? theme.text : '#ffffff',
          }}
        >
          {currentSlideIndex + 1} / {total}
        </div>
      </motion.div>

      {/* Thumbnails panel */}
      <AnimatePresence>
        {showThumbs && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="absolute bottom-0 left-0 right-0 z-30 glass-strong border-t border-[var(--border)]"
            style={{ height: 140 }}
          >
            <div className="flex items-center gap-3 h-full px-4 overflow-x-auto">
              {presentation.slides.map((s, i) => (
                <SlideThumbnail
                  key={s.id}
                  slide={s}
                  themeName={presentation.theme}
                  index={i}
                  isActive={i === currentSlideIndex}
                  onClick={() => {
                    setDirection(i > currentSlideIndex ? 1 : -1)
                    store.setCurrentSlideIndex(i)
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => setShowThumbs(false)}
              className="absolute top-2 right-3 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hint (first visit) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3 text-xs font-mono z-10 pointer-events-none"
        style={{
          color: theme.name === 'minimal' || theme.name === 'editorial'
            ? `${theme.textMuted}`
            : 'rgba(255,255,255,0.4)',
        }}
      >
        <span>← → navigate</span>
        <span>·</span>
        <span>G thumbnails</span>
        <span>·</span>
        <span>F fullscreen</span>
        <span>·</span>
        <span>ESC exit</span>
      </motion.div>
    </div>
  )
}
