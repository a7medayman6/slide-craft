import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import SlideRenderer from './SlideRenderer'
import { getTheme } from '../../lib/themes'
import type { Slide, ThemeName } from '../../types'
import { clsx } from 'clsx'

interface Props {
  slide: Slide
  themeName: ThemeName
  index: number
  isActive: boolean
  onClick: () => void
  onDelete?: () => void
  onDuplicate?: () => void
}

const THUMB_W = 160
const THUMB_H = 90
const SLIDE_W = 1280
const SLIDE_H = 720
const SCALE = THUMB_W / SLIDE_W

const SlideThumbnail = forwardRef<HTMLDivElement, Props>(function SlideThumbnail({
  slide,
  themeName,
  index,
  isActive,
  onClick,
  onDelete,
  onDuplicate,
}: Props, ref) {
  const theme = getTheme(themeName)

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={clsx(
        'group relative cursor-pointer rounded-lg overflow-hidden transition-all',
        isActive
          ? 'ring-2 ring-[var(--accent-cyan)] ring-offset-2 ring-offset-[var(--bg-void)]'
          : 'ring-1 ring-[var(--border)] hover:ring-[var(--border-strong)]'
      )}
      onClick={onClick}
      style={{ width: THUMB_W, height: THUMB_H, flexShrink: 0 }}
    >
      {/* Scaled slide */}
      <div
        style={{
          width: SLIDE_W,
          height: SLIDE_H,
          transform: `scale(${SCALE})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <SlideRenderer slide={slide} theme={theme} />
      </div>

      {/* Slide number */}
      <div className="absolute bottom-1 left-1.5 text-[9px] font-mono opacity-50 z-10">
        {index + 1}
      </div>

      {/* Actions overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
        {onDuplicate && (
          <button
            onClick={e => { e.stopPropagation(); onDuplicate() }}
            className="p-1 bg-[var(--bg-elevated)] rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Duplicate"
          >
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="5" y="5" width="9" height="9" rx="1.5"/>
              <path d="M2 11V3a2 2 0 012-2h8"/>
            </svg>
          </button>
        )}
        {onDelete && (
          <button
            onClick={e => { e.stopPropagation(); onDelete() }}
            className="p-1 bg-[var(--bg-elevated)] rounded text-[var(--accent-coral)] hover:brightness-110 transition-colors"
            title="Delete"
          >
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 4h12M6 4V2h4v2M5 4l.5 10h5L11 4"/>
            </svg>
          </button>
        )}
      </div>

      {/* Active glow */}
      {isActive && (
        <div className="absolute inset-0 ring-1 ring-inset ring-[var(--accent-cyan)] ring-opacity-50 pointer-events-none rounded-lg" />
      )}
    </motion.div>
  )
})

export default SlideThumbnail
