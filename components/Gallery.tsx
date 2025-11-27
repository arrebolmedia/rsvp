'use client'

import { motion } from 'framer-motion'

// Placeholder de imágenes - agregar imágenes reales en /public/images/gallery/
const photos = [
  { id: 1, src: '/images/gallery/1.jpg', alt: 'Foto 1', height: 'h-64' },
  { id: 2, src: '/images/gallery/2.jpg', alt: 'Foto 2', height: 'h-80' },
  { id: 3, src: '/images/gallery/3.jpg', alt: 'Foto 3', height: 'h-72' },
  { id: 4, src: '/images/gallery/4.jpg', alt: 'Foto 4', height: 'h-64' },
  { id: 5, src: '/images/gallery/5.jpg', alt: 'Foto 5', height: 'h-80' },
  { id: 6, src: '/images/gallery/6.jpg', alt: 'Foto 6', height: 'h-72' },
  { id: 7, src: '/images/gallery/7.jpg', alt: 'Foto 7', height: 'h-64' },
  { id: 8, src: '/images/gallery/8.jpg', alt: 'Foto 8', height: 'h-80' },
]

export default function Gallery() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-elegant text-5xl md:text-6xl text-foreground mb-6" style={{ fontWeight: 300 }}>
            Nuestra Historia
          </h2>
          <div className="w-24 h-px bg-accent-wine mx-auto mb-8"></div>
          <p className="text-foreground/80 max-w-2xl mx-auto font-light text-base md:text-lg leading-relaxed">
            Algunos momentos especiales que hemos compartido juntos
          </p>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="break-inside-avoid"
            >
              <div className={`${photo.height} bg-accent-blush/20 border border-subtle overflow-hidden hover:border-accent-wine/40 transition-all duration-300`}>
                {/* Placeholder - descomentar cuando tengas imágenes reales */}
                {/* <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                /> */}
                <div className="w-full h-full flex items-center justify-center text-muted-foreground font-light text-sm">
                  Foto {photo.id}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
