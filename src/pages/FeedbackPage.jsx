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
  Send
} from 'lucide-react'
import { Button, Input, Card, Badge, Modal } from '../components/ui'
import { submitFeedback } from '../lib/supabase'

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    feedbackType: 'general',
    stopId: '',
    routeId: '',
    title: '',
    description: '',
    priority: 'medium',
    contactEmail: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [errors, setErrors] = useState({})

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback', icon: MessageSquare },
    { value: 'route_update', label: 'Route Update', icon: Bus },
    { value: 'stop_issue', label: 'Stop Issue', icon: MapPin },
    { value: 'fare_update', label: 'Fare Update', icon: Star },
    { value: 'delay_alert', label: 'Delay Alert', icon: Clock },
    { value: 'safety_concern', label: 'Safety Concern', icon: AlertTriangle }
  ]

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' }
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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
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
        ...formData,
        status: 'pending',
        created_at: new Date().toISOString(),
        user_id: 'anonymous' // In a real app, this would be the logged-in user's ID
      }
      
      await submitFeedback(feedbackData)
      setShowSuccessModal(true)
      setFormData({
        feedbackType: 'general',
        stopId: '',
        routeId: '',
        title: '',
        description: '',
        priority: 'medium',
        contactEmail: ''
      })
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFeedbackIcon = (type) => {
    const feedbackType = feedbackTypes.find(ft => ft.value === type)
    return feedbackType ? feedbackType.icon : MessageSquare
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Help Us Improve
          </h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Your feedback helps us keep Dhaka's bus routes accurate and up-to-date. 
            Share updates, report issues, or suggest improvements.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Feedback Type */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-3">
                    What type of feedback are you sharing?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {feedbackTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleInputChange('feedbackType', type.value)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.feedbackType === type.value
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-secondary-200 hover:border-secondary-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className="w-5 h-5 text-secondary-600" />
                            <span className="font-medium text-secondary-900">
                              {type.label}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Title */}
                <Input
                  label="Title"
                  placeholder="Brief description of your feedback"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  error={errors.title}
                  required
                />

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

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-3">
                    Priority Level
                  </label>
                  <div className="flex space-x-4">
                    {priorities.map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => handleInputChange('priority', priority.value)}
                        className={`px-4 py-2 rounded-md border transition-all ${
                          formData.priority === priority.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-secondary-300 hover:border-secondary-400'
                        }`}
                      >
                        <span className={priority.color}>
                          {priority.label}
                        </span>
                      </button>
                    ))}
                  </div>
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
                  className="w-full"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Submit Feedback
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
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

            {/* Admin Panel Preview */}
            <Card className="bg-primary-50 border-primary-200">
              <Card.Header>
                <Card.Title className="text-primary-900">Admin Panel</Card.Title>
                <Card.Description className="text-primary-700">
                  Manage feedback and updates
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-primary-700">Pending Reviews:</span>
                    <Badge variant="warning">12</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-700">This Week:</span>
                    <span className="text-primary-900 font-medium">47 submissions</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-700">Resolved:</span>
                    <span className="text-primary-900 font-medium">23</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                >
                  View Admin Panel
                </Button>
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

export default FeedbackPage
