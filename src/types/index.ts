export type InputMode = 'markdown' | 'html'

export type ThemeName = 'minimal' | 'startup' | 'glassmorphism' | 'editorial' | 'futuristic'

export type TransitionName = 'slide' | 'fade' | 'zoom' | 'flip' | 'reveal'

export interface Slide {
  id: string
  content: string
  rawContent: string
  mode: InputMode
  index: number
}

export interface Theme {
  name: ThemeName
  label: string
  description: string
  preview: string
  bg: string
  text: string
  textMuted: string
  accent: string
  surface: string
  border: string
  headingFont: string
  bodyFont: string
  codeStyle: 'dark' | 'light'
}

export interface Presentation {
  id: string
  title: string
  rawContent: string
  mode: InputMode
  theme: ThemeName
  transition: TransitionName
  slides: Slide[]
  createdAt: number
  updatedAt: number
}

export interface AppState {
  // Multi-presentation
  presentations: Presentation[]
  currentPresentationId: string

  // Derived — the active presentation
  presentation: Presentation

  // Per-editor UI state
  currentSlideIndex: number

  // Actions: presentation list management
  createPresentation: (content?: string, mode?: InputMode) => string
  openPresentation: (id: string) => void
  deletePresentation: (id: string) => void
  duplicatePresentation: (id: string) => string

  // Actions: active presentation mutations
  setContent: (content: string, mode?: InputMode) => void
  setTheme: (theme: ThemeName) => void
  setTransition: (transition: TransitionName) => void
  setTitle: (title: string) => void

  // Actions: slide navigation
  setCurrentSlideIndex: (index: number) => void
  nextSlide: () => void
  prevSlide: () => void

  // Actions: slide CRUD
  reorderSlides: (from: number, to: number) => void
  deleteSlide: (index: number) => void
  duplicateSlide: (index: number) => void

  // Actions: export
  exportHTML: () => void
}
