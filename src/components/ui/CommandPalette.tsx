import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Layers, Palette, Download, Play, Plus, Trash2, Copy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import type { ThemeName } from '../../types'

interface Command {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  shortcut?: string
  action: () => void
  group: string
}

interface Props {
  open: boolean
  onClose: () => void
}

export default function CommandPalette({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const store = useAppStore()

  const themes: ThemeName[] = ['minimal', 'startup', 'glassmorphism', 'editorial', 'futuristic']

  const commands: Command[] = [
    {
      id: 'present',
      label: 'Start Presentation',
      description: 'Enter fullscreen presentation mode',
      icon: <Play size={16} />,
      shortcut: 'P',
      group: 'Actions',
      action: () => { store.setIsPresenting(true); navigate('/present'); onClose() },
    },
    {
      id: 'export',
      label: 'Export to HTML',
      description: 'Download presentation as HTML file',
      icon: <Download size={16} />,
      shortcut: 'E',
      group: 'Actions',
      action: () => { store.exportHTML(); onClose() },
    },
    ...themes.map(t => ({
      id: `theme-${t}`,
      label: `Theme: ${t.charAt(0).toUpperCase() + t.slice(1)}`,
      description: 'Switch presentation theme',
      icon: <Palette size={16} />,
      group: 'Themes',
      action: () => { store.setTheme(t); onClose() },
    })),
    {
      id: 'slides',
      label: 'Slide Count',
      description: `${store.presentation.slides.length} slides`,
      icon: <Layers size={16} />,
      group: 'Info',
      action: () => onClose(),
    },
  ]

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.description?.toLowerCase().includes(query.toLowerCase()) ||
    c.group.toLowerCase().includes(query.toLowerCase())
  )

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = []
    acc[cmd.group].push(cmd)
    return acc
  }, {} as Record<string, Command[]>)

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
          >
            <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
                <Search size={16} className="text-[var(--text-muted)] shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Type a command..."
                  className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none text-sm font-[Outfit]"
                />
                <kbd className="text-[var(--text-muted)] text-xs border border-[var(--border)] px-1.5 py-0.5 rounded font-mono">ESC</kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto py-2">
                {Object.entries(grouped).map(([group, cmds]) => (
                  <div key={group}>
                    <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] font-[Syne]">
                      {group}
                    </div>
                    {cmds.map(cmd => (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg-elevated)] text-left transition-colors group"
                      >
                        <span className="text-[var(--text-muted)] group-hover:text-[var(--accent-cyan)] transition-colors">
                          {cmd.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-[var(--text-primary)]">{cmd.label}</div>
                          {cmd.description && (
                            <div className="text-xs text-[var(--text-muted)] truncate">{cmd.description}</div>
                          )}
                        </div>
                        {cmd.shortcut && (
                          <kbd className="text-[var(--text-muted)] text-xs border border-[var(--border)] px-1.5 py-0.5 rounded font-mono">
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="px-4 py-8 text-center text-[var(--text-muted)] text-sm">
                    No commands found
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
