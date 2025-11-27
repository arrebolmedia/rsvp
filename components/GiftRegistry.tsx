'use client'

import { motion } from 'framer-motion'
import { FaGift, FaStore, FaEnvelope } from 'react-icons/fa'

const registries = [
  {
    icon: FaStore,
    name: 'Liverpool',
    description: 'Mesa de regalos',
    link: 'https://mesaderegalos.liverpool.com.mx',
    eventNumber: '12345678',
  },
  {
    icon: FaStore,
    name: 'Amazon',
    description: 'Lista de deseos',
    link: 'https://www.amazon.com.mx/wedding',
    eventNumber: 'ABCD1234',
  },
]

export default function GiftRegistry() {
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
            Mesa de Regalos
          </h2>
          <div className="w-24 h-px bg-accent-wine mx-auto mb-8"></div>
          <p className="text-foreground/80 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
            Tu presencia es nuestro mejor regalo, pero si deseas obsequiarnos algo, 
            hemos preparado estas opciones:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {registries.map((registry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="border-2 border-subtle p-8 text-center hover:border-accent-wine/40 transition-all duration-300"
            >
              <registry.icon className="text-5xl text-accent-wine mx-auto mb-6" />
              <h3 className="font-elegant text-2xl text-foreground mb-3" style={{ fontWeight: 300 }}>
                {registry.name}
              </h3>
              <p className="text-muted-foreground mb-6 font-light">{registry.description}</p>
              
              {registry.eventNumber && (
                <div className="mb-6">
                  <p className="text-xs text-muted-foreground mb-2 tracking-[0.2em] uppercase font-light">Número de evento:</p>
                  <p className="font-mono text-base text-foreground font-light">
                    {registry.eventNumber}
                  </p>
                </div>
              )}
              
              {registry.link && (
                <a
                  href={registry.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border-2 border-accent-wine text-accent-wine px-6 py-3 text-sm tracking-[0.2em] uppercase font-light hover:bg-accent-wine hover:text-white transition-all duration-300"
                >
                  Ver Mesa
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
