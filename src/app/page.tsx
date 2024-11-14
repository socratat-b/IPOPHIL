// src/app/page.tsx
'use client'

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { ThemeChange } from "@/components/custom/theme/theme-change"
import SignIn from "@/components/custom/auth/sign-in"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })
import animationData1 from '../../public/animation/secure.json'
import animationData2 from '../../public/animation/process.json'
import animationData3 from '../../public/animation/store.json'

const carouselItems = [
  {
    title: "Centralized Document Hub",
    description: "Securely store, organize, and manage all your intellectual property documents in one place",
    animation: animationData3,
  },
  {
    title: "Automated Workflows",
    description: "Streamline document approvals, reviews, and processing with customizable workflow automation",
    animation: animationData2,
  },
  {
    title: "Compliance & Security",
    description: "Maintain document security and compliance with advanced access controls and audit trailing",
    animation: animationData1,
  }
]

export default function AuthenticationPage() {
  // Hooks at the top level
  const [mounted, setMounted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const { theme } = useTheme()
  const lottieRef = useRef(null)
  const { status } = useSession()
  const router = useRouter()

  // All useEffect hooks grouped together
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  // Early returns after hooks
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-50/50 via-background to-orange-50/30 dark:from-background dark:via-card dark:to-background flex items-center justify-center p-4 transition-colors duration-500">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-primary/5 to-primary/20 dark:from-background/10 dark:to-background/20 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-tr from-primary/5 to-primary/20 dark:from-background/10 dark:to-background/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative w-full max-w-6xl"
      >
        {/* Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute right-4 top-4 z-50"
        >
          <ThemeChange />
        </motion.div>

        <div className="backdrop-blur-xl bg-card/60 dark:bg-card/60 rounded-3xl shadow-2xl overflow-hidden border border-border/50 dark:border-border/50">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Sign In Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full lg:w-[45%] p-8 lg:p-12 flex flex-col justify-center relative z-10"
            >
              <div className="max-w-md mx-auto space-y-8">
                {/* Logo Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <div className="p-2 rounded-2xl bg-primary/10 backdrop-blur-sm">
                    <Image
                      src="/logo.svg"
                      alt="IPOPHIL Logo"
                      width={40}
                      height={40}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <motion.h1
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                    >
                      IPOPHIL
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-sm text-gray-600 dark:text-gray-300"
                    >
                      Document Management System
                    </motion.p>
                  </div>
                </motion.div>

                {/* Welcome Text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-2"
                >
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Sign in to continue to your account
                  </p>
                </motion.div>

                {/* Sign In Form */}
                <SignIn />
              </div>
            </motion.div>

            {/* Right Side - Carousel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="w-full lg:w-[55%] bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/20 dark:to-primary/10 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm"
            >
              <div className="relative z-10 space-y-8">
                <div className="relative z-10 mt-8 lg:mt-0">
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
                  >
                    Innovate. Protect.{" "}
                    <span className="text-primary">Thrive.</span>
                  </motion.h3>
                </div>

                {/* Carousel */}
                <div className="relative min-h-[400px]">
                  <AnimatePresence mode="wait">
                    {carouselItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: currentSlide === index ? 1 : 0, x: currentSlide === index ? 0 : 100 }}
                        exit={{ opacity: 0, x: -100 }}
                        className={`${currentSlide === index ? 'block absolute inset-0' : 'hidden'}`}
                      >
                        <div className="space-y-4">
                          <p className="text-gray-600 dark:text-gray-300">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex justify-center items-center h-full">
                          <Lottie
                            lottieRef={lottieRef}
                            animationData={item.animation}
                            loop={true}
                            autoplay={true}
                            className="w-[300px] max-w-full"
                            style={{
                              filter: theme === 'dark' ? 'brightness(0.8) contrast(1.2)' : 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))'
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Carousel Controls */}
                  <div className="absolute -bottom-4 left-0 right-0 flex justify-center items-center">
                    <div className="flex gap-2">
                      {carouselItems.map((_, index) => (
                        <motion.button
                          key={index}
                          className={`h-2 rounded-full transition-all ${currentSlide === index
                            ? 'w-6 bg-primary'
                            : 'w-2 bg-gray-300 dark:bg-gray-600'
                            }`}
                          onClick={() => setCurrentSlide(index)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Patterns */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Background Base Layer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"
                  animate={{
                    opacity: [0.5, 0.7, 0.5],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Floating Geometric Shapes */}
                {/* Large Circle */}
                <motion.div
                  className="absolute -right-32 -top-32 w-96 h-96"
                  animate={{
                    x: [0, 20, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full text-primary/20">
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="currentColor"
                      animate={{
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </svg>
                </motion.div>

                {/* Hexagon Pattern */}
                <motion.div
                  className="absolute -left-16 top-1/4 w-64 h-64"
                  animate={{
                    x: [-20, 0, -20],
                    y: [0, 20, 0],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full text-primary/15">
                    <motion.path
                      d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
                      fill="currentColor"
                      animate={{
                        opacity: [0.2, 0.4, 0.2],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </svg>
                </motion.div>

                {/* Wave Pattern */}
                <motion.div
                  className="absolute -left-32 -bottom-32 w-96 h-96"
                  animate={{
                    x: [20, 0, 20],
                    y: [0, 20, 0],
                  }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full text-primary/10">
                    <motion.path
                      d="M 0 100 Q 50 50 100 100 Q 150 150 200 100"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      animate={{
                        d: [
                          "M 0 100 Q 50 50 100 100 Q 150 150 200 100",
                          "M 0 100 Q 50 150 100 100 Q 150 50 200 100",
                          "M 0 100 Q 50 50 100 100 Q 150 150 200 100",
                        ],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </svg>
                </motion.div>

                {/* Glowing Orbs */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-32 h-32 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                        } 0%, transparent 70%)`,
                      left: `${20 + i * 30}%`,
                      top: `${30 + i * 20}%`,
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                      x: [0, 20, 0],
                      y: [0, -20, 0],
                    }}
                    transition={{
                      duration: 10 + i * 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.8,
                    }}
                  />
                ))}

                {/* Subtle Background Texture */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(circle at 20px 20px, ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                      } 2px, transparent 0)`,
                    backgroundSize: '40px 40px',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}