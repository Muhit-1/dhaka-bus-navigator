import React from 'react'
import { motion } from 'framer-motion'

const LoadingSkeleton = ({ 
  className = '', 
  height = 'h-4', 
  width = 'w-full',
  rounded = 'rounded',
  ...props 
}) => {
  return (
    <motion.div
      className={`skeleton ${height} ${width} ${rounded} ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      {...props}
    />
  )
}

export const RouteCardSkeleton = () => (
  <div className="card p-4 space-y-3">
    <div className="flex items-center justify-between">
      <LoadingSkeleton height="h-5" width="w-48" />
      <LoadingSkeleton height="h-6" width="w-16" />
    </div>
    <div className="space-y-2">
      <LoadingSkeleton height="h-4" width="w-full" />
      <LoadingSkeleton height="h-4" width="w-3/4" />
    </div>
    <div className="flex items-center justify-between">
      <LoadingSkeleton height="h-4" width="w-24" />
      <LoadingSkeleton height="h-4" width="w-20" />
    </div>
  </div>
)

export const StopCardSkeleton = () => (
  <div className="card p-4 space-y-3">
    <div className="flex items-center space-x-3">
      <LoadingSkeleton height="h-8" width="w-8" rounded="rounded-full" />
      <div className="flex-1 space-y-2">
        <LoadingSkeleton height="h-4" width="w-32" />
        <LoadingSkeleton height="h-3" width="w-48" />
      </div>
    </div>
  </div>
)

export const MapSkeleton = () => (
  <div className="w-full h-96 bg-secondary-100 rounded-lg flex items-center justify-center">
    <div className="text-center">
      <LoadingSkeleton height="h-8" width="w-8" rounded="rounded-full" className="mx-auto mb-2" />
      <LoadingSkeleton height="h-4" width="w-32" className="mx-auto" />
    </div>
  </div>
)

export default LoadingSkeleton
