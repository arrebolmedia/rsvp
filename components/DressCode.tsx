'use client'

import { motion } from 'framer-motion'
import { FaTshirt, FaUserTie } from 'react-icons/fa'
import { GiHighHeel, GiDress, GiBowTie } from 'react-icons/gi'

export default function DressCode() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-elegant text-5xl md:text-6xl text-foreground mb-6" style={{ fontWeight: 300 }}>
            Código de Vestimenta
          </h2>
          <div className="w-24 h-px bg-accent-wine mx-auto mb-12"></div>
          
          <div className="border-2 border-subtle p-8 md:p-12">
            <div className="mb-10">
              <div className="flex justify-center gap-6 mb-8 text-5xl text-accent-wine">
                <GiBowTie />
                <GiDress />
              </div>
              <h3 className="font-elegant text-3xl text-foreground mb-6" style={{ fontWeight: 300 }}>
                Etiqueta Formal
              </h3>
              <p className="text-foreground/80 text-base leading-relaxed max-w-2xl mx-auto font-light">
                Les pedimos que nos acompañen vestidos de gala. Para los caballeros, traje oscuro o smoking. 
                Para las damas, vestido largo o cocktail elegante.
              </p>
            </div>

            <div className="border-t border-subtle pt-8">
              <p className="text-muted-foreground italic font-light">
                <strong className="text-foreground font-normal">Nota importante:</strong> Por favor, evitar el uso de color blanco, 
                que está reservado para la novia.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-foreground/70">
              <div className="flex flex-col items-center gap-3">
                <GiBowTie className="text-3xl text-accent-wine" />
                <span className="font-light">Traje / Smoking</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <GiDress className="text-3xl text-accent-terracotta" />
                <span className="font-light">Vestido Largo</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <FaUserTie className="text-3xl text-accent-wine" />
                <span className="font-light">Corbata</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <GiHighHeel className="text-3xl text-accent-terracotta" />
                <span className="font-light">Zapatos Elegantes</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
