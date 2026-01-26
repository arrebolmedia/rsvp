'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import RSVPModal from './RSVPModal'

export default function RSVPButton({ settings }: { settings?: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const title = settings?.title || '¿Nos Acompañas?'
  const description = settings?.description || 'Por favor, confírmanos tu asistencia antes del 1 de junio de 2025'
  const buttonText = settings?.buttonText || 'Confirmar Asistencia'

  return (
    <>
      <section className="py-24 px-4 bg-gradient-to-br from-accent-wine to-accent-terracotta text-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-elegant text-5xl md:text-6xl mb-8" style={{ fontWeight: 300 }}>
            {title}
          </h2>
          <div className="w-24 h-px bg-white/40 mx-auto mb-10"></div>
          <p className="text-base md:text-lg mb-10 text-white/90 font-light leading-relaxed">
            {description}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-block px-12 py-4 border-2 border-white text-white font-light text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-accent-wine transition-all duration-300"
          >
            {buttonText}
          </button>
        </motion.div>
      </section>

      <RSVPModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
