import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, InputMode, ThemeName, TransitionName, Presentation } from '../types'
import { parseContent, extractTitle } from '../lib/parser'
import { exportToHTML } from '../lib/export'

const DEFAULT_CONTENT = `# Welcome to DeckCraft

Transform your documents into stunning presentations

---

# How It Works

- Write in **Markdown** or **HTML**
- Slides are separated by \`---\`
- Pick a theme and present

---

# Beautiful Themes

Choose from 5 carefully crafted themes:

- **Minimal** — Clean, distraction-free
- **Startup** — Bold and electric
- **Glass** — Frosted panels
- **Editorial** — Magazine quality
- **Cyber** — Terminal aesthetic

---

# Code Support

\`\`\`javascript
function createPresentation(markdown) {
  const slides = markdown.split('---')
  return slides.map(renderSlide)
}
\`\`\`

Syntax highlighting included.

---

# Ready to Present?

Click **Present** to enter fullscreen mode

Use ← → arrow keys to navigate

Press **Escape** to exit
`

function makePresentation(content: string, mode: InputMode, title?: string): Presentation {
  const slides = parseContent(content, mode)
  return {
    id: `pres-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: title ?? extractTitle(slides, mode),
    rawContent: content,
    mode,
    theme: 'startup',
    transition: 'slide',
    slides,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

function updatePresentation(
  presentations: Presentation[],
  id: string,
  updater: (p: Presentation) => Presentation
): Presentation[] {
  return presentations.map(p => (p.id === id ? updater(p) : p))
}

const FALLBACK = makePresentation(DEFAULT_CONTENT, 'markdown')

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      presentations: [FALLBACK],
      currentPresentationId: FALLBACK.id,
      currentSlideIndex: 0,

      // Derived getter
      get presentation() {
        const { presentations, currentPresentationId } = get()
        return presentations.find(p => p.id === currentPresentationId) ?? presentations[0]
      },

      // ── Presentation list management ──────────────────────────────────

      createPresentation: (content = DEFAULT_CONTENT, mode: InputMode = 'markdown') => {
        const pres = makePresentation(content, mode)
        set(state => ({
          presentations: [pres, ...state.presentations],
          currentPresentationId: pres.id,
          currentSlideIndex: 0,
        }))
        return pres.id
      },

      openPresentation: (id: string) => {
        set({ currentPresentationId: id, currentSlideIndex: 0 })
      },

      deletePresentation: (id: string) => {
        set(state => {
          const remaining = state.presentations.filter(p => p.id !== id)
          if (remaining.length === 0) {
            const fresh = makePresentation(DEFAULT_CONTENT, 'markdown')
            return { presentations: [fresh], currentPresentationId: fresh.id, currentSlideIndex: 0 }
          }
          const nextId =
            state.currentPresentationId === id
              ? remaining[0].id
              : state.currentPresentationId
          return { presentations: remaining, currentPresentationId: nextId, currentSlideIndex: 0 }
        })
      },

      duplicatePresentation: (id: string) => {
        const source = get().presentations.find(p => p.id === id)
        if (!source) return id
        const copy: Presentation = {
          ...source,
          id: `pres-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title: `${source.title} (copy)`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          slides: source.slides.map(s => ({ ...s, id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` })),
        }
        set(state => ({
          presentations: [copy, ...state.presentations],
          currentPresentationId: copy.id,
          currentSlideIndex: 0,
        }))
        return copy.id
      },

      // ── Active presentation mutations ─────────────────────────────────

      setContent: (content: string, mode?: InputMode) => {
        const { currentPresentationId, presentations } = get()
        const current = presentations.find(p => p.id === currentPresentationId)
        if (!current) return
        const currentMode = mode ?? current.mode
        const slides = parseContent(content, currentMode)
        const title = extractTitle(slides, currentMode)
        set(state => ({
          presentations: updatePresentation(state.presentations, currentPresentationId, p => ({
            ...p,
            rawContent: content,
            mode: currentMode,
            slides,
            title,
            updatedAt: Date.now(),
          })),
          currentSlideIndex: Math.min(state.currentSlideIndex, Math.max(0, slides.length - 1)),
        }))
      },

      setTheme: (theme: ThemeName) => {
        const id = get().currentPresentationId
        set(state => ({
          presentations: updatePresentation(state.presentations, id, p => ({
            ...p, theme, updatedAt: Date.now(),
          })),
        }))
      },

      setTransition: (transition: TransitionName) => {
        const id = get().currentPresentationId
        set(state => ({
          presentations: updatePresentation(state.presentations, id, p => ({
            ...p, transition, updatedAt: Date.now(),
          })),
        }))
      },

      setTitle: (title: string) => {
        const id = get().currentPresentationId
        set(state => ({
          presentations: updatePresentation(state.presentations, id, p => ({
            ...p, title, updatedAt: Date.now(),
          })),
        }))
      },

      // ── Slide navigation ──────────────────────────────────────────────

      setCurrentSlideIndex: (index: number) => {
        const slides = get().presentation.slides
        set({ currentSlideIndex: Math.max(0, Math.min(index, slides.length - 1)) })
      },

      nextSlide: () => {
        const { currentSlideIndex, presentation } = get()
        set({ currentSlideIndex: Math.min(currentSlideIndex + 1, presentation.slides.length - 1) })
      },

      prevSlide: () => {
        set(state => ({ currentSlideIndex: Math.max(0, state.currentSlideIndex - 1) }))
      },

      // ── Slide CRUD ────────────────────────────────────────────────────

      reorderSlides: (from: number, to: number) => {
        const id = get().currentPresentationId
        set(state => ({
          presentations: updatePresentation(state.presentations, id, p => {
            const slides = [...p.slides]
            const [moved] = slides.splice(from, 1)
            slides.splice(to, 0, moved)
            return { ...p, slides: slides.map((s, i) => ({ ...s, index: i })), updatedAt: Date.now() }
          }),
        }))
      },

      deleteSlide: (index: number) => {
        const id = get().currentPresentationId
        set(state => {
          let nextSlideIndex = state.currentSlideIndex
          const updated = updatePresentation(state.presentations, id, p => {
            const slides = p.slides.filter((_, i) => i !== index).map((s, i) => ({ ...s, index: i }))
            nextSlideIndex = Math.min(state.currentSlideIndex, Math.max(0, slides.length - 1))
            return { ...p, slides, updatedAt: Date.now() }
          })
          return { presentations: updated, currentSlideIndex: nextSlideIndex }
        })
      },

      duplicateSlide: (index: number) => {
        const id = get().currentPresentationId
        set(state => ({
          presentations: updatePresentation(state.presentations, id, p => {
            const slides = [...p.slides]
            const copy = { ...slides[index], id: `slide-${Date.now()}`, index: index + 1 }
            slides.splice(index + 1, 0, copy)
            return { ...p, slides: slides.map((s, i) => ({ ...s, index: i })), updatedAt: Date.now() }
          }),
        }))
      },

      // ── Export ────────────────────────────────────────────────────────

      exportHTML: () => {
        exportToHTML(get().presentation)
      },
    }),
    {
      name: 'deckcraft-state-v2',
      partialize: state => ({
        presentations: state.presentations,
        currentPresentationId: state.currentPresentationId,
        currentSlideIndex: state.currentSlideIndex,
      }),
      // Migrate from old single-presentation format
      migrate: (persisted: any) => {
        if (persisted?.presentation && !persisted?.presentations) {
          return {
            presentations: [persisted.presentation],
            currentPresentationId: persisted.presentation.id,
            currentSlideIndex: persisted.currentSlideIndex ?? 0,
          }
        }
        return persisted
      },
      version: 2,
    }
  )
)
