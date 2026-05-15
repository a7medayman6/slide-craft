# [DeckCraft](https://deck-craft-theta.vercel.app/)

DeckCraft is a frontend-only presentation builder for turning Markdown or HTML into polished slide decks. It includes a live editor, instant preview, theme switching, slide management, fullscreen presenting, and HTML export — all in the browser with local persistence.

Visit at this link: https://deck-craft-theta.vercel.app/

> ✨ Markdown-first · 🎨 Beautiful themes · ⚡ Instant preview · 🖥️ Present mode · 📦 HTML export

## Visual snapshot

<table>
	<tr>
		<td><strong>1. Write</strong><br/>Use Markdown or HTML content.</td>
		<td><strong>2. Preview</strong><br/>See updates instantly as you type.</td>
		<td><strong>3. Present</strong><br/>Go fullscreen with smooth transitions.</td>
	</tr>
</table>

### Built for a polished workflow

- 📝 Write slides with Markdown separators like `---`
- 🪟 Edit and preview side by side
- 🎯 Switch themes and transitions quickly
- ⌘K / Ctrl+K command palette for fast actions
- 🌐 Export a standalone HTML deck for sharing

### Hero-style terminal preview

<table>
	<tr>
		<td>

```text
┌───────────────────────────────────────────────┐
│ DeckCraft                                     │
│                                               │
│ > theme minimal                               │
│   Clean white canvas                          │
│                                               │
│ > theme startup                               │
│   Bold, electric, high contrast               │
│                                               │
│ > theme glassmorphism                         │
│   Frosted panels with glowing depth           │
│                                               │
│ > theme editorial                             │
│   Magazine-quality typography                 │
│                                               │
│ > theme futuristic                            │
│   Terminal aesthetics with scan-line energy   │
└───────────────────────────────────────────────┘
```

		</td>
		<td valign="top">

| Theme | Look |
| --- | --- |
| Minimal | Clean and timeless |
| Startup | Bold and electric |
| Glass | Frosted and luminous |
| Editorial | Elegant serif layouts |
| Cyber | Neon terminal style |

		</td>
	</tr>
</table>

## Highlights

- Markdown-first workflow with `---` slide separators
- HTML slide support for custom layouts and richer embeds
- Live editor and instant preview side by side
- Slide deck manager for creating, duplicating, deleting, and opening presentations
- Theme system with 5 visual styles
- Presentation mode with keyboard navigation and fullscreen support
- Command palette for fast access to actions
- File upload for `.md`, `.markdown`, `.html`, `.htm`, and `.txt`
- Export to a standalone HTML file
- Auto-save with persisted local state
- Responsive UI with smooth animations

## Features

### 1. Presentation management
- Create new decks from a default starter document
- Switch between multiple saved presentations
- Search decks in the library view
- Duplicate or delete decks
- Local persistence keeps data between sessions

### 2. Editor experience
- Edit presentation content in Markdown or HTML mode
- Rename the deck title directly from the toolbar
- Toggle between Markdown and HTML parsing
- Use the command palette with `Ctrl+K` / `Cmd+K`
- Upload a file to load content instantly

### 3. Slide rendering
- Markdown content is split into slides using `---`
- HTML content supports slide separators and section-based slides
- Syntax-highlighted code blocks
- Sanitized rich content rendering for safer HTML support

### 4. Preview and navigation
- Live preview updates as content changes
- Slide thumbnails in the sidebar
- Next/previous controls in the preview pane
- Reorder-friendly slide structure in the store

### 5. Themes
DeckCraft includes five built-in themes:

| Theme | Style |
| --- | --- |
| Minimal | Clean white canvas, distraction-free |
| Startup | Bold and electric |
| Glassmorphism | Frosted panels with gradient depth |
| Editorial | Magazine-quality serif typography |
| Futuristic | Terminal-inspired cyber look |

Each theme defines its own background, text colors, accents, fonts, and code style.

### 6. Present mode
- Fullscreen presentation view
- Arrow key navigation
- Spacebar advances slides
- `Esc` exits presentation mode
- `G` toggles thumbnails
- `F` toggles fullscreen
- Animated transitions: slide, fade, zoom, flip, and reveal

### 7. Export
- Export the current presentation as a standalone HTML file
- Exported file includes embedded styles, navigation controls, and keyboard support

## Tech Stack

### Core
- React 18
- TypeScript
- Vite
- React Router
- Zustand

### UI and animation
- Framer Motion
- Tailwind CSS
- Lucide React icons
- clsx
- tailwind-merge

### Markdown, HTML, and rendering
- react-markdown
- remark-gfm
- rehype-raw
- rehype-highlight
- highlight.js
- DOMPurify
- react-syntax-highlighter

### File handling
- react-dropzone

### Editor tooling
- @uiw/react-codemirror
- @codemirror/lang-markdown
- @codemirror/lang-html
- @codemirror/theme-one-dark

## How it works

1. Write content in Markdown or HTML.
2. Separate slides with `---` in Markdown, or use HTML slide separators / slide sections.
3. The app parses the content into slide objects.
4. The preview and presentation views render the same underlying slide data.
5. Settings like theme, transition, and deck content are saved locally.

## Project structure

- `src/pages` — main app pages: landing, decks, editor, present
- `src/components/editor` — editor workspace UI
- `src/components/presentation` — slide rendering and thumbnails
- `src/components/ui` — shared UI primitives
- `src/lib` — parser, theme system, export logic, and sanitization helpers
- `src/store` — global app state using Zustand
- `src/types` — shared TypeScript types

## Available scripts

- `npm run dev` — start the development server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## Keyboard shortcuts

### Editor
- `Ctrl+K` / `Cmd+K` — open command palette

### Presentation
- `ArrowRight` / `Space` — next slide
- `ArrowLeft` — previous slide
- `Esc` — exit presentation mode
- `F` — fullscreen toggle
- `G` — show or hide thumbnails

## Notes

- DeckCraft is frontend-only and does not require a backend.
- All user data is stored locally in the browser.
- Exported HTML decks can be shared independently of the app.

## Getting started

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, then create or open a deck from the landing page.
