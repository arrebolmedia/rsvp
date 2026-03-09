'use client'

import { motion } from 'framer-motion'
import { FaUniversity } from 'react-icons/fa'

export default function GiftRegistry({ settings }: { settings?: any }) {
  const accounts: { bank: string; accountHolder: string; accountNumber: string }[] = settings?.accounts || []
  const hasAccounts = accounts.length > 0

  if (!hasAccounts && !settings?.registries?.length) return null

  return (
    <section className="py-24 px-4" style={{ backgroundColor: 'var(--background-alt)' }}>
      <div className="max-w-3xl mx-auto">
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
            {settings?.description}
          </p>
        </motion.div>

        {hasAccounts && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-subtle p-8"
          >
            <div className="mb-6">
              {settings?.image ? (
                <img src={settings.image} alt="Mesa de regalos" className="w-32 h-auto rounded-sm mb-4" />
              ) : (
                <FaUniversity className="text-3xl text-accent-terracotta mb-4" />
              )}
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Transferencia bancaria</p>
            </div>
            <div className="divide-y divide-subtle">
              {accounts.map((account, index) => (
                <div key={index} className="py-5 first:pt-0 last:pb-0">
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">{account.bank}</p>
                  <p className="font-elegant text-xl text-foreground mb-1" style={{ fontWeight: 300 }}>
                    {account.accountHolder}
                  </p>
                  <p className="font-mono text-base text-foreground/70 tracking-wider">
                    {account.accountNumber}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
