import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter, Routes, Route} from 'react-router'

import AiChat from './ai-chat.tsx'
import Dashboard from './dashboard.tsx'
import Database from './database.tsx'
import Upload from './upload.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="chat" element={<AiChat />}/>
          <Route path="dashboard" element={<Dashboard />}/>
          <Route path="database" element={<Database />}/>
          <Route path="upload" element={<Upload />}/>
        </Route>
      </Routes>
    </StrictMode>
  </BrowserRouter>
)
