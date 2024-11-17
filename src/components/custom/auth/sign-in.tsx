'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'

interface FormElements extends HTMLFormElement {
  email: HTMLInputElement
  password: HTMLInputElement
}

export default function SignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const form = e.currentTarget as FormElements
      const email = form.email.value.trim()
      const password = form.password.value

      if (!email || !password) {
        toast.error('Please fill in all fields')
        return
      }

      const result = await signIn('credentials', {
        identifier: email,
        password: password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid credentials')
        return
      }

      if (result?.ok) {
        toast.success('Login successful')
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      toast.error('An error occurred while signing in')
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className='w-full'
    >
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className='group space-y-2'
        >
          <Label
            htmlFor='email'
            className='text-sm font-medium text-neutral-700 dark:text-neutral-300'
          >
            Email address
          </Label>
          <div className='relative'>
            <Input
              id='email'
              name='email'
              placeholder='name@example.com'
              type='email'
              disabled={isLoading}
              className='h-11 bg-white/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus:border-primary/50 dark:focus:border-primary/50 transition-all duration-200 backdrop-blur-sm'
              required
            />
            <div className='absolute inset-0 border border-primary/50 rounded-md opacity-0 scale-105 group-focus-within:opacity-100 group-focus-within:scale-100 transition-all duration-200 pointer-events-none' />
          </div>
        </motion.div>

        {/* Password Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className='group space-y-2'
        >
          <div className='flex justify-between items-center'>
            <Label
              htmlFor='password'
              className='text-sm font-medium text-neutral-700 dark:text-neutral-300'
            >
              Password
            </Label>
            <Link
              href='#'
              className='text-xs text-primary hover:text-primary/80 transition-colors hover:underline'
            >
              Forgot password?
            </Link>
          </div>
          <div className='relative'>
            <Input
              id='password'
              name='password'
              placeholder='••••••••'
              type={showPassword ? 'text' : 'password'}
              disabled={isLoading}
              className='h-11 bg-white/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus:border-primary/50 dark:focus:border-primary/50 transition-all duration-200 backdrop-blur-sm pr-10'
              required
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors'
            >
              <AnimatePresence mode='wait' initial={false}>
                {showPassword ? (
                  <motion.div
                    key='hide'
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <EyeOff className='h-4 w-4' />
                  </motion.div>
                ) : (
                  <motion.div
                    key='show'
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Eye className='h-4 w-4' />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <div className='absolute inset-0 border border-primary/50 rounded-md opacity-0 scale-105 group-focus-within:opacity-100 group-focus-within:scale-100 transition-all duration-200 pointer-events-none' />
          </div>
        </motion.div>

        {/* Remember Me Checkbox */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className='flex items-center space-x-2'
        >
          <Checkbox
            id='remember'
            className='border-neutral-300 dark:border-neutral-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary'
          />
          <Label
            htmlFor='remember'
            className='text-sm text-neutral-600 dark:text-neutral-400 select-none cursor-pointer'
          >
            Keep me signed in
          </Label>
        </motion.div>

        {/* Sign In Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button
              className='w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:to-primary text-white transition-all duration-300'
              type='submit'
              disabled={isLoading}
            >
              <AnimatePresence mode='wait' initial={false}>
                {isLoading ? (
                  <motion.div
                    key='loading'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className='flex items-center gap-2'
                  >
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Signing in...
                  </motion.div>
                ) : (
                  <motion.div
                    key='sign-in'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className='flex items-center gap-2 relative'
                  >
                    Sign in
                    <motion.div
                      animate={{
                        x: [0, 5, 0],
                        opacity: [1, 0.7, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    >
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='translate-y-[1px]'
                      >
                        <path d='M5 12h14' />
                        <path d='m12 5 7 7-7 7' />
                      </svg>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </motion.div>
  )
}
