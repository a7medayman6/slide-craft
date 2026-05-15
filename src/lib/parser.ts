import type { Slide, InputMode } from '../types'

let idCounter = 0
function uid() {
  return `slide-${Date.now()}-${++idCounter}`
}

export function parseMarkdown(content: string): Slide[] {
  const parts = content.split(/\n---\n/)
  return parts
    .map((part, i) => ({
      id: uid(),
      content: part.trim(),
      rawContent: part.trim(),
      mode: 'markdown' as InputMode,
      index: i,
    }))
    .filter(s => s.content.length > 0)
}

export function parseHTML(content: string): Slide[] {
  // Try slide comment separator first
  const commentSplit = content.split(/<!--\s*slide\s*-->/)
  if (commentSplit.length > 1) {
    return commentSplit
      .map((part, i) => ({
        id: uid(),
        content: part.trim(),
        rawContent: part.trim(),
        mode: 'html' as InputMode,
        index: i,
      }))
      .filter(s => s.content.length > 0)
  }

  // Try <section class="slide"> separator
  const parser = new DOMParser()
  const doc = parser.parseFromString(content, 'text/html')
  const sections = doc.querySelectorAll('section.slide, section[data-slide]')

  if (sections.length > 0) {
    return Array.from(sections).map((section, i) => ({
      id: uid(),
      content: section.outerHTML,
      rawContent: section.outerHTML,
      mode: 'html' as InputMode,
      index: i,
    }))
  }

  // Fallback: treat entire content as one slide
  return [
    {
      id: uid(),
      content: content.trim(),
      rawContent: content.trim(),
      mode: 'html' as InputMode,
      index: 0,
    },
  ]
}

export function parseContent(content: string, mode: InputMode): Slide[] {
  if (!content.trim()) return []
  return mode === 'markdown' ? parseMarkdown(content) : parseHTML(content)
}

export function extractTitle(slides: Slide[], mode: InputMode): string {
  if (slides.length === 0) return 'Untitled Presentation'

  const first = slides[0]
  if (mode === 'markdown') {
    const match = first.content.match(/^#\s+(.+)/m)
    return match ? match[1].trim() : 'Untitled Presentation'
  } else {
    const parser = new DOMParser()
    const doc = parser.parseFromString(first.content, 'text/html')
    const h1 = doc.querySelector('h1')
    return h1?.textContent?.trim() || 'Untitled Presentation'
  }
}
