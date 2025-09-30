import React from 'react'
import { motion } from 'framer-motion'
import { 
  Bus, 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  Shield, 
  Smartphone,
  Globe,
  Award,
  MessageCircle
} from 'lucide-react'
import { Card, Button } from '../ui'

const AboutSection = () => {
  const features = [
    {
      icon: <MapPin className="w-8 h-8 text-primary-600" />,
      title: "Accurate Route Planning",
      description: "Find the best bus routes with real-time data and community updates"
    },
    {
      icon: <Clock className="w-8 h-8 text-primary-600" />,
      title: "Real-time Information",
      description: "Get live arrival times, delays, and route updates"
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: "Community Driven",
      description: "Updated by locals who know the city best"
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: "Safe & Reliable",
      description: "Trusted information for safe navigation around Dhaka"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-primary-600" />,
      title: "Mobile First",
      description: "Designed for easy use on your phone while traveling"
    },
    {
      icon: <Globe className="w-8 h-8 text-primary-600" />,
      title: "Always Available",
      description: "Works offline and online, wherever you are in Dhaka"
    }
  ]

  const stats = [
    { number: "500+", label: "Bus Routes" },
    { number: "2,000+", label: "Bus Stops" },
    { number: "50,000+", label: "Daily Users" },
    { number: "99%", label: "Accuracy Rate" }
  ]

  const team = [
    {
      name: "Community Contributors",
      role: "Route Updates & Feedback",
      description: "Local residents who keep our data accurate and up-to-date"
    },
    {
      name: "Development Team",
      role: "App Development & Maintenance",
      description: "Building and maintaining the platform for better public transport"
    },
    {
      name: "Data Partners",
      role: "Real-time Information",
      description: "Working with transport authorities for live updates"
    }
  ]

  return (
    <div className="py-16 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
            About Dhaka Bus Navigator
          </h2>
          <p className="text-lg text-secondary-600 max-w-4xl mx-auto leading-relaxed">
            Dhaka Bus Navigator was born from a simple idea: public transportation should be 
            accessible to everyone. We believe that reliable, easy-to-use navigation tools 
            can transform how people move around our city, making it more connected, 
            sustainable, and inclusive.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-secondary-900 text-center mb-12">
            What We Offer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-secondary-900 mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-secondary-600">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Card className="p-8 bg-primary-600 text-white">
            <h3 className="text-3xl font-bold text-center mb-8">
              By the Numbers
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-primary-100 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-primary-200">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-secondary-900 text-center mb-12">
            Our Community
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-secondary-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-secondary-900 mb-2">
                    {member.name}
                  </h4>
                  <p className="text-primary-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-secondary-600">
                    {member.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Card className="p-8 bg-yellow-50 border-yellow-200">
            <h3 className="text-2xl font-bold text-yellow-900 mb-4">
              Important Disclaimer
            </h3>
            <div className="space-y-4 text-yellow-800">
              <p>
                <strong>Route Information:</strong> While we strive for accuracy, bus routes, 
                schedules, and fares may change without notice. Always verify information 
                with official sources before traveling.
              </p>
              <p>
                <strong>Real-time Data:</strong> Arrival times and delays are estimates 
                based on available data. Actual conditions may vary due to traffic, 
                weather, or other factors.
              </p>
              <p>
                <strong>Safety:</strong> Please prioritize your safety when using public 
                transportation. Be aware of your surroundings and follow local safety guidelines.
              </p>
              <p>
                <strong>Community Updates:</strong> Information marked as "estimated" 
                is based on community feedback and may not be officially verified.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-secondary-900 mb-6">
            Get in Touch
          </h3>
          <p className="text-lg text-secondary-600 mb-8 max-w-2xl mx-auto">
            Have questions, suggestions, or want to contribute? We'd love to hear from you!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Feedback</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span>Join Community</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutSection
