'use client'

import { useState, useEffect } from 'react'
import HeroSliderDynamic from '@/components/HeroSliderDynamic'
import Countdown from '@/components/Countdown'
import Itinerary from '@/components/Itinerary'
import Gallery from '@/components/Gallery'
import Accommodation from '@/components/Accommodation'
import DressCode from '@/components/DressCode'
import GiftRegistry from '@/components/GiftRegistry'
import RSVPButton from '@/components/RSVPButton'
import RSVPModal from '@/components/RSVPModal'
import SmoothScroll from '@/components/SmoothScroll'

export default function HomePage({ settings }: { settings: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Inyectar CSS variables dinámicas para fuentes y colores
    if (settings?.design) {
      const root = document.documentElement
      const { colors, fonts } = settings.design
      
      if (colors) {
        root.style.setProperty('--background', colors.background || '#FAF8F5')
        root.style.setProperty('--background-alt', colors.background ? `color-mix(in srgb, ${colors.background} 97%, #8B8B8B)` : '#F8F6F2')
        root.style.setProperty('--foreground', colors.text || '#2B2B2B')
        root.style.setProperty('--accent-terracotta', colors.secondary || '#C67B5C')
        root.style.setProperty('--accent-blush', colors.accent || '#E8C4B8')
        root.style.setProperty('--accent-wine', colors.primary || '#8B5A6F')
      }
      
      if (fonts) {
        root.style.setProperty('--font-heading', fonts.heading || 'Cormorant')
        root.style.setProperty('--font-body', fonts.body || 'Montserrat')
        root.style.setProperty('--font-heading-weight', String(fonts.headingWeight || 300))
        root.style.setProperty('--font-body-weight', String(fonts.bodyWeight || 300))
      }
    }
  }, [settings])

  return (
    <main className="min-h-screen bg-background">
      <SmoothScroll />
      <HeroSliderDynamic 
        onOpenRSVP={() => setIsModalOpen(true)} 
        settings={settings.hero} 
        design={settings.design}
      />
      <Countdown settings={{...settings.countdown, targetDate: settings.hero?.weddingDate}} />
      <Itinerary settings={settings.itinerary} />
      {/* Gallery removida - no hay fotos para esta invitación */}
      {/* <DressCode settings={settings.dressCode} /> */}
      <Accommodation settings={settings.accommodation} />
      <GiftRegistry settings={settings.giftRegistry} />
      <RSVPButton settings={settings.rsvp} />
      
      <RSVPModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <footer className="bg-primary-900 text-white py-8 text-center">
        <p className="text-sm">{settings.footer?.text || '© 2026 | Fernanda & Fernanda'}</p>
      </footer>
    </main>
  )
}
