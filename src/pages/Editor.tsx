import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import EditorToolbar from '../components/editor/EditorToolbar'
import EditorPane from '../components/editor/EditorPane'
import PreviewPane from '../components/editor/PreviewPane'
import SlidesSidebar from '../components/editor/SlidesSidebar'
import UploadZone from '../components/editor/UploadZone'
import CommandPalette from '../components/ui/CommandPalette'

export default function Editor() {
  const [showUpload, setShowUpload] = useState(false)
  const [showCommand, setShowCommand] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommand(c => !c)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[var(--bg-void)]">
      <EditorToolbar
        onUpload={() => setShowUpload(true)}
        onCommandPalette={() => setShowCommand(true)}
      />

      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Slides sidebar */}
        <AnimatePresence initial={false}>
          {sidebarOpen && <SlidesSidebar />}
        </AnimatePresence>

        {/* Editor */}
        <div className="flex-1 overflow-hidden border-r border-[var(--border)]">
          <EditorPane className="h-full" />
        </div>

        {/* Preview */}
        <div className="w-[45%] hidden lg:flex flex-col">
          <PreviewPane className="flex-1" />
        </div>
      </div>

      {/* Status bar */}
      <div className="h-6 flex items-center px-4 gap-4 border-t border-[var(--border)] bg-[var(--bg-surface)] shrink-0">
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="text-[9px] font-mono text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors uppercase tracking-wider"
        >
          {sidebarOpen ? '◀ Hide' : '▶ Slides'}
        </button>
        <span className="hidden sm:inline text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
          ⌘K — Command palette
        </span>
        <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider ml-auto">
          Autosaved
        </span>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {showUpload && <UploadZone onClose={() => setShowUpload(false)} />}
      </AnimatePresence>

      <CommandPalette open={showCommand} onClose={() => setShowCommand(false)} />
    </div>
  )
}
