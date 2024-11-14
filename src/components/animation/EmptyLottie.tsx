// src\components\animation\EmptyLottie.tsx
'use client'

import React, { useRef, useEffect, forwardRef, useState } from 'react'
import { motion } from 'framer-motion'

interface EmptyLottieProps {
  message?: string
  description?: string
  className?: string
  animationPath?: string
}

const EmptyLottie = forwardRef<HTMLDivElement, EmptyLottieProps>(({
  message = 'No Data Found',
  description = 'There are no records to display at the moment',
  className = 'w-60',
  animationPath = '/animation/empty-box.json'
}, ref) => {
  const [lottieLoaded, setLottieLoaded] = useState(false);

  useEffect(() => {
    import('@lottiefiles/lottie-player').then(() => setLottieLoaded(true));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='flex flex-col items-center justify-center gap-3 py-8'
    >
      {lottieLoaded && (
        <lottie-player
          id='empty-state-animation'
          autoplay
          loop
          mode='normal'
          src={animationPath}
          className={className}
        />
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='text-center space-y-1'
      >
        <h3 className='font-semibold text-lg text-foreground'>
          {message}
        </h3>
        <p className='text-sm text-muted-foreground max-w-[250px] mx-auto'>
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
});

export default EmptyLottie;
