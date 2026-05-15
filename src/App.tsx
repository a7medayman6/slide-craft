import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/next'
import Landing from './pages/Landing'
import Decks from './pages/Decks'
import Editor from './pages/Editor'
import Present from './pages/Present'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/decks" element={<Decks />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/present" element={<Present />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}
