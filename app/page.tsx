'use client'

import { useState } from 'react'
import HeroSlider from '@/components/HeroSlider'
import WelcomeMessage from '@/components/WelcomeMessage'
import Countdown from '@/components/Countdown'
import Itinerary from '@/components/Itinerary'
import Gallery from '@/components/Gallery'
import DressCode from '@/components/DressCode'
import GiftRegistry from '@/components/GiftRegistry'
import RSVPButton from '@/components/RSVPButton'
import RSVPModal from '@/components/RSVPModal'
import SmoothScroll from '@/components/SmoothScroll'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-white">
      <SmoothScroll />
      <HeroSlider onOpenRSVP={() => setIsModalOpen(true)} />
      <WelcomeMessage />
      <Countdown />
      <Itinerary />
      <Gallery />
      <DressCode />
      <GiftRegistry />
      <RSVPButton />
      
      <RSVPModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <footer className="bg-primary-900 text-white py-8 text-center">
        <p className="text-sm">© 2025 - Creado con amor para nuestra boda</p>
      </footer>
    </main>
  )
}
