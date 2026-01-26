'use client'

import { motion } from 'framer-motion'
import * as FaIcons from 'react-icons/fa'
import * as Fa6Icons from 'react-icons/fa6'
import * as GiIcons from 'react-icons/gi'

// Map all icons
const iconMap: Record<string, any> = {
  ...FaIcons,
  ...Fa6Icons,
  ...GiIcons,
}

export default function DressCode({ settings }: { settings?: any }) {
  // Default values
  const title = settings?.title || 'Código de Vestimenta'
  const subtitle = settings?.subtitle || 'Etiqueta Formal'
  const description = settings?.description || 'Les pedimos que nos acompañen vestidos de gala. Para los caballeros, traje oscuro o smoking. Para las damas, vestido largo o cocktail elegante.'
  const note = settings?.note || 'Por favor, evitar el uso de color blanco, que está reservado para la novia.'
  
  // Icons from settings
  const icons = settings?.icons || {
    icon1: { icon: 'GiBowTie', label: 'Traje / Smoking' },
    icon2: { icon: 'GiDress', label: 'Vestido Largo' },
    icon3: { icon: 'FaUserTie', label: 'Corbata' },
    icon4: { icon: 'GiHighHeel', label: 'Zapatos Elegantes' },
  }

  const Icon1 = iconMap[icons.icon1?.icon] || iconMap['GiBowTie'] || FaIcons.FaHeart
  const Icon2 = iconMap[icons.icon2?.icon] || iconMap['GiDress'] || FaIcons.FaHeart
  const Icon3 = iconMap[icons.icon3?.icon] || iconMap['FaUserTie'] || FaIcons.FaHeart
  const Icon4 = iconMap[icons.icon4?.icon] || iconMap['GiHighHeel'] || FaIcons.FaHeart

  // Validate icon components
  if (!Icon1 || !Icon2 || !Icon3 || !Icon4) {
    console.error('Invalid icon configuration in DressCode:', { Icon1, Icon2, Icon3, Icon4 })
    return null
  }

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
            {title}
          </h2>
          <div className="w-24 h-px bg-accent-wine mx-auto mb-12"></div>
          
          <div className="border-2 border-subtle p-8 md:p-12">
            <div className="mb-10">
              <div className="flex justify-center gap-6 mb-8 text-5xl text-accent-wine">
                <Icon1 />
                <Icon2 />
              </div>
              <h3 className="font-elegant text-3xl text-foreground mb-6" style={{ fontWeight: 300 }}>
                {subtitle}
              </h3>
              <p className="text-foreground/80 text-base leading-relaxed max-w-2xl mx-auto font-light">
                {description}
              </p>
            </div>

            <div className="border-t border-subtle pt-8">
              <p className="text-muted-foreground italic font-light">
                <strong className="text-foreground font-normal">Nota importante:</strong> {note}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-foreground/70">
              <div className="flex flex-col items-center gap-3">
                <Icon1 className="text-3xl text-accent-wine" />
                <span className="font-light">{icons.icon1?.label}</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Icon2 className="text-3xl text-accent-terracotta" />
                <span className="font-light">{icons.icon2?.label}</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Icon3 className="text-3xl text-accent-wine" />
                <span className="font-light">{icons.icon3?.label}</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Icon4 className="text-3xl text-accent-terracotta" />
                <span className="font-light">{icons.icon4?.label}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
