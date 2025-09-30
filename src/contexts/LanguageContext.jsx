import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

const translations = {
  en: {
    nav_home: 'Home',
    nav_feedback: 'Feedback',
    hero_title_line1: 'Navigate Dhaka',
    hero_title_line2: 'with Ease',
    hero_subtitle: "Find the best bus routes, check fares, and plan your journey across Dhaka city",
    from_label: 'From',
    from_placeholder: 'Enter your starting point',
    to_label: 'To',
    to_placeholder: 'Enter your destination',
    find_routes: 'Find Routes',
    feedback_title: 'Help Us Improve',
    submit_feedback: 'Submit Feedback',
    language_label: 'Language',
    interface_language: 'Interface language'
  },
  bn: {
    nav_home: 'হোম',
    nav_feedback: 'মতামত',
    hero_title_line1: 'ঢাকা নেভিগেট করুন',
    hero_title_line2: 'সহজে',
    hero_subtitle: 'সেরা বাস রুট খুঁজুন, ভাড়া দেখুন এবং সহজে যাত্রা পরিকল্পনা করুন',
    from_label: 'শুরু',
    from_placeholder: 'শুরুর স্থান লিখুন',
    to_label: 'গন্তব্য',
    to_placeholder: 'গন্তব্য লিখুন',
    find_routes: 'রুট খুঁজুন',
    feedback_title: 'আমাদের উন্নতিতে সাহায্য করুন',
    submit_feedback: 'মতামত পাঠান',
    language_label: 'ভাষা',
    interface_language: 'ইন্টারফেস ভাষা'
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en')

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = useMemo(() => {
    const dict = translations[language] || translations.en
    return (key) => dict[key] || key
  }, [language])

  const value = { language, setLanguage, t }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageContext


