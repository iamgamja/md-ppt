import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Presentation from './Presentation.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/md-ppt" element={<App />} />
        <Route path="/md-ppt/presentation" element={<Presentation />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
