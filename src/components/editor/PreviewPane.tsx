import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { getTheme } from '../../lib/themes'
import SlideRenderer from '../presentation/SlideRenderer'

const SLIDE_W = 1280
const SLIDE_H = 720

interface Props {
  className?: string
}

export default function PreviewPane({ className = '' }: Props) {
  const store = useAppStore()
  const { presentation, currentSlideIndex, nextSlide, prevSlide } = store
  const theme = getTheme(presentation.theme)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)

  const slide = presentation.slides[currentSlideIndex]
  const total = presentation.slides.length

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      const padding = 48
      const maxW = width - padding
      const maxH = height - padding - 40 // subtract dots height
      const scaleW = maxW / SLIDE_W
      const scaleH = maxH / SLIDE_H
      setScale(Math.min(scaleW, scaleH, 0.6))
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div className={`flex flex-col h-full bg-[var(--bg-void)] ${className}`}>
      {/* Preview header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2">
          <Eye size={12} className="text-[var(--text-muted)]" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] font-[Syne]">
            Preview
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--text-muted)] font-mono">
            {total > 0 ? `${currentSlideIndex + 1} / ${total}` : '—'}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors hover:bg-[var(--bg-elevated)]"
            >
              <ChevronLeft size={12} />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlideIndex >= total - 1}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors hover:bg-[var(--bg-elevated)]"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Slide preview area */}
      <div ref={containerRef} className="flex-1 flex flex-col items-center justify-center overflow-hidden p-6">
        {slide ? (
          <>
            {/* Scaled slide */}
            <div
              className="rounded-xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10 shrink-0"
              style={{
                width: SLIDE_W * scale,
                height: SLIDE_H * scale,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${slide.id}-${presentation.theme}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ width: SLIDE_W, height: SLIDE_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}
                >
                  <SlideRenderer slide={slide} theme={theme} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            {total > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-3 shrink-0">
                {presentation.slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => store.setCurrentSlideIndex(i)}
                    className={`rounded-full transition-all ${
                      i === currentSlideIndex
                        ? 'w-4 h-1.5 bg-[var(--accent-cyan)]'
                        : 'w-1.5 h-1.5 bg-[var(--border-strong)] hover:bg-[var(--text-muted)]'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center">
              <Eye size={24} className="text-[var(--text-muted)]" />
            </div>
            <p className="text-[var(--text-secondary)] text-sm">Start writing to preview slides</p>
            <p className="text-[var(--text-muted)] text-xs mt-1">Use --- to separate slides</p>
          </div>
        )}
      </div>
    </div>
  )
}
