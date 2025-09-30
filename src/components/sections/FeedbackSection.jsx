import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  MapPin, 
  Bus, 
  Clock,
  Star,
  Send,
  MessageCircle,
  Users
} from 'lucide-react'
import { Button, Input, Card, Badge, Modal } from '../ui'
import { useLanguage } from '../../contexts/LanguageContext'
import { submitFeedback } from '../../lib/supabase'

const FeedbackSection = () => {
  const [formData, setFormData] = useState({
    feedbackType: 'general',
    stopId: '',
    routeId: '',
    description: '',
    contactEmail: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [errors, setErrors] = useState({})
  const { t } = useLanguage()

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback', icon: MessageSquare },
    { value: 'route_update', label: 'Route Update', icon: Bus },
    { value: 'stop_issue', label: 'Stop Issue', icon: MapPin },
    { value: 'fare_update', label: 'Fare Update', icon: Star },
    { value: 'delay_alert', label: 'Delay Alert', icon: Clock },
    { value: 'safety_concern', label: 'Safety Concern', icon: AlertTriangle }
  ]


  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const feedbackData = {
        feedback_type: formData.feedbackType,
        stop_id: formData.stopId || null,
        route_id: formData.routeId || null,
        description: formData.description,
        contact_email: formData.contactEmail || null,
        status: 'pending'
      }
      
      console.log('Submitting feedback:', feedbackData)
      await submitFeedback(feedbackData)
      setShowSuccessModal(true)
      setFormData({
        feedbackType: 'general',
        stopId: '',
        routeId: '',
        description: '',
        contactEmail: ''
      })
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert(`Failed to submit feedback: ${error.message || 'Please try again.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFeedbackIcon = (type) => {
    const feedbackType = feedbackTypes.find(ft => ft.value === type)
    return feedbackType ? feedbackType.icon : MessageSquare
  }

  return (
    <div className="py-20 lg:py-28 bg-gradient-to-br from-secondary-50 to-white dark:from-secondary-800 dark:to-secondary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
            {t('feedback_title')}
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
            Your feedback helps us keep Dhaka's bus routes accurate and up-to-date. 
            Share updates, report issues, or suggest improvements.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Feedback Type */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    What type of feedback are you sharing?
                  </label>
                  <select
                    value={formData.feedbackType}
                    onChange={(e) => handleInputChange('feedbackType', e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {feedbackTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>


                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Please provide detailed information about your feedback..."
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={4}
                    required
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Location Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Stop ID (optional)"
                    placeholder="e.g., stop-123"
                    value={formData.stopId}
                    onChange={(e) => handleInputChange('stopId', e.target.value)}
                  />
                  <Input
                    label="Route ID (optional)"
                    placeholder="e.g., route-456"
                    value={formData.routeId}
                    onChange={(e) => handleInputChange('routeId', e.target.value)}
                  />
                </div>


                {/* Contact Email */}
                <Input
                  label="Contact Email (optional)"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  error={errors.contactEmail}
                  helperText="We'll use this to follow up on your feedback"
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  loading={isSubmitting}
                  size="lg"
                  className="w-full h-12"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {t('submit_feedback')}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Feedback Guidelines */}
            <Card>
              <Card.Header>
                <Card.Title>Feedback Guidelines</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3 text-sm text-secondary-600">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Be specific about locations and routes</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Include timestamps for time-sensitive issues</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Provide contact info for follow-up</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Be respectful and constructive</span>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Recent Updates */}
            <Card>
              <Card.Header>
                <Card.Title>Recent Updates</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {[
                    { type: 'route_update', message: 'Route 15 schedule updated', time: '2 hours ago' },
                    { type: 'fare_update', message: 'Fare increased to ৳12', time: '1 day ago' },
                    { type: 'stop_issue', message: 'New stop added at Dhanmondi 27', time: '3 days ago' }
                  ].map((update, index) => {
                    const Icon = getFeedbackIcon(update.type)
                    return (
                      <div key={index} className="flex items-start space-x-3 p-2 rounded-lg bg-secondary-50">
                        <Icon className="w-4 h-4 text-secondary-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-secondary-900">
                            {update.message}
                          </p>
                          <p className="text-xs text-secondary-500">
                            {update.time}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        </div>


        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Feedback Submitted"
        >
          <div className="text-center py-4">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Thank you for your feedback!
            </h3>
            <p className="text-secondary-600 mb-4">
              We've received your submission and will review it shortly. 
              You'll be notified if we need any additional information.
            </p>
            <Button onClick={() => setShowSuccessModal(false)}>
              Close
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default FeedbackSection
