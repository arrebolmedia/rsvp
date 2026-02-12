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

        <div className="space-y-12">
          {events.map((event: any, index: number) => {
            const Icon = iconMap[event.icon] || FaGlassCheers
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="border border-subtle bg-white/50 rounded-lg shadow-sm"
              >
                {/* Día */}
                <div className="border-b border-subtle px-6 py-4 bg-accent-blush/10">
                  <h3 className="font-elegant text-2xl text-foreground text-center">
                    {event.day}
                  </h3>
                </div>

                {/* Contenido del evento */}
                <div className="p-6 md:p-8 space-y-6">
                  {/* Título del evento */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-accent-terracotta rounded-full text-accent-terracotta mb-4">
                      <Icon className="text-2xl" />
                    </div>
                    <h4 className="font-elegant text-3xl text-foreground mb-2">
                      {event.title}
                    </h4>
                  </div>

                  {/* Descripción */}
                  {event.description && (
                    <div className="border border-subtle/50 rounded p-4 bg-background/30">
                      <p className="text-foreground/80 whitespace-pre-line text-center md:text-left">
                        {event.description}
                      </p>
                    </div>
                  )}

                  {/* Ubicación */}
                  {event.location && (
                    <div className="border border-subtle/50 rounded p-4 bg-background/30">
                      <div className="text-accent-terracotta text-sm tracking-wider uppercase mb-1 font-semibold">Lugar</div>
                      <p className="text-foreground/90 text-lg">{event.location}</p>
                    </div>
                  )}

                  {/* Horario */}
                  {event.time && (
                    <div className="border border-subtle/50 rounded p-4 bg-background/30">
                      <div className="text-accent-terracotta text-sm tracking-wider uppercase mb-1 font-semibold">Horario</div>
                      <p className="text-foreground/90 text-lg whitespace-pre-line">{event.time}</p>
                    </div>
                  )}

                  {/* Código de vestimenta */}
                  {event.dressCode && (
                    <div className="border border-accent-terracotta/30 rounded p-4 bg-accent-blush/5">
                      <div className="text-accent-terracotta text-sm tracking-wider uppercase mb-2 font-semibold">Código de Vestimenta</div>
                      <p className="text-foreground/90 text-lg font-medium">{event.dressCode}</p>
                      {event.dressCodeLink && (
                        <a 
                          href={event.dressCodeLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block mt-3 text-accent-terracotta hover:text-accent-wine transition-colors underline text-sm"
                        >
                          Ver inspiración →
                        </a>
                      )}
                    </div>
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
