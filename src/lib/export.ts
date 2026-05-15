import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import type { Presentation } from '../types'
import { getTheme } from './themes'

function markdownToHTML(content: string): string {
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .processSync(content)
  return String(file)
}

// highlight.js github-dark theme inlined so the export is self-contained
const HLJS_CSS = `
.hljs{color:#c9d1d9;background:#0d1117}.hljs-doctag,.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language_{color:#ff7b72}.hljs-title,.hljs-title.class_,.hljs-title.class_.inherited__,.hljs-title.function_{color:#d2a8ff}.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-variable{color:#79c0ff}.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#a5d6ff}.hljs-built_in,.hljs-symbol{color:#ffa657}.hljs-code,.hljs-comment,.hljs-formula{color:#8b949e}.hljs-name,.hljs-quote,.hljs-selector-pseudo,.hljs-selector-tag{color:#7ee787}.hljs-subst{color:#c9d1d9}.hljs-section{color:#1f6feb;font-weight:700}.hljs-bullet{color:#f2cc60}.hljs-emphasis{color:#c9d1d9;font-style:italic}.hljs-strong{color:#c9d1d9;font-weight:700}.hljs-addition{color:#aff5b4;background-color:#033a16}.hljs-deletion{color:#ffdcd7;background-color:#67060c}
`

export function exportToHTML(presentation: Presentation): void {
  const theme = getTheme(presentation.theme)

  const slidesHTML = presentation.slides.map((slide, i) => {
    const content = slide.mode === 'markdown'
      ? markdownToHTML(slide.rawContent)
      : slide.content

    const isLast = i === presentation.slides.length - 1
    return `<div class="slide" id="slide-${i + 1}" style="${isLast ? '' : 'display:none;'}">${content}</div>`
  }).join('\n')

  const themeBg = theme.bg
  const isGradient = themeBg.startsWith('linear-gradient') || themeBg.startsWith('radial-gradient')

  const futuristicOverlay = theme.name === 'futuristic' ? `
    .slide::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,255,136,0.03) 2px,
        rgba(0,255,136,0.03) 4px
      );
      pointer-events: none;
    }` : ''

  const glassmorphismOverlay = theme.name === 'glassmorphism' ? `
    .slide::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 90% -10%, rgba(139,92,246,0.2) 0%, transparent 50%),
        radial-gradient(circle at 5% 105%, rgba(0,217,255,0.15) 0%, transparent 40%);
      pointer-events: none;
    }` : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${presentation.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
  <style>
    /* highlight.js */
    ${HLJS_CSS}

    * { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: ${isGradient ? '#0a0a2e' : theme.bg};
    }

    .slide {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 8%;
      overflow: hidden;
      background: ${themeBg};
      color: ${theme.text};
      font-family: '${theme.bodyFont}', sans-serif;
      text-align: center;
    }
    ${futuristicOverlay}
    ${glassmorphismOverlay}

    .slide > * { position: relative; z-index: 1; }

    /* content wrapper */
    .slide > * { width: 100%; max-width: 900px; }

    h1, h2, h3, h4 {
      font-family: '${theme.headingFont}', sans-serif;
      color: ${theme.text};
      letter-spacing: -0.02em;
      line-height: 1.15;
    }
    h1 {
      font-size: clamp(1.8rem, 5vw, 3.5rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 1rem;
    }
    h2 {
      font-size: clamp(1.4rem, 3.5vw, 2.5rem);
      font-weight: 700;
      margin-bottom: 0.75rem;
    }
    h3 {
      font-size: clamp(1.1rem, 2.5vw, 1.75rem);
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    p {
      font-size: clamp(0.95rem, 2vw, 1.3rem);
      line-height: 1.7;
      margin-bottom: 1rem;
      opacity: 0.9;
    }
    ul, ol {
      padding-left: 1.5em;
      font-size: clamp(0.9rem, 1.8vw, 1.2rem);
      line-height: 1.8;
      margin-bottom: 1rem;
      text-align: left;
      display: inline-block;
      width: 100%;
    }
    li { margin-bottom: 0.4em; }
    strong { color: ${theme.accent}; font-weight: 700; }
    a { color: ${theme.accent}; text-decoration: underline; text-underline-offset: 3px; }
    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85em;
      padding: 0.15em 0.4em;
      background: ${theme.surface};
      border-radius: 4px;
      color: ${theme.accent};
    }
    pre {
      background: ${theme.name === 'minimal' || theme.name === 'editorial' ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.4)'};
      border-radius: 12px;
      padding: 1.5rem;
      overflow: auto;
      margin-bottom: 1rem;
      border: 1px solid ${theme.border};
      font-size: clamp(0.75rem, 1.5vw, 0.9rem);
      text-align: left;
      width: 100%;
    }
    pre code {
      background: transparent;
      padding: 0;
      color: inherit;
      font-size: inherit;
    }
    blockquote {
      border-left: 3px solid ${theme.accent};
      padding-left: 1.5rem;
      font-style: italic;
      opacity: 0.85;
      margin-bottom: 1rem;
      font-size: clamp(1rem, 2vw, 1.25rem);
      text-align: left;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: clamp(0.8rem, 1.6vw, 1rem);
      margin-bottom: 1rem;
      text-align: left;
    }
    th {
      padding: 0.75rem 1rem;
      border-bottom: 2px solid ${theme.border};
      font-family: 'Syne', sans-serif;
      font-weight: 600;
      font-size: 0.9em;
      color: ${theme.accent};
    }
    td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid ${theme.border};
    }

    /* nav */
    .controls {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      display: flex;
      gap: 0.5rem;
      z-index: 200;
      opacity: 0;
      transition: opacity 0.3s;
    }
    body:hover .controls { opacity: 1; }
    .btn {
      background: ${theme.surface};
      border: 1px solid ${theme.border};
      color: ${theme.text};
      padding: 0.4rem 0.9rem;
      border-radius: 8px;
      cursor: pointer;
      font-family: '${theme.bodyFont}', sans-serif;
      font-size: 14px;
    }
    .btn:hover { opacity: 0.7; }
    .progress {
      position: fixed;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.1em;
      opacity: 0;
      transition: opacity 0.3s;
      color: ${theme.text};
      pointer-events: none;
    }
    body:hover .progress { opacity: 0.5; }

    @media print {
      .controls, .progress { display: none; }
      .slide {
        position: relative;
        page-break-after: always;
        display: flex !important;
        height: 100vh;
      }
    }
  </style>
</head>
<body>
  ${slidesHTML}

  <div class="controls">
    <button class="btn" onclick="prevSlide()">←</button>
    <button class="btn" onclick="nextSlide()">→</button>
  </div>
  <div class="progress" id="progress"></div>

  <script>
    const slides = document.querySelectorAll('.slide');
    let current = 0;

    function show(n) {
      slides.forEach((s, i) => s.style.display = i === n ? 'flex' : 'none');
      document.getElementById('progress').textContent = (n + 1) + ' / ' + slides.length;
      current = n;
    }

    function nextSlide() { if (current < slides.length - 1) show(current + 1); }
    function prevSlide() { if (current > 0) show(current - 1); }

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
    });

    show(0);
  <\/script>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${presentation.title.toLowerCase().replace(/\s+/g, '-')}.html`
  a.click()
  URL.revokeObjectURL(url)
}
