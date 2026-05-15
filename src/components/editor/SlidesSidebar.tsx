import { AnimatePresence } from 'framer-motion'
import { Layers, Plus } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import SlideThumbnail from '../presentation/SlideThumbnail'

export default function SlidesSidebar() {
  const store = useAppStore()
  const { presentation, currentSlideIndex, setCurrentSlideIndex, deleteSlide, duplicateSlide } = store

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] border-r border-[var(--border)] w-44 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--border)]">
        <div className="flex items-center gap-1.5">
          <Layers size={12} className="text-[var(--text-muted)]" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] font-[Syne]">
            Slides
          </span>
        </div>
        <span className="text-[10px] text-[var(--text-muted)] font-mono">
          {presentation.slides.length}
        </span>
      </div>

      {/* Slide list */}
      <div className="flex-1 overflow-y-auto py-2 px-2 flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {presentation.slides.map((slide, i) => (
            <SlideThumbnail
              key={slide.id}
              slide={slide}
              themeName={presentation.theme}
              index={i}
              isActive={i === currentSlideIndex}
              onClick={() => setCurrentSlideIndex(i)}
              onDelete={presentation.slides.length > 1 ? () => deleteSlide(i) : undefined}
              onDuplicate={() => duplicateSlide(i)}
            />
          ))}
        </AnimatePresence>

        {presentation.slides.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[var(--text-muted)] text-xs">No slides yet</p>
            <p className="text-[var(--text-muted)] text-xs mt-1">Start writing to create slides</p>
          </div>
        )}
      </div>
    </div>
  )
}
