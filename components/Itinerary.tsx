'use client'

import { motion } from 'framer-motion'
import { FaChurch, FaGlassCheers, FaUtensils, FaMusic } from 'react-icons/fa'

const defaultEvents = [
  {
    icon: 'FaChurch',
    time: '16:00',
    title: 'Ceremonia Religiosa',
    location: 'Parroquia San José',
    description: 'Av. Principal 123, Ciudad',
  },
  {
    icon: 'FaGlassCheers',
    time: '18:00',
    title: 'Cóctel de Bienvenida',
    location: 'Jardín del Salón',
    description: 'Recepción con aperitivos y bebidas',
  },
  {
    icon: 'FaUtensils',
    time: '19:30',
    title: 'Cena',
    location: 'Salón Principal',
    description: 'Menú especial preparado para la ocasión',
  },
  {
    icon: 'FaMusic',
    time: '21:00',
    title: 'Fiesta',
    location: 'Pista de Baile',
    description: '¡A bailar hasta el amanecer!',
  },
]

const iconMap: any = {
  FaChurch,
  FaGlassCheers,
  FaUtensils,
  FaMusic
}

export default function Itinerary({ settings }: { settings?: any }) {
  const events = settings?.events || defaultEvents

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-elegant text-5xl md:text-6xl text-foreground mb-6" style={{ fontWeight: 300 }}>
            {settings?.title || 'Itinerario'}
          </h2>
          <div className="w-24 h-px bg-accent-wine mx-auto"></div>
        </motion.div>

        <div className="space-y-8">
          {events.map((event: any, index: number) => {
            const Icon = iconMap[event.icon] || FaGlassCheers
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="border border-subtle p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 hover:border-accent-wine/40 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 border-2 border-accent-wine rounded-full flex items-center justify-center text-accent-wine">
                    <Icon className="text-3xl" />
                  </div>
                </div>
                
                <div className="flex-grow text-center md:text-left">
                  <div className="text-accent-wine font-light text-sm tracking-[0.3em] uppercase mb-3">
                    {event.time}
                  </div>
                  <h3 className="font-elegant text-2xl text-foreground mb-2" style={{ fontWeight: 300 }}>
                    {event.title}
                  </h3>
                  <p className="text-foreground/70 font-light mb-1">
                    {event.location}
                  </p>
                  <p className="text-muted-foreground font-light text-sm">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
