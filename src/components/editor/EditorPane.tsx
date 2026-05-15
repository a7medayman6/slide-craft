import { useCallback } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'
import { useAppStore } from '../../store/useAppStore'

const customTheme = EditorView.theme({
  '&': {
    background: 'var(--bg-void) !important',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontFamily: "'JetBrains Mono', monospace",
  },
  '.cm-content': {
    padding: '16px',
    caretColor: 'var(--accent-cyan)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  '.cm-cursor': {
    borderLeftColor: 'var(--accent-cyan)',
  },
  '.cm-gutters': {
    background: 'var(--bg-surface) !important',
    border: 'none',
    borderRight: '1px solid var(--border)',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    color: 'var(--text-muted)',
    paddingRight: '16px',
  },
  '.cm-activeLine': {
    background: 'rgba(0,217,255,0.04) !important',
  },
  '.cm-activeLineGutter': {
    background: 'rgba(0,217,255,0.04) !important',
  },
  '.cm-selectionBackground': {
    background: 'rgba(0,217,255,0.15) !important',
  },
  '&.cm-focused .cm-selectionBackground': {
    background: 'rgba(0,217,255,0.2) !important',
  },
  '.cm-matchingBracket': {
    background: 'rgba(0,217,255,0.2)',
    outline: '1px solid rgba(0,217,255,0.4)',
  },
  '.cm-scroller': {
    fontFamily: "'JetBrains Mono', monospace !important",
  },
})

interface Props {
  className?: string
}

export default function EditorPane({ className = '' }: Props) {
  const { presentation, setContent } = useAppStore()

  const handleChange = useCallback((value: string) => {
    setContent(value)
  }, [setContent])

  const extensions = [
    presentation.mode === 'markdown' ? markdown() : html(),
    customTheme,
    EditorView.lineWrapping,
  ]

  return (
    <div className={`flex flex-col h-full overflow-hidden ${className}`}>
      <CodeMirror
        value={presentation.rawContent}
        onChange={handleChange}
        extensions={extensions}
        theme={oneDark}
        height="100%"
        style={{ height: '100%', overflow: 'hidden' }}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          autocompletion: true,
          bracketMatching: true,
          closeBrackets: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
        }}
      />
    </div>
  )
}
