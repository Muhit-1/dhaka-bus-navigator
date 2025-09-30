import React from 'react'
import { motion } from 'framer-motion'
import { 
  Bus, 
  MapPin, 
  MessageSquare, 
  Github, 
  Globe, 
  Mail,
  Phone,
  Navigation
} from 'lucide-react'

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <footer className="bg-gradient-to-br from-secondary-900 to-secondary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Dhaka Bus</span>
            </div>
            <p className="text-secondary-300 mb-6 max-w-sm">
              Your trusted companion for navigating Dhaka's bus routes. 
              Find the best routes, check fares, and plan your journey with confidence.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/Muhit-1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-secondary-700 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://senaan.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-secondary-700 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="Portfolio"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a 
                href="mailto:senanovi908@gmail.com" 
                className="p-2 bg-secondary-700 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="flex items-center space-x-2 text-secondary-300 hover:text-white transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('feedback')}
                  className="flex items-center space-x-2 text-secondary-300 hover:text-white transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Feedback</span>
                </button>
              </li>
              <li>
                <a 
                  href="#routes" 
                  className="flex items-center space-x-2 text-secondary-300 hover:text-white transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Bus Routes</span>
                </a>
              </li>
             
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <a 
                href="https://github.com/Muhit-1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 hover:text-white text-secondary-300 transition-colors"
              >
                <Github className="w-4 h-4 text-primary-400" />
                <span>GitHub</span>
              </a>
              <a 
                href="https://senaan.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 hover:text-white text-secondary-300 transition-colors"
              >
                <Globe className="w-4 h-4 text-primary-400" />
                <span>Portfolio</span>
              </a>
            </div>
          </motion.div>

          {/* Developer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Developer</h3>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/me_hit.png" 
                alt="Muhit Rahman" 
                className="w-12 h-12 rounded-full object-cover border-2 border-primary-600"
              />
              <div>
                <div className="font-medium">Muhit Rahman</div>
                <div className="text-sm text-secondary-400">Full Stack Developer</div>
              </div>
            </div>
            <p className="text-sm text-secondary-300">
              Passionate about building solutions that make urban transportation more accessible and efficient.
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-secondary-700 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-secondary-400">
              © 2024 Dhaka Bus Navigator. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#privacy" className="text-secondary-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-secondary-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#disclaimer" className="text-secondary-400 hover:text-white transition-colors">
                Disclaimer
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
