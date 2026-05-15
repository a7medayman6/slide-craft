import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import type { InputMode } from '../../types'

interface Props {
  onClose: () => void
}

export default function UploadZone({ onClose }: Props) {
  const { setContent } = useAppStore()
  const [error, setError] = useState('')

  const onDrop = useCallback((accepted: File[]) => {
    const file = accepted[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      const content = e.target?.result as string
      const mode: InputMode = file.name.endsWith('.html') || file.name.endsWith('.htm')
        ? 'html'
        : 'markdown'
      setContent(content, mode)
      onClose()
    }
    reader.onerror = () => setError('Failed to read file')
    reader.readAsText(file)
  }, [setContent, onClose])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/markdown': ['.md', '.markdown'],
      'text/html': ['.html', '.htm'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    onDropRejected: () => setError('Please upload a .md, .html, or .txt file'),
  })

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-strong rounded-2xl p-8 w-full max-w-md mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">Upload File</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
            ${isDragActive
              ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)] bg-opacity-5'
              : 'border-[var(--border-strong)] hover:border-[var(--accent-cyan)] hover:bg-[var(--bg-elevated)]'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className={`p-4 rounded-full ${isDragActive ? 'bg-[var(--accent-cyan)] bg-opacity-15' : 'bg-[var(--bg-elevated)]'} transition-all`}>
              {isDragActive
                ? <Upload size={28} className="text-[var(--accent-cyan)]" />
                : <FileText size={28} className="text-[var(--text-secondary)]" />
              }
            </div>
            <div>
              <p className="text-[var(--text-primary)] font-medium">
                {isDragActive ? 'Drop it here' : 'Drop your file here'}
              </p>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                or <span className="text-[var(--accent-cyan)]">browse</span> to upload
              </p>
            </div>
            <p className="text-[var(--text-muted)] text-xs">
              Supports .md, .markdown, .html, .htm, .txt
            </p>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-[var(--accent-coral)] text-sm text-center">{error}</p>
        )}
      </motion.div>
    </div>
  )
}
