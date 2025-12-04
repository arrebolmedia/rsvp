'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { getShortWeddingDate } from '@/lib/weddingDate'

interface HeroSliderProps {
  onOpenRSVP: () => void
  settings?: any
}

const defaultSlides = [
  {
    id: 1,
    image: '/images/hero/5.jpg',
    alt: 'Pareja de novios',
  },
  {
    id: 2,
    image: '/images/hero/10.jpg',
    alt: 'Momento romántico',
  },
  {
    id: 3,
    image: '/images/hero/24.jpg',
    alt: 'Celebración',
  },
  {
    id: 4,
    image: '/images/hero/28.jpg',
    alt: 'Juntos',
  },
]

export default function HeroSlider({ onOpenRSVP, settings }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = settings?.slides || defaultSlides

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div className="relative h-full w-full bg-gradient-to-b from-black/30 to-black/50">
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].alt}
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Contenido del Hero */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center text-white px-4"
        >
          <h1 className="font-elegant text-7xl md:text-9xl mb-6 drop-shadow-lg" style={{ fontWeight: 300, letterSpacing: '0.02em' }}>
            Ana & Carlos
          </h1>
          <div className="w-24 h-px bg-white/40 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl font-light tracking-[0.3em] uppercase mb-12" style={{ fontWeight: 300 }}>
            {getShortWeddingDate()}
          </p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            onClick={onOpenRSVP}
            className="inline-block px-12 py-4 border-2 border-white text-white font-light text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-accent-wine transition-all duration-300 shadow-lg"
          >
            Confirmar Asistencia
          </motion.button>
        </motion.div>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
