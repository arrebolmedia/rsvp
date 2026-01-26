'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { WEDDING_DATE } from '@/lib/weddingDate'

export default function Countdown({ settings }: { settings?: any }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Usar la fecha configurada o la fecha por defecto
      const targetDate = settings?.targetDate ? new Date(settings.targetDate) : WEDDING_DATE
      
      // Obtener la hora actual
      const now = new Date()
      
      // Calcular diferencia en milisegundos
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        // Si la fecha ya pasó, poner todo en 0
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [settings?.targetDate])

  return (
    <section className="py-24 px-4 bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto text-center"
      >
        <h2 className="font-elegant text-4xl md:text-5xl text-foreground mb-12" style={{ fontWeight: 300 }}>
          {settings?.title || 'Cuenta Regresiva'}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { value: timeLeft.days, label: 'Días' },
            { value: timeLeft.hours, label: 'Horas' },
            { value: timeLeft.minutes, label: 'Minutos' },
            { value: timeLeft.seconds, label: 'Segundos' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border-2 border-subtle p-8 hover:border-accent-wine/40 transition-all duration-300"
            >
              <div className="font-elegant text-5xl md:text-6xl text-accent-wine mb-3" style={{ fontWeight: 300 }}>
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-sm tracking-[0.2em] uppercase text-muted-foreground font-light">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
