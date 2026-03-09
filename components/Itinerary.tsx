'use client'

import { motion } from 'framer-motion'
import { FaChurch, FaGlassCheers, FaUtensils, FaMusic, FaSun, FaHeart, FaStar, FaCamera } from 'react-icons/fa'

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
  FaMusic,
  FaSun,
  FaHeart,
  FaStar,
  FaCamera,
}

export default function Itinerary({ settings }: { settings?: any }) {
  const events = settings?.events || defaultEvents

  return (
    <section className="py-24 px-4" style={{ backgroundColor: 'var(--background-alt)' }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-elegant text-5xl md:text-6xl text-foreground mb-6">
            {settings?.title || 'Itinerario'}
          </h2>
          <div className="w-24 h-px bg-accent-blush mx-auto"></div>
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
                className="border border-subtle p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 hover:border-accent-blush/60 transition-all duration-300"
              >
                <div className="flex-shrink-0 text-accent-terracotta">
                  <Icon className="text-4xl" />
                </div>
                
                <div className="flex-grow text-center md:text-left">
                  {event.day && (
                    <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                      {event.day}
                    </p>
                  )}
                  <h3 className="font-elegant text-2xl text-foreground mb-2">
                    {event.title}
                  </h3>
                  <p className="text-foreground/70 mb-1">
                    {event.location}
                  </p>
                  <p className="text-muted-foreground text-sm mb-3">
                    {event.description}
                  </p>
                  <div className="text-accent-terracotta text-sm tracking-[0.2em] uppercase mb-3 whitespace-pre-line">
                    {event.time}
                  </div>
                  {event.dressCode && (
                    <p className="text-sm text-foreground/70">
                      <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground">Dress code: </span>
                      {event.dressCode}
                    </p>
                  )}
                  {event.dressCodeNote && (
                    <p className="text-xs italic text-foreground/60 mt-1">
                      {event.dressCodeNote}
                    </p>
                  )}
                  {event.dressCodeLink && (
                    <a
                      href={event.dressCodeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs tracking-[0.15em] uppercase text-accent-terracotta hover:underline mt-2 inline-block"
                    >
                      Ver dress code →
                    </a>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
