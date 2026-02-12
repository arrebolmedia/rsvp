'use client'

import { motion } from 'framer-motion'
import { FaGift, FaStore, FaEnvelope } from 'react-icons/fa'

const defaultRegistries = [
  {
    icon: 'FaStore',
    name: 'Liverpool',
    description: 'Mesa de regalos',
    link: 'https://mesaderegalos.liverpool.com.mx',
    eventNumber: '12345678',
  },
  {
    icon: 'FaStore',
    name: 'Amazon',
    description: 'Lista de deseos',
    link: 'https://www.amazon.com.mx/wedding',
    eventNumber: 'ABCD1234',
  },
]

const iconMap: any = {
  FaStore,
  FaGift,
  FaEnvelope
}

export default function GiftRegistry({ settings }: { settings?: any }) {
  const registries = settings?.registries || defaultRegistries

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
            {settings?.title || 'Mesa de Regalos'}
          </h2>
          <div className="w-24 h-px bg-accent-blush mx-auto mb-8"></div>
          <p className="text-foreground/80 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
            {settings?.description || 'Tu presencia es nuestro mejor regalo, pero si deseas obsequiarnos algo, hemos preparado estas opciones:'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="border-2 border-subtle bg-white/50 p-8 md:p-12">
            <div className="text-center mb-8">
              <FaGift className="text-5xl text-accent mx-auto mb-6" />
            </div>
            
            {settings?.accounts && settings.accounts.length > 0 && (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground mb-6 tracking-wider uppercase text-center">Cuentas:</p>
                {settings.accounts.map((account: any, index: number) => (
                  <div key={index} className="border border-subtle/50 rounded p-6 bg-background/30">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 tracking-wider uppercase">Banco</p>
                        <p className="text-foreground font-medium">{account.bank}</p>
                      </div>
                      {account.accountNumber && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1 tracking-wider uppercase">Número de cuenta</p>
                          <p className="font-mono text-lg text-foreground">{account.accountNumber}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 tracking-wider uppercase">Titular</p>
                        <p className="text-foreground">{account.accountHolder}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
