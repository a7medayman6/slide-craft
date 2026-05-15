import { useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Layers, Search, MoreHorizontal, Trash2,
  Copy, Play, Edit3, Download, ArrowLeft, Clock
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { getTheme } from '../lib/themes'
import SlideRenderer from '../components/presentation/SlideRenderer'
import type { Presentation } from '../types'

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return new Date(ts).toLocaleDateString()
}

const CARD_W = 320
const CARD_H = 180
const SLIDE_W = 1280
const SLIDE_H = 720
const SCALE = CARD_W / SLIDE_W

interface DeckCardProps {
  pres: Presentation
  onOpen: () => void
  onDuplicate: () => void
  onDelete: () => void
  onPresent: () => void
  onExport: () => void
}

const DeckCard = forwardRef<HTMLDivElement, DeckCardProps>(function DeckCard(
  { pres, onOpen, onDuplicate, onDelete, onPresent, onExport },
  ref
) {
  const [menuOpen, setMenuOpen] = useState(false)
  const theme = getTheme(pres.theme)
  const firstSlide = pres.slides[0]

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--bg-surface)] transition-colors cursor-pointer"
      style={{ width: CARD_W }}
    >
      {/* Thumbnail */}
      <div
        className="relative overflow-hidden"
        style={{ height: CARD_H }}
        onClick={onOpen}
      >
        {firstSlide ? (
          <div
            style={{
              width: SLIDE_W,
              height: SLIDE_H,
              transform: `scale(${SCALE})`,
              transformOrigin: 'top left',
              pointerEvents: 'none',
            }}
          >
            <SlideRenderer slide={firstSlide} theme={theme} />
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: theme.bg }}
          >
            <Layers size={32} style={{ color: theme.textMuted, opacity: 0.4 }} />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={e => { e.stopPropagation(); onOpen() }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[var(--accent-cyan)] text-black text-xs font-semibold rounded-xl hover:brightness-110 transition-all font-[Syne]"
            >
              <Edit3 size={12} />
              Edit
            </button>
            <button
              onClick={e => { e.stopPropagation(); onPresent() }}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/20 text-white text-xs font-semibold rounded-xl hover:bg-white/30 transition-all backdrop-blur-sm font-[Syne]"
            >
              <Play size={12} />
              Present
            </button>
          </div>
        </div>

        {/* Slide count badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-white text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
          {pres.slides.length} slides
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate font-[Syne]">
            {pres.title}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div
              className="w-2 h-2 rounded-sm shrink-0"
              style={{ background: theme.bg.startsWith('linear') ? theme.accent : theme.bg, border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <p className="text-[10px] text-[var(--text-muted)] truncate">
              {theme.label} · {timeAgo(pres.updatedAt)}
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="relative ml-2 shrink-0">
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(o => !o) }}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal size={14} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 bottom-full mb-1 w-44 glass-strong rounded-xl overflow-hidden z-20 shadow-xl"
                >
                  {[
                    { icon: <Edit3 size={13} />, label: 'Open in editor', action: onOpen },
                    { icon: <Play size={13} />, label: 'Present', action: onPresent },
                    { icon: <Copy size={13} />, label: 'Duplicate', action: onDuplicate },
                    { icon: <Download size={13} />, label: 'Export HTML', action: onExport },
                    { icon: <Trash2 size={13} />, label: 'Delete', action: onDelete, danger: true },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={e => { e.stopPropagation(); item.action(); setMenuOpen(false) }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors hover:bg-[var(--bg-elevated)] ${
                        item.danger ? 'text-[var(--accent-coral)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
})

export default function Decks() {
  const navigate = useNavigate()
  const store = useAppStore()
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = store.presentations.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleOpen = (id: string) => {
    store.openPresentation(id)
    navigate('/editor')
  }

  const handlePresent = (id: string) => {
    store.openPresentation(id)
    store.setCurrentSlideIndex(0)
    navigate('/present')
  }

  const handleNew = () => {
    const id = store.createPresentation()
    navigate('/editor')
  }

  const handleDuplicate = (id: string) => {
    store.duplicatePresentation(id)
    navigate('/editor')
  }

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      store.deletePresentation(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const handleExport = (id: string) => {
    store.openPresentation(id)
    setTimeout(() => store.exportHTML(), 50)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-void)]">
      {/* Grid bg */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          {/* Left: logo + back */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-violet)] flex items-center justify-center">
                <Layers size={13} className="text-black" />
              </div>
              <span className="font-display font-bold text-[var(--text-primary)]">DeckCraft</span>
            </div>
            <span className="text-[var(--border-strong)]">/</span>
            <span className="text-sm text-[var(--text-secondary)] font-[Syne]">My Decks</span>
          </div>

          {/* Right: search + new */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search decks…"
                className="w-52 pl-8 pr-3 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--border-accent)] transition-colors"
              />
            </div>
            <motion.button
              onClick={handleNew}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-cyan)] text-black text-sm font-semibold rounded-xl hover:brightness-110 transition-all font-[Syne]"
            >
              <Plus size={15} />
              New Deck
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        {/* Stats row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
              My Presentations
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              {store.presentations.length} deck{store.presentations.length !== 1 ? 's' : ''} saved locally
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] font-mono">
            <Clock size={11} />
            Sorted by last modified
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="flex flex-wrap gap-5"
          >
            {/* New deck card */}
            <motion.button
              onClick={handleNew}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-[var(--accent-cyan)] hover:border-opacity-50 text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-all group"
              style={{ width: CARD_W, height: CARD_H + 60 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] group-hover:border-[var(--accent-cyan)] group-hover:border-opacity-30 flex items-center justify-center transition-all">
                <Plus size={20} />
              </div>
              <span className="text-sm font-medium font-[Syne]">New Deck</span>
            </motion.button>

            <AnimatePresence mode="popLayout">
              {filtered
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map(pres => (
                  <DeckCard
                    key={pres.id}
                    pres={pres}
                    onOpen={() => handleOpen(pres.id)}
                    onDuplicate={() => handleDuplicate(pres.id)}
                    onDelete={() => handleDelete(pres.id)}
                    onPresent={() => handlePresent(pres.id)}
                    onExport={() => handleExport(pres.id)}
                  />
                ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            {search ? (
              <>
                <Search size={40} className="text-[var(--text-muted)] mb-4 opacity-40" />
                <p className="text-[var(--text-secondary)] font-medium">No decks match "{search}"</p>
                <p className="text-[var(--text-muted)] text-sm mt-1">Try a different search term</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center mb-6">
                  <Layers size={32} className="text-[var(--text-muted)] opacity-50" />
                </div>
                <p className="text-[var(--text-secondary)] text-lg font-medium font-[Syne]">No presentations yet</p>
                <p className="text-[var(--text-muted)] text-sm mt-1 mb-6">Create your first deck to get started</p>
                <motion.button
                  onClick={handleNew}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 bg-[var(--accent-cyan)] text-black font-semibold rounded-xl text-sm font-[Syne]"
                >
                  <Plus size={16} />
                  Create First Deck
                </motion.button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete confirm toast */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-strong border border-[var(--accent-coral)] border-opacity-30 rounded-2xl px-5 py-3 flex items-center gap-3 z-50 shadow-xl"
          >
            <Trash2 size={14} className="text-[var(--accent-coral)]" />
            <span className="text-sm text-[var(--text-secondary)]">Click delete again to confirm</span>
            <button
              onClick={() => setDeleteConfirm(null)}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] ml-2"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
