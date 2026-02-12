'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { getShortWeddingDate } from '@/lib/weddingDate'

interface HeroSliderDynamicProps {
  onOpenRSVP: () => void
  settings?: any
  design?: any
}

const defaultSlides = [
  { id: 1, image: '/images/hero/5.jpg', alt: 'Pareja' },
  { id: 2, image: '/images/hero/10.jpg', alt: 'Amor' },
  { id: 3, image: '/images/hero/24.jpg', alt: 'Celebración' },
]

export default function HeroSliderDynamic({ onOpenRSVP, settings, design }: HeroSliderDynamicProps) {
  const heroType = design?.heroType || 'classic'
  
  if (heroType === 'video') {
    return <HeroVideo onOpenRSVP={onOpenRSVP} settings={settings} design={design} />
  }
  
  if (heroType === 'minimal') {
    return <HeroMinimal onOpenRSVP={onOpenRSVP} settings={settings} design={design} />
  }
  
  return <HeroClassic onOpenRSVP={onOpenRSVP} settings={settings} design={design} />
}

// Hero tipo Clásico (slider de imágenes)
function HeroClassic({ onOpenRSVP, settings, design }: HeroSliderDynamicProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Si hay backgroundImage y no está vacío, usar solo esa imagen
  const hasBackgroundImage = settings?.backgroundImage && settings.backgroundImage.trim() !== ''
  const slides = hasBackgroundImage
    ? [{ id: 1, image: settings.backgroundImage, alt: 'Wedding' }]
    : (settings?.slides || defaultSlides)
  
  // Si backgroundImage está vacío explícitamente, no mostrar ninguna imagen
  const showImages = hasBackgroundImage || !('backgroundImage' in (settings || {}))
  
  const colors = design?.colors || {}
  const fonts = design?.fonts || {}
  const overlayOpacity = design?.overlayOpacity || 0.3

  useEffect(() => {
    if (showImages) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [slides.length, showImages])

  return (
    <section 
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: colors.background || '#FAF8F5' }}
    >
      {/* Imágenes en segundo plano con baja opacidad - solo si showImages es true */}
      {showImages && (
        <AnimatePresence>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 opacity-10"
          >
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].alt}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
      )}

      <div className="absolute inset-0 flex items-center justify-center z-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center px-4"
        >
          <h1 
            className="text-7xl md:text-9xl mb-6" 
            style={{ 
              fontFamily: fonts.heading || 'Cormorant',
              fontWeight: fonts.headingWeight || 100, 
              letterSpacing: '0.02em',
              color: colors.text || '#2B2B2B'
            }}
          >
            {settings?.title || `${settings?.brideName || 'Ana'} & ${settings?.groomName || 'Carlos'}`}
          </h1>
          <div 
            className="w-24 h-px mx-auto mb-4"
            style={{ backgroundColor: colors.primary || '#8B4444', opacity: 0.4 }}
          ></div>
          <p 
            className="text-lg md:text-xl tracking-[0.3em] uppercase mb-8"
            style={{ 
              fontFamily: fonts.body || 'Montserrat',
              color: colors.text || '#2B2B2B',
              opacity: 0.8
            }}
          >
            {settings?.weddingDate ? new Date(settings.weddingDate).toLocaleDateString('es-MX', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            }) : getShortWeddingDate()}
          </p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            onClick={onOpenRSVP}
            className="inline-block px-12 py-4 border-2 text-sm tracking-[0.2em] uppercase transition-all duration-300 shadow-lg"
            style={{ 
              fontFamily: fonts.body || 'Montserrat',
              borderColor: colors.primary || '#8B4444',
              color: colors.primary || '#8B4444'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary || '#8B4444'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = colors.primary || '#8B4444'
            }}
          >
            Confirmar Asistencia
          </motion.button>
        </motion.div>
      </div>

      {/* Indicadores de slides - solo mostrar si hay imágenes y más de un slide */}
      {showImages && slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all`}
              style={{
                backgroundColor: currentSlide === index 
                  ? (colors.primary || '#8B4444')
                  : `${colors.primary || '#8B4444'}80`,
                width: currentSlide === index ? '2rem' : '0.75rem'
              }}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

// Hero tipo Video (estilo Arrebol)
function HeroVideo({ onOpenRSVP, settings, design }: HeroSliderDynamicProps) {
  const [localLoading, setLocalLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const colors = design?.colors || {}
  const fonts = design?.fonts || {}
  const videoUrl = settings?.videoUrl || '/videos/hero-video.mp4'

  useEffect(() => {
    setLocalLoading(true)
    const video = videoRef.current
    const startTime = Date.now()

    if (video) {
      const handleCanPlay = () => {
        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(0, 1000 - elapsedTime)
        
        setTimeout(() => {
          video.play().catch(e => console.log("Play error:", e))
          setLocalLoading(false)
        }, remainingTime)
      }
      
      video.addEventListener('canplay', handleCanPlay)
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay)
      }
    }
  }, [])

  return (
    <section 
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: colors.background || '#FAF8F5' }}
    >
      {/* Video Hero en loop con baja opacidad */}
      <video
        ref={videoRef}
        src={videoUrl}
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover grayscale opacity-10 z-0"
      />
      
      {/* Loader */}
      <div 
        className={`absolute inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${
          localLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: colors.background || '#FAF8F5' }}
      >
        <h1 
          className="text-xl md:text-2xl"
          style={{ 
            fontFamily: fonts.heading || 'Cormorant',
            color: colors.text || '#2B2B2B'
          }}
        >
          {settings?.title?.toUpperCase() || `${settings?.brideName?.toUpperCase() || 'ANA'} & ${settings?.groomName?.toUpperCase() || 'CARLOS'}`}
        </h1>
      </div>
      
      <div className="relative z-20 flex h-full items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-center"
        >
          <h1 
            className="text-6xl md:text-8xl mb-8" 
            style={{ 
              fontFamily: fonts.heading || 'Cormorant',
              letterSpacing: '0.02em',
              color: colors.text || '#2B2B2B'
            }}
          >
            {settings?.title || `${settings?.brideName || 'Ana'} & ${settings?.groomName || 'Carlos'}`}
          </h1>
          <p 
            className="text-xl md:text-2xl mb-12 tracking-wider uppercase"
            style={{ 
              fontFamily: fonts.body || 'Montserrat',
              color: colors.text || '#2B2B2B',
              opacity: 0.8
            }}
          >
            {settings?.weddingDate ? new Date(settings.weddingDate).toLocaleDateString('es-MX', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            }) : getShortWeddingDate()}
          </p>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            onClick={onOpenRSVP}
            className="px-12 py-4 border-2 transition-all duration-300 text-sm tracking-[0.2em] uppercase"
            style={{ 
              fontFamily: fonts.body || 'Montserrat',
              borderColor: colors.primary || '#8B4444',
              color: colors.primary || '#8B4444'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary || '#8B4444'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = colors.primary || '#8B4444'
            }}
          >
            Confirmar Asistencia
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

// Hero tipo Minimalista (estilo Arrebol)
function HeroMinimal({ onOpenRSVP, settings, design }: HeroSliderDynamicProps) {
  const colors = design?.colors || {}
  const fonts = design?.fonts || {}
  const slides = settings?.slides || defaultSlides
  const mainImage = slides[0]?.image || '/images/hero/5.jpg'

  return (
    <section 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-20 gap-8"
      style={{ backgroundColor: colors.background || '#FAF8F5' }}
    >
      <h1 
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center tracking-tight leading-none"
        style={{ 
          fontFamily: fonts.heading || 'Cormorant',
          color: colors.text || '#2B2B2B',
          letterSpacing: '0.02em'
        }}
      >
        {settings?.title?.toUpperCase() || `${settings?.brideName?.toUpperCase() || 'ANA'} & ${settings?.groomName?.toUpperCase() || 'CARLOS'}`}
      </h1>

      <div className="relative w-full max-w-[280px] md:max-w-[320px] lg:max-w-[360px] aspect-[3/4] overflow-hidden">
        <Image
          src={mainImage}
          alt="Pareja"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="text-center">
        <p 
          className="text-sm md:text-base tracking-wider mb-6"
          style={{ 
            fontFamily: fonts.heading || 'Cormorant',
            color: colors.text || '#2B2B2B'
          }}
        >
          {settings?.weddingDate ? new Date(settings.weddingDate).toLocaleDateString('es-MX', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          }) : getShortWeddingDate()}
        </p>
        <button
          onClick={onOpenRSVP}
          className="px-10 py-3 border-2 transition-all duration-300"
          style={{ 
            fontFamily: fonts.body || 'Montserrat',
            borderColor: colors.primary || '#8B4444',
            color: colors.primary || '#8B4444'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary || '#8B4444'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = colors.primary || '#8B4444'
          }}
        >
          CONFIRMAR ASISTENCIA
        </button>
      </div>
    </section>
  )
}
