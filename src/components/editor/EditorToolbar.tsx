import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Download, Upload, Palette, ChevronDown, Type,
  Command, Layers, RotateCcw, Sun, Moon, Bot, Copy, Check
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { themeList } from '../../lib/themes'
import { Button } from '../ui/Button'
import { AI_SYSTEM_PROMPT } from '../../lib/aiPrompt'
import type { InputMode, ThemeName, TransitionName } from '../../types'
import { clsx } from 'clsx'

interface Props {
  onUpload: () => void
  onCommandPalette: () => void
}

const transitions: { id: TransitionName; label: string }[] = [
  { id: 'slide', label: 'Slide' },
  { id: 'fade', label: 'Fade' },
  { id: 'zoom', label: 'Zoom' },
  { id: 'flip', label: 'Flip' },
  { id: 'reveal', label: 'Reveal' },
]

export default function EditorToolbar({ onUpload, onCommandPalette }: Props) {
  const navigate = useNavigate()
  const store = useAppStore()
  const [themeOpen, setThemeOpen] = useState(false)
  const [transOpen, setTransOpen] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(AI_SYSTEM_PROMPT)
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2000)
  }

  const currentTheme = themeList.find(t => t.name === store.presentation.theme)

  const handlePresent = () => {
    store.setCurrentSlideIndex(0)
    navigate('/present')
  }

  const handleModeToggle = (mode: InputMode) => {
    store.setContent(store.presentation.rawContent, mode)
  }

  return (
    <div className="flex items-center justify-between h-12 px-4 border-b border-[var(--border)] bg-[var(--bg-surface)] shrink-0">
      {/* Left: Logo + breadcrumb + title */}
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="flex items-center gap-1.5 cursor-pointer group shrink-0"
          onClick={() => navigate('/decks')}
        >
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-violet)] flex items-center justify-center">
            <Layers size={12} className="text-black" />
          </div>
          <span className="font-display text-sm font-bold text-[var(--text-secondary)] group-hover:text-[var(--accent-cyan)] transition-colors hidden sm:block">
            Decks
          </span>
        </div>
        <span className="text-[var(--border-strong)] text-sm hidden sm:block">/</span>
        <input
          value={store.presentation.title}
          onChange={e => store.setTitle(e.target.value)}
          className="text-sm text-[var(--text-secondary)] bg-transparent border-none outline-none hover:text-[var(--text-primary)] focus:text-[var(--text-primary)] transition-colors min-w-0 max-w-48 truncate hidden sm:block"
          placeholder="Untitled"
        />
      </div>

      {/* Center: Mode toggle */}
      <div className="flex items-center gap-1 bg-[var(--bg-elevated)] rounded-lg p-1 border border-[var(--border)]">
        <button
          onClick={() => handleModeToggle('markdown')}
          className={clsx(
            'px-3 py-1 rounded-md text-xs font-medium transition-all',
            store.presentation.mode === 'markdown'
              ? 'bg-[var(--accent-cyan)] text-black'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          )}
        >
          Markdown
        </button>
        <button
          onClick={() => handleModeToggle('html')}
          className={clsx(
            'px-3 py-1 rounded-md text-xs font-medium transition-all',
            store.presentation.mode === 'html'
              ? 'bg-[var(--accent-cyan)] text-black'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          )}
        >
          HTML
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme selector */}
        <div className="relative">
          <button
            onClick={() => { setThemeOpen(!themeOpen); setTransOpen(false) }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-lg transition-all hidden sm:flex"
          >
            <Palette size={12} />
            <span>{currentTheme?.label ?? 'Theme'}</span>
            <ChevronDown size={12} className={clsx('transition-transform', themeOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {themeOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setThemeOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-1.5 w-56 glass-strong rounded-xl overflow-hidden z-20 shadow-xl"
                >
                  {themeList.map(t => (
                    <button
                      key={t.name}
                      onClick={() => { store.setTheme(t.name as ThemeName); setThemeOpen(false) }}
                      className={clsx(
                        'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--bg-elevated)]',
                        store.presentation.theme === t.name && 'bg-[var(--bg-elevated)]'
                      )}
                    >
                      <div
                        className="w-8 h-5 rounded-md border border-white/10 shrink-0"
                        style={{ background: t.bg.startsWith('linear') ? t.bg : t.bg }}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-[var(--text-primary)]">{t.label}</div>
                        <div className="text-[10px] text-[var(--text-muted)] truncate">{t.description}</div>
                      </div>
                      {store.presentation.theme === t.name && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] shrink-0" />
                      )}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* AI Prompt */}
        <motion.button
          onClick={handleCopyPrompt}
          whileTap={{ scale: 0.94 }}
          className={clsx(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border',
            promptCopied
              ? 'bg-[var(--accent-green)]/15 border-[var(--accent-green)]/30 text-[var(--accent-green)]'
              : 'text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/8 border-[var(--accent-cyan)]/20 hover:bg-[var(--accent-cyan)]/15 hover:border-[var(--accent-cyan)]/40'
          )}
          title="Copy AI system prompt for slide generation"
        >
          {promptCopied ? <Check size={13} /> : <Bot size={13} />}
          <span className="hidden sm:inline">{promptCopied ? 'Copied!' : 'AI Prompt'}</span>
        </motion.button>

        {/* Command palette */}
        <button
          onClick={onCommandPalette}
          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-lg transition-all"
          title="Command Palette (⌘K)"
        >
          <Command size={16} />
        </button>

        {/* Upload */}
        <button
          onClick={onUpload}
          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-lg transition-all hidden sm:block"
          title="Upload File"
        >
          <Upload size={16} />
        </button>

        {/* Export */}
        <button
          onClick={() => store.exportHTML()}
          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-lg transition-all hidden sm:block"
          title="Export HTML"
        >
          <Download size={16} />
        </button>

        {/* Present */}
        <Button variant="primary" size="sm" onClick={handlePresent}>
          <Play size={12} />
          <span className="hidden sm:inline">Present</span>
        </Button>
      </div>
    </div>
  )
}
