import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import { sanitizeHTML } from '../../lib/sanitize'
import type { Slide, Theme } from '../../types'
import 'highlight.js/styles/github-dark.css'

interface Props {
  slide: Slide
  theme: Theme
  scale?: number
  className?: string
}

export default function SlideRenderer({ slide, theme, scale = 1, className = '' }: Props) {
  const isGradient = theme.bg.startsWith('linear-gradient') || theme.bg.startsWith('radial-gradient')

  const containerStyle: React.CSSProperties = {
    background: isGradient ? theme.bg : theme.bg,
    color: theme.text,
    fontFamily: `'${theme.bodyFont}', sans-serif`,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: `${8 * scale}%`,
    overflow: 'hidden',
    position: 'relative',
  }

  const headingStyle: React.CSSProperties = {
    fontFamily: `'${theme.headingFont}', sans-serif`,
    color: theme.text,
  }

  const accentStyle: React.CSSProperties = {
    color: theme.accent,
  }

  return (
    <div style={containerStyle} className={`theme-${theme.name} ${className}`}>
      {/* Futuristic scanline effect */}
      {theme.name === 'futuristic' && (
        <>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0,255,136,0.03) 2px,
                rgba(0,255,136,0.03) 4px
              )`,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 40px,
                rgba(0,255,136,0.02) 40px,
                rgba(0,255,136,0.02) 41px
              )`,
            }}
          />
        </>
      )}

      {/* Glassmorphism overlay */}
      {theme.name === 'glassmorphism' && (
        <>
          <div
            className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: '#8b5cf6', top: '-10%', right: '-10%' }}
          />
          <div
            className="absolute w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ background: '#00d9ff', bottom: '-5%', left: '5%' }}
          />
        </>
      )}

      {/* Content */}
      <div
        className="slide-content relative z-10 w-full max-w-4xl"
        style={{
          fontSize: `${scale}rem`,
        }}
      >
        {slide.mode === 'markdown' ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              h1: ({ children }) => (
                <h1
                  style={{
                    ...headingStyle,
                    fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                    marginBottom: '1rem',
                  }}
                >
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2
                  style={{
                    ...headingStyle,
                    fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    marginBottom: '0.75rem',
                  }}
                >
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3
                  style={{
                    ...headingStyle,
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.75rem)',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                  }}
                >
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p
                  style={{
                    fontSize: 'clamp(0.95rem, 2vw, 1.3rem)',
                    lineHeight: 1.7,
                    marginBottom: '1rem',
                    opacity: 0.9,
                  }}
                >
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul
                  style={{
                    paddingLeft: '1.5em',
                    fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)',
                    lineHeight: 1.8,
                    marginBottom: '1rem',
                  }}
                >
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol
                  style={{
                    paddingLeft: '1.5em',
                    fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)',
                    lineHeight: 1.8,
                    marginBottom: '1rem',
                  }}
                >
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li style={{ marginBottom: '0.4em' }}>{children}</li>
              ),
              code: ({ children, className: cls }) => {
                const isBlock = cls?.includes('language-')
                if (!isBlock) {
                  return (
                    <code
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.85em',
                        padding: '0.15em 0.4em',
                        background: theme.surface,
                        borderRadius: '4px',
                        color: theme.accent,
                      }}
                    >
                      {children}
                    </code>
                  )
                }
                return <code className={cls}>{children}</code>
              },
              pre: ({ children }) => (
                <pre
                  style={{
                    background: theme.name === 'minimal' || theme.name === 'editorial'
                      ? 'rgba(0,0,0,0.06)'
                      : 'rgba(0,0,0,0.4)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    overflow: 'auto',
                    marginBottom: '1rem',
                    border: `1px solid ${theme.border}`,
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
                  }}
                >
                  {children}
                </pre>
              ),
              blockquote: ({ children }) => (
                <blockquote
                  style={{
                    borderLeft: `3px solid ${theme.accent}`,
                    paddingLeft: '1.5rem',
                    fontStyle: 'italic',
                    opacity: 0.85,
                    marginBottom: '1rem',
                    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  }}
                >
                  {children}
                </blockquote>
              ),
              strong: ({ children }) => (
                <strong style={{ color: theme.accent, fontWeight: 700 }}>{children}</strong>
              ),
              a: ({ href, children }) => (
                <a href={href} style={{ color: theme.accent, textDecoration: 'underline', textUnderlineOffset: '3px' }} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              table: ({ children }) => (
                <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'clamp(0.8rem, 1.6vw, 1rem)' }}>
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  borderBottom: `2px solid ${theme.border}`,
                  fontFamily: `'Syne', sans-serif`,
                  fontWeight: 600,
                  fontSize: '0.9em',
                  color: theme.accent,
                }}>
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td style={{
                  padding: '0.75rem 1rem',
                  borderBottom: `1px solid ${theme.border}`,
                }}>
                  {children}
                </td>
              ),
            }}
          >
            {slide.content}
          </ReactMarkdown>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(slide.content) }}
            style={{
              width: '100%',
            }}
          />
        )}
      </div>
    </div>
  )
}
