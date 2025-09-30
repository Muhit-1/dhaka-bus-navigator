import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  MapPin, 
  Globe, 
  X
} from 'lucide-react'
import { Button, Card, Input, Modal } from './ui'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

const SettingsModal = ({ isOpen, onClose }) => {
  const { isDark, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [settings, setSettings] = useState({
    notifications: {
      arrivalAlerts: true,
      delayAlerts: true,
      routeUpdates: false,
      maintenanceAlerts: true
    },
    display: {
      language: language,
      units: 'metric',
      showFares: true,
      showLandmarks: true
    }
  })

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }))

    if (category === 'display' && setting === 'language') {
      setLanguage(value)
    }
  }


  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        className="max-w-4xl"
      >
        <div className="max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-secondary-200">
            <h2 className="text-2xl font-bold text-secondary-900 flex items-center space-x-2">
              <Settings className="w-6 h-6" />
              <span>Settings</span>
            </h2>
            <button
              onClick={onClose}
              className="text-secondary-400 hover:text-secondary-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Appearance */}
            <div>
              <Card>
                <Card.Header>
                  <Card.Title className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Appearance</span>
                  </Card.Title>
                  <Card.Description>
                    Customize how the app looks and feels
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isDark ? (
                          <Moon className="w-5 h-5 text-secondary-600" />
                        ) : (
                          <Sun className="w-5 h-5 text-secondary-600" />
                        )}
                        <div>
                          <div className="font-medium text-secondary-900">Theme</div>
                          <div className="text-sm text-secondary-600">
                            {isDark ? 'Dark mode' : 'Light mode'}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={toggleTheme}
                        className="flex items-center space-x-2"
                      >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        <span>Switch to {isDark ? 'Light' : 'Dark'}</span>
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-secondary-600" />
                        <div>
                          <div className="font-medium text-secondary-900">Show Landmarks</div>
                          <div className="text-sm text-secondary-600">
                            Display nearby landmarks on stops
                          </div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.display.showLandmarks}
                          onChange={(e) => handleSettingChange('display', 'showLandmarks', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-secondary-600" />
                        <div>
                          <div className="font-medium text-secondary-900">{t('language_label')}</div>
                          <div className="text-sm text-secondary-600">
                            {t('interface_language')}
                          </div>
                        </div>
                      </div>
                      <select
                        value={settings.display.language}
                        onChange={(e) => handleSettingChange('display', 'language', e.target.value)}
                        className="px-3 py-1 border border-secondary-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="en">English</option>
                        <option value="bn">বাংলা</option>
                      </select>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>

            {/* Notifications */}
            <div>
              <Card>
                <Card.Header>
                  <Card.Title className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </Card.Title>
                  <Card.Description>
                    Choose what notifications you want to receive
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    {[
                      { key: 'arrivalAlerts', label: 'Arrival Alerts', description: 'Get notified when your bus is arriving' },
                      { key: 'delayAlerts', label: 'Delay Alerts', description: 'Receive updates about route delays' },
                      { key: 'routeUpdates', label: 'Route Updates', description: 'New routes and schedule changes' },
                      { key: 'maintenanceAlerts', label: 'Maintenance Alerts', description: 'Service disruptions and maintenance' }
                    ].map((notification) => (
                      <div key={notification.key} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-secondary-900">{notification.label}</div>
                          <div className="text-sm text-secondary-600">{notification.description}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications[notification.key]}
                            onChange={(e) => handleSettingChange('notifications', notification.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </div>

          </div>
        </div>
      </Modal>

    </>
  )
}

export default SettingsModal
