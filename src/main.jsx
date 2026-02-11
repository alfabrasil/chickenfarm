import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LanguageProvider } from './contexts/LanguageContext'
import { TutorialProvider } from './contexts/TutorialContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <TutorialProvider>
        <App />
      </TutorialProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
