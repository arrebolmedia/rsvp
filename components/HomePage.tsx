'use client'

import { useState } from 'react'
import HeroSlider from '@/components/HeroSlider'
import WelcomeMessage from '@/components/WelcomeMessage'
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

  return (
    <main className="min-h-screen bg-white">
      <SmoothScroll />
      <HeroSlider onOpenRSVP={() => setIsModalOpen(true)} settings={settings.hero} />
      <WelcomeMessage settings={settings.welcome} />
      <Countdown settings={settings.countdown} />
      <Itinerary settings={settings.itinerary} />
      <Gallery settings={settings.gallery} />
      <Accommodation settings={settings.accommodation} />
      <DressCode />
      <GiftRegistry settings={settings.giftRegistry} />
      <RSVPButton />
      
      <RSVPModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <footer className="bg-primary-900 text-white py-8 text-center">
        <p className="text-sm">{settings.footer?.text || '© 2025 | Arrebol Weddings'}</p>
      </footer>
    </main>
  )
}
