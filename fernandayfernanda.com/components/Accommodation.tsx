'use client'

import { motion } from 'framer-motion'

const defaultHotels = [
  {
    name: 'HOSTERÍA LAS QUINTAS',
    code: '27BAYR',
    address: 'Blvd. Gustavo Díaz Ordaz 9, Cantarranas, 62448 Cuernavaca, Mor.',
    phone: '777 318 3949',
    url: '#'
  },
  {
    name: 'FLOR DE MAYO',
    code: 'AndreaPamela & Rodrigo',
    address: 'Matamoros 603, Cuernavaca Centro, Centro, 62000 Cuernavaca, Mor.',
    phone: '777 312 1202',
    url: '#'
  },
  {
    name: 'HOTEL CASA AZUL',
    code: 'Andrea & Rodrigo',
    address: 'Gral. Mariano Arista 17, Cuernavaca Centro, Centro, 62000 Cuernavaca, Mor.',
    phone: '777 314 2141',
    url: '#'
  },
  {
    name: 'FIESTA INN CUERNAVACA',
    code: 'Boda Pam y Ro',
    address: 'Carretera México - Acapulco Km 88 S/N, Delicias, 62330 Cuernavaca, Mor.',
    phone: '777 100 8200',
    url: '#'
  },
  {
    name: 'FIESTA AMERICANA SAN ANTONIO EL PUENTE',
    code: 'Boda Pam y Ro',
    address: 'Reforma 2 Fracc, Real del Puente, 62790 Xochitepec, Mor.',
    phone: '777 362 0770',
    url: '#'
  },
  {
    name: 'HOTEL GRAND FIESTA AMERICANA SUMIYA',
    code: 'Boda Pam y Ro',
    address: 'Fraccionamiento Sumiya S/N, Jose G. Parres, 62564 Jiutepec, Mor.',
    phone: '443 310 8137',
    url: '#'
  },
]

export default function Accommodation({ settings }: { settings?: any }) {
  const hotels = settings?.hotels || defaultHotels

  return (
    <section className="py-24 px-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-elegant text-5xl md:text-6xl text-foreground mb-6">
            {settings?.title || 'Hospedaje'}
          </h2>
          <div className="w-24 h-px bg-accent-blush mx-auto mb-8"></div>
          <p className="text-foreground/80 max-w-2xl mx-auto font-light text-base md:text-lg leading-relaxed">
            {settings?.description || 'Para nosotros es muy importante tu seguridad, estos son los lugares que recomendamos para tu instalación.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {hotels.map((hotel: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center flex flex-col items-center"
            >
              <h3 className="font-elegant text-2xl text-foreground mb-4 uppercase tracking-wide">
                {hotel.name}
              </h3>
              
              <div className="space-y-2 mb-6 text-foreground/70 text-sm md:text-base">
                {hotel.description && (
                  <p className="font-medium text-accent">
                    {hotel.description}
                  </p>
                )}
                {hotel.phone && (
                  <p>
                    {hotel.isWhatsApp ? (
                      <a 
                        href={`https://wa.me/${hotel.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent-wine transition-colors"
                      >
                        WhatsApp: {hotel.phone.replace(/^52/, '+52 ').replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4')}
                      </a>
                    ) : (
                      <a 
                        href={`tel:${hotel.phone.replace(/[^0-9]/g, '')}`}
                        className="hover:text-accent-wine transition-colors"
                      >
                        Tel: {hotel.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}
                      </a>
                    )}
                  </p>
                )}
                {hotel.code && (
                  <p className="font-medium text-accent-blush">
                    Código de evento: {hotel.code}
                  </p>
                )}
                {hotel.address && (
                  <p className="max-w-sm mx-auto">
                    {hotel.address}
                  </p>
                )}
              </div>

              {(hotel.url || hotel.link) && (
                <a
                  href={hotel.url || hotel.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 text-white text-xs tracking-[0.2em] uppercase transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--accent-wine)',
                    border: '2px solid var(--accent-wine)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-terracotta)'
                    e.currentTarget.style.borderColor = 'var(--accent-terracotta)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-wine)'
                    e.currentTarget.style.borderColor = 'var(--accent-wine)'
                  }}
                >
                  Más Información
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
