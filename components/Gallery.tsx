'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

// Imágenes de la galería
const defaultPhotos = [
  { id: 1, src: '/images/gallery/2.jpg', alt: 'Foto 2', height: 'h-80' },
  { id: 2, src: '/images/gallery/5.jpg', alt: 'Foto 5', height: 'h-64' },
  { id: 3, src: '/images/gallery/10.jpg', alt: 'Foto 10', height: 'h-72' },
  { id: 4, src: '/images/gallery/13.jpg', alt: 'Foto 13', height: 'h-96' },
  { id: 5, src: '/images/gallery/14.jpg', alt: 'Foto 14', height: 'h-64' },
  { id: 6, src: '/images/gallery/17.jpg', alt: 'Foto 17', height: 'h-80' },
  { id: 7, src: '/images/gallery/20.jpg', alt: 'Foto 20', height: 'h-72' },
  { id: 8, src: '/images/gallery/24.jpg', alt: 'Foto 24', height: 'h-64' },
  { id: 9, src: '/images/gallery/25.jpg', alt: 'Foto 25', height: 'h-80' },
  { id: 10, src: '/images/gallery/28.jpg', alt: 'Foto 28', height: 'h-72' },
]

export default function Gallery({ settings }: { settings?: any }) {
  const photos = settings?.photos || defaultPhotos

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
            {settings?.title || 'Nuestra Historia'}
          </h2>
          <div className="w-24 h-px bg-accent-wine mx-auto mb-8"></div>
          <p className="text-foreground/80 max-w-2xl mx-auto font-light text-base md:text-lg leading-relaxed">
            Algunos momentos especiales que hemos compartido juntos
          </p>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {photos.map((photo: any, index: number) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="break-inside-avoid"
            >
              <div className={`relative ${photo.height} bg-accent-blush/20 border border-subtle overflow-hidden hover:border-accent-wine/40 transition-all duration-300`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
