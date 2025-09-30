import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  MapPin, 
  Globe, 
  Shield, 
  Download,
  Trash2,
  User,
  Smartphone,
  Wifi
} from 'lucide-react'
import { Button, Card, Input, Modal } from '../components/ui'
import { useTheme } from '../contexts/ThemeContext'

const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme()
  const [settings, setSettings] = useState({
    notifications: {
      arrivalAlerts: true,
      delayAlerts: true,
      routeUpdates: false,
      maintenanceAlerts: true
    },
    display: {
      language: 'en',
      units: 'metric',
      showFares: true,
      showLandmarks: true
    },
    privacy: {
      locationTracking: false,
      analytics: true,
      crashReports: true
    },
    data: {
      autoRefresh: true,
      cacheDuration: '1hour',
      offlineMode: false
    }
  })
  const [showClearCacheModal, setShowClearCacheModal] = useState(false)
  const [showDeleteDataModal, setShowDeleteDataModal] = useState(false)

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }))
  }

  const handleClearCache = () => {
    // Clear localStorage cache
    localStorage.removeItem('recentSearches')
    localStorage.removeItem('favorites')
    localStorage.removeItem('settings')
    setShowClearCacheModal(false)
    alert('Cache cleared successfully!')
  }

  const handleDeleteAllData = () => {
    // Clear all user data
    localStorage.clear()
    setShowDeleteDataModal(false)
    alert('All data deleted successfully!')
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'dhaka-bus-settings.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Settings
          </h1>
          <p className="text-secondary-600">
            Customize your Dhaka Bus Navigator experience
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
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
                        <div className="font-medium text-secondary-900">Language</div>
                        <div className="text-sm text-secondary-600">
                          Interface language
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
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
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
          </motion.div>

          {/* Privacy & Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Privacy & Data</span>
                </Card.Title>
                <Card.Description>
                  Control your data and privacy settings
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-secondary-600" />
                      <div>
                        <div className="font-medium text-secondary-900">Location Tracking</div>
                        <div className="text-sm text-secondary-600">
                          Allow location access for better route planning
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy.locationTracking}
                        onChange={(e) => handleSettingChange('privacy', 'locationTracking', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Wifi className="w-5 h-5 text-secondary-600" />
                      <div>
                        <div className="font-medium text-secondary-900">Offline Mode</div>
                        <div className="text-sm text-secondary-600">
                          Download routes for offline use
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.data.offlineMode}
                        onChange={(e) => handleSettingChange('data', 'offlineMode', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-secondary-600" />
                      <div>
                        <div className="font-medium text-secondary-900">Auto Refresh</div>
                        <div className="text-sm text-secondary-600">
                          Automatically refresh route data
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.data.autoRefresh}
                        onChange={(e) => handleSettingChange('data', 'autoRefresh', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Data Management</span>
                </Card.Title>
                <Card.Description>
                  Manage your app data and settings
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-secondary-900">Export Settings</div>
                      <div className="text-sm text-secondary-600">
                        Download your settings as a backup
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={exportSettings}
                      className="flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-secondary-900">Clear Cache</div>
                      <div className="text-sm text-secondary-600">
                        Clear temporary data to free up space
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowClearCacheModal(true)}
                      className="flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear</span>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-secondary-900">Delete All Data</div>
                      <div className="text-sm text-secondary-600">
                        Remove all saved data and reset to defaults
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteDataModal(true)}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete All</span>
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        </div>

        {/* Clear Cache Modal */}
        <Modal
          isOpen={showClearCacheModal}
          onClose={() => setShowClearCacheModal(false)}
          title="Clear Cache"
        >
          <div className="py-4">
            <p className="text-secondary-600 mb-6">
              This will clear all cached data including recent searches and temporary files. 
              Your settings and favorites will be preserved.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowClearCacheModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleClearCache}
                className="flex-1"
              >
                Clear Cache
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete All Data Modal */}
        <Modal
          isOpen={showDeleteDataModal}
          onClose={() => setShowDeleteDataModal(false)}
          title="Delete All Data"
        >
          <div className="py-4">
            <p className="text-secondary-600 mb-6">
              <strong>Warning:</strong> This will permanently delete all your data including 
              settings, favorites, and recent searches. This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDataModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAllData}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete All Data
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default SettingsPage
