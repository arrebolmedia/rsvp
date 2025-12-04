'use client'

import { motion } from 'framer-motion'

export default function WelcomeMessage({ settings }: { settings?: any }) {
  return (
    <section className="py-20 px-4 bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="font-elegant text-5xl md:text-6xl text-foreground mb-6" style={{ fontWeight: 300 }}>
          {settings?.title || 'Nos Casamos'}
        </h2>
        <div className="w-24 h-px bg-accent-wine mx-auto mb-10"></div>
        <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8 font-light">
          {settings?.message1 || 'Nos complace invitarte a celebrar uno de los días más especiales de nuestras vidas.'}
        </p>
        <p className="text-base md:text-lg text-foreground/70 leading-relaxed font-light">
          {settings?.message2 || 'Después de años de amor y complicidad, hemos decidido dar el siguiente paso en nuestra historia juntos. Queremos compartir este momento único contigo y con las personas que más queremos.'}
        </p>
      </motion.div>
    </section>
  )
}
