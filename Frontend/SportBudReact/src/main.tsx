import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthProvider.tsx'
import { AuctionProvider } from './context/AuctionProvider.tsx'

// Startpunkten för applikationen – monterar React-appen i DOM:en med router och context-providers
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AuctionProvider>
          <App />
        </AuctionProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
