'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import RSVPModal from './RSVPModal'

export default function RSVPButton({ settings }: { settings?: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const title = settings?.title || '¿Nos Acompañas?'
  const description = settings?.description || 'Por favor, confírmanos tu asistencia antes del 1 de junio de 2025'
  const buttonText = settings?.buttonText || 'Confirmar Asistencia'
  const showDeadline = settings?.showDeadline ?? false
  const deadline = settings?.deadline

  // Format deadline if it exists
  const formatDeadline = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <>
      <section className="py-24 px-4 text-white" style={{ background: 'linear-gradient(to bottom right, #1e2a18, #314530)' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-elegant text-5xl md:text-6xl mb-8">
            {title}
          </h2>
          <div className="w-24 h-px bg-white/40 mx-auto mb-10"></div>
          <p className="text-base md:text-lg mb-10 text-white/90 leading-relaxed">
            {description}
          </p>
          {showDeadline && deadline && (
            <p className="text-sm md:text-base mb-6 text-white/80 italic">
              Fecha límite para confirmar: {formatDeadline(deadline)}
            </p>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-block px-12 py-4 border-2 border-white text-white text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-accent-wine transition-all duration-300"
          >
            {buttonText}
          </button>
        </motion.div>
      </section>

      <RSVPModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
