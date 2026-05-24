import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, MessageSquare, ClipboardCopy, Zap, ArrowRight, Bot } from 'lucide-react'
import { AI_SYSTEM_PROMPT } from '../../lib/aiPrompt'

const STEPS = [
  {
    n: '01',
    icon: <ClipboardCopy size={18} />,
    title: 'Copy the system prompt',
    desc: 'Grab the ready-made prompt below — it teaches any AI the exact SlideCraft slide format.',
    color: 'var(--accent-cyan)',
  },
  {
    n: '02',
    icon: <MessageSquare size={18} />,
    title: 'Chat with any AI',
    desc: 'Paste it into Claude, ChatGPT, or Gemini. Fill in the variables: topic, audience, tone, slide count.',
    color: 'var(--accent-violet)',
  },
  {
    n: '03',
    icon: <Zap size={18} />,
    title: 'Paste & present',
    desc: 'Copy the AI output, paste it into SlideCraft\'s editor, pick a theme, and hit Present.',
    color: 'var(--accent-amber)',
  },
]

const VARIABLE_COLOR = 'var(--accent-amber)'
const KEYWORD_COLOR = 'var(--accent-cyan)'
const COMMENT_COLOR = 'var(--text-muted)'
const SEPARATOR_COLOR = 'var(--accent-violet)'

function PromptLine({ line }: { line: string }) {
  if (line === '') return <br />

  if (line.startsWith('---')) {
    return (
      <div>
        <span style={{ color: SEPARATOR_COLOR, opacity: 0.8 }}>---</span>
      </div>
    )
  }

  if (line.startsWith('## ') || line.startsWith('# ')) {
    const hashes = line.match(/^#+/)?.[0] ?? ''
    const rest = line.slice(hashes.length)
    return (
      <div>
        <span style={{ color: KEYWORD_COLOR, opacity: 0.6 }}>{hashes}</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{rest}</span>
      </div>
    )
  }

  // Highlight {{VARIABLES}}
  const parts = line.split(/({{[^}]+}})/g)
  if (parts.length > 1) {
    return (
      <div>
        {parts.map((part, i) =>
          part.startsWith('{{') ? (
            <span key={i} style={{ color: VARIABLE_COLOR, fontWeight: 600 }}>{part}</span>
          ) : (
            <span key={i} style={{ color: 'var(--text-secondary)' }}>{part}</span>
          )
        )}
      </div>
    )
  }

  if (line.startsWith('-')) {
    return (
      <div>
        <span style={{ color: SEPARATOR_COLOR, opacity: 0.7 }}>-</span>
        <span style={{ color: 'var(--text-secondary)' }}>{line.slice(1)}</span>
      </div>
    )
  }

  if (line.startsWith('`')) {
    return <div style={{ color: 'var(--accent-green)', opacity: 0.85 }}>{line}</div>
  }

  return <div style={{ color: 'var(--text-secondary)' }}>{line}</div>
}

export default function AIWorkflowSection() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(AI_SYSTEM_PROMPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = AI_SYSTEM_PROMPT.split('\n')

  return (
    <section id="ai-workflow" className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 60% 40%, var(--accent-cyan), transparent 65%)' }}
      />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 70%, var(--accent-violet), transparent 60%)' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] text-xs text-[var(--text-muted)] mb-4 font-[Syne] uppercase tracking-wider">
            <Bot size={10} className="text-[var(--accent-cyan)]" />
            AI-Powered Workflow
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Generate slides with{' '}
            <span className="gradient-text">any AI</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Use Claude, ChatGPT, or Gemini to generate perfectly formatted slides.
            One prompt. Paste. Done.
          </p>
        </motion.div>

        {/* 3-step flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative"
            >
              <div className="glass rounded-2xl p-6 border border-[var(--border)] hover:border-[var(--border-strong)] transition-all h-full">
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${step.color}18`, color: step.color }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)] mb-1 tracking-widest">{step.n}</div>
                    <h3 className="font-display font-semibold text-[var(--text-primary)] text-sm mb-2">{step.title}</h3>
                    <p className="text-[var(--text-muted)] text-xs leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>

              {/* Connector arrow */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-2.5 z-10 -translate-y-1/2 items-center justify-center w-5 h-5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)]">
                  <ArrowRight size={10} className="text-[var(--text-muted)]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* System prompt display */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-strong rounded-2xl border border-[var(--border-strong)] overflow-hidden shadow-2xl shadow-black/40"
        >
          {/* Prompt header bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-[var(--border)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Bot size={13} className="text-[var(--accent-cyan)] shrink-0" />
                <span className="text-xs font-mono text-[var(--text-muted)] truncate">system-prompt.md</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--accent-amber)]/10 border border-[var(--accent-amber)]/20">
                <span className="text-[10px] font-mono text-[var(--accent-amber)]">3 variables to fill</span>
              </div>
            </div>

            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold font-[Syne] transition-all shrink-0"
              style={{
                background: copied ? 'var(--accent-green)' : 'var(--accent-cyan)',
                color: '#000',
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy Prompt'}
            </motion.button>
          </div>

          {/* Prompt content */}
          <div className="relative overflow-auto max-h-64 sm:max-h-80 p-4 sm:p-5 font-mono text-[11px] leading-[1.75] bg-[var(--bg-void)] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
            {/* Line numbers + content */}
            <div className="flex gap-4">
              <div className="select-none shrink-0 text-right" style={{ color: 'var(--text-muted)', opacity: 0.35 }}>
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                {lines.map((line, i) => (
                  <PromptLine key={i} line={line} />
                ))}
              </div>
            </div>

            {/* Bottom fade */}
            <div className="sticky bottom-0 left-0 right-0 h-12 pointer-events-none bg-gradient-to-t from-[var(--bg-void)] to-transparent" />
          </div>

          {/* Footer hint */}
          <div className="px-4 sm:px-5 py-3 border-t border-[var(--border)] bg-[var(--bg-surface)] flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] font-mono text-[var(--text-muted)]">Fill in</span>
            {['{{TOPIC}}', '{{AUDIENCE}}', '{{TONE}}', '{{SLIDE_COUNT}}', '{{CONTEXT}}'].map(v => (
              <span
                key={v}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--accent-amber)]/10 border border-[var(--accent-amber)]/20"
                style={{ color: 'var(--accent-amber)' }}
              >
                {v}
              </span>
            ))}
            <span className="text-[10px] font-mono text-[var(--text-muted)]">then paste the AI output into the editor</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
