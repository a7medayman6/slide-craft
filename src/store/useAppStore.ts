import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, InputMode, ThemeName, TransitionName, Presentation } from '../types'
import { parseContent, extractTitle } from '../lib/parser'
import { exportToHTML } from '../lib/export'

const DEFAULT_CONTENT = `# Welcome to SlideCraft

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

// Derive the active presentation from the list — used in every set() call
// so presentation is never a stale frozen value from a getter.
function sync(presentations: Presentation[], id: string): Presentation {
  return presentations.find(p => p.id === id) ?? presentations[0]
}

function updatePres(
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
      presentation: FALLBACK,
      currentSlideIndex: 0,

      // ── Presentation list management ──────────────────────────────────

      createPresentation: (content = DEFAULT_CONTENT, mode: InputMode = 'markdown') => {
        const pres = makePresentation(content, mode)
        set(state => ({
          presentations: [pres, ...state.presentations],
          currentPresentationId: pres.id,
          presentation: pres,
          currentSlideIndex: 0,
        }))
        return pres.id
      },

      openPresentation: (id: string) => {
        set(state => ({
          currentPresentationId: id,
          presentation: sync(state.presentations, id),
          currentSlideIndex: 0,
        }))
      },

      deletePresentation: (id: string) => {
        set(state => {
          const remaining = state.presentations.filter(p => p.id !== id)
          if (remaining.length === 0) {
            const fresh = makePresentation(DEFAULT_CONTENT, 'markdown')
            return {
              presentations: [fresh],
              currentPresentationId: fresh.id,
              presentation: fresh,
              currentSlideIndex: 0,
            }
          }
          const nextId = state.currentPresentationId === id ? remaining[0].id : state.currentPresentationId
          return {
            presentations: remaining,
            currentPresentationId: nextId,
            presentation: sync(remaining, nextId),
            currentSlideIndex: 0,
          }
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
          slides: source.slides.map(s => ({
            ...s,
            id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          })),
        }
        set(state => ({
          presentations: [copy, ...state.presentations],
          currentPresentationId: copy.id,
          presentation: copy,
          currentSlideIndex: 0,
        }))
        return copy.id
      },

      // ── Active presentation mutations ─────────────────────────────────

      setContent: (content: string, mode?: InputMode) => {
        set(state => {
          const id = state.currentPresentationId
          const currentMode = mode ?? state.presentation.mode
          const slides = parseContent(content, currentMode)
          const title = extractTitle(slides, currentMode)
          const presentations = updatePres(state.presentations, id, p => ({
            ...p,
            rawContent: content,
            mode: currentMode,
            slides,
            title,
            updatedAt: Date.now(),
          }))
          return {
            presentations,
            presentation: sync(presentations, id),
            currentSlideIndex: Math.min(state.currentSlideIndex, Math.max(0, slides.length - 1)),
          }
        })
      },

      setTheme: (theme: ThemeName) => {
        set(state => {
          const id = state.currentPresentationId
          const presentations = updatePres(state.presentations, id, p => ({ ...p, theme, updatedAt: Date.now() }))
          return { presentations, presentation: sync(presentations, id) }
        })
      },

      setTransition: (transition: TransitionName) => {
        set(state => {
          const id = state.currentPresentationId
          const presentations = updatePres(state.presentations, id, p => ({ ...p, transition, updatedAt: Date.now() }))
          return { presentations, presentation: sync(presentations, id) }
        })
      },

      setTitle: (title: string) => {
        set(state => {
          const id = state.currentPresentationId
          const presentations = updatePres(state.presentations, id, p => ({ ...p, title, updatedAt: Date.now() }))
          return { presentations, presentation: sync(presentations, id) }
        })
      },

      // ── Slide navigation ──────────────────────────────────────────────

      setCurrentSlideIndex: (index: number) => {
        const slides = get().presentation.slides
        set({ currentSlideIndex: Math.max(0, Math.min(index, slides.length - 1)) })
      },

      nextSlide: () => {
        set(state => ({
          currentSlideIndex: Math.min(state.currentSlideIndex + 1, state.presentation.slides.length - 1),
        }))
      },

      prevSlide: () => {
        set(state => ({ currentSlideIndex: Math.max(0, state.currentSlideIndex - 1) }))
      },

      // ── Slide CRUD ────────────────────────────────────────────────────

      reorderSlides: (from: number, to: number) => {
        set(state => {
          const id = state.currentPresentationId
          const presentations = updatePres(state.presentations, id, p => {
            const slides = [...p.slides]
            const [moved] = slides.splice(from, 1)
            slides.splice(to, 0, moved)
            return { ...p, slides: slides.map((s, i) => ({ ...s, index: i })), updatedAt: Date.now() }
          })
          return { presentations, presentation: sync(presentations, id) }
        })
      },

      deleteSlide: (index: number) => {
        set(state => {
          const id = state.currentPresentationId
          const presentations = updatePres(state.presentations, id, p => {
            const slides = p.slides.filter((_, i) => i !== index).map((s, i) => ({ ...s, index: i }))
            return { ...p, slides, updatedAt: Date.now() }
          })
          const newPresentation = sync(presentations, id)
          const newSlideIndex = Math.min(state.currentSlideIndex, Math.max(0, newPresentation.slides.length - 1))
          return { presentations, presentation: newPresentation, currentSlideIndex: newSlideIndex }
        })
      },

      duplicateSlide: (index: number) => {
        set(state => {
          const id = state.currentPresentationId
          const presentations = updatePres(state.presentations, id, p => {
            const slides = [...p.slides]
            const copy = { ...slides[index], id: `slide-${Date.now()}`, index: index + 1 }
            slides.splice(index + 1, 0, copy)
            const reindexed = slides.map((s, i) => ({ ...s, index: i }))
            const separator = p.mode === 'markdown' ? '\n---\n' : '\n<!-- slide -->\n'
            const rawContent = reindexed.map(s => s.rawContent).join(separator)
            return { ...p, slides: reindexed, rawContent, updatedAt: Date.now() }
          })
          return { presentations, presentation: sync(presentations, id) }
        })
      },

      // ── Export ────────────────────────────────────────────────────────

      exportHTML: () => {
        exportToHTML(get().presentation)
      },
    }),
    {
      name: 'slidecraft-state-v2',
      partialize: state => ({
        presentations: state.presentations,
        currentPresentationId: state.currentPresentationId,
        currentSlideIndex: state.currentSlideIndex,
        // presentation is derived — recomputed on rehydrate via onRehydrateStorage
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.presentation = sync(state.presentations, state.currentPresentationId)
        }
      },
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
