import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Components
import Navigation from './components/Navigation'
import HeroSection from './components/sections/HeroSection'
import FeedbackSection from './components/sections/FeedbackSection'
import Footer from './components/Footer'
import SettingsModal from './components/SettingsModal'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500) // Reduced from 1000ms to 500ms

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 bg-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </motion.div>
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">
            Dhaka City Bus Navigator
          </h1>
          <p className="text-secondary-600">
            Loading your journey planner...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-secondary-800">
        <Navigation onSettingsClick={() => setShowSettings(true)} />
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <section id="home">
            <HeroSection />
          </section>

          {/* Feedback Section */}
          <section id="feedback" className="mt-8 sm:mt-12 lg:mt-16">
            <FeedbackSection />
          </section>
        </motion.main>

        {/* Footer */}
        <Footer />

        {/* Settings Modal */}
        <SettingsModal 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App