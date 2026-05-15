import type { Presentation } from '../types'
import { getTheme, getSlideStyles } from './themes'

export function exportToHTML(presentation: Presentation): void {
  const theme = getTheme(presentation.theme)
  const styles = getSlideStyles(theme)

  const slidesHTML = presentation.slides.map((slide, i) => {
    const isLast = i === presentation.slides.length - 1
    return `
    <div class="slide" id="slide-${i + 1}" style="${isLast ? '' : 'page-break-after: always;'}">
      ${slide.mode === 'html' ? slide.content : `<div class="md-content">${slide.content}</div>`}
    </div>`
  }).join('\n')

  const bgStyle = typeof styles.background === 'string' ? styles.background : styles.background

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${presentation.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: '${theme.bodyFont}', sans-serif;
      background: ${bgStyle};
      color: ${theme.text};
    }
    .slide {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 8%;
      overflow: hidden;
    }
    h1, h2, h3 { font-family: '${theme.headingFont}', sans-serif; }
    h1 { font-size: clamp(2rem, 5vw, 4rem); font-weight: 700; margin-bottom: 1rem; }
    h2 { font-size: clamp(1.5rem, 3.5vw, 2.5rem); font-weight: 600; margin-bottom: 0.75rem; }
    h3 { font-size: clamp(1.25rem, 2.5vw, 1.75rem); font-weight: 600; margin-bottom: 0.5rem; }
    p { font-size: clamp(1rem, 2vw, 1.35rem); line-height: 1.7; margin-bottom: 1rem; }
    ul, ol { padding-left: 1.5em; font-size: clamp(1rem, 2vw, 1.25rem); }
    li { margin-bottom: 0.5em; }
    code { font-family: 'JetBrains Mono', monospace; font-size: 0.875em; padding: 0.15em 0.4em; background: ${theme.surface}; border-radius: 4px; }
    pre { background: ${theme.surface}; padding: 1.5rem; border-radius: 12px; overflow: auto; }
    blockquote { border-left: 3px solid ${theme.accent}; padding-left: 1.5rem; opacity: 0.85; }

    .controls {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      display: flex;
      gap: 0.5rem;
      z-index: 100;
    }
    .btn {
      background: ${theme.surface};
      border: 1px solid ${theme.border};
      color: ${theme.text};
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-family: '${theme.bodyFont}', sans-serif;
      font-size: 14px;
    }
    .btn:hover { opacity: 0.8; }

    .progress {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      letter-spacing: 0.1em;
      opacity: 0.5;
    }

    @media print {
      .controls, .progress { display: none; }
      .slide { page-break-after: always; }
    }
  </style>
</head>
<body>
  ${slidesHTML}

  <div class="controls">
    <button class="btn" onclick="prevSlide()">←</button>
    <button class="btn" onclick="nextSlide()">→</button>
  </div>
  <div class="progress" id="progress">1 / ${presentation.slides.length}</div>

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

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
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
