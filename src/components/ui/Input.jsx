import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

const Input = forwardRef(({ 
  className = '', 
  type = 'text', 
  error = false,
  icon,
  label,
  helperText,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <motion.input
          ref={ref}
          type={type}
          className={clsx(
            'input w-full rounded-md border bg-white px-3 py-2 text-sm transition-colors',
            'placeholder:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
            icon && 'pl-10',
            className
          )}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />
      </div>
      {helperText && (
        <p className={clsx(
          'mt-1 text-xs',
          error ? 'text-red-600' : 'text-secondary-500'
        )}>
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
