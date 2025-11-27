'use client'

import { motion } from 'framer-motion'

const hotels = [
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

export default function Accommodation() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-elegant text-5xl md:text-6xl text-foreground mb-6" style={{ fontWeight: 300 }}>
            Hospedaje
          </h2>
          <div className="w-24 h-px bg-accent-wine mx-auto mb-8"></div>
          <p className="text-foreground/80 max-w-2xl mx-auto font-light text-base md:text-lg leading-relaxed">
            Para nosotros es muy importante tu seguridad, estos son los lugares que recomendamos para tu instalación.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {hotels.map((hotel, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center flex flex-col items-center"
            >
              <h3 className="font-elegant text-2xl text-foreground mb-4 uppercase tracking-wide" style={{ fontWeight: 300 }}>
                {hotel.name}
              </h3>
              
              <div className="space-y-2 mb-6 text-foreground/70 font-light text-sm md:text-base">
                <p className="font-medium text-accent-wine">
                  Código de evento: {hotel.code}
                </p>
                <p className="max-w-sm mx-auto">
                  {hotel.address}
                </p>
                <p>
                  Tel: {hotel.phone}
                </p>
              </div>

              <a
                href={hotel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-accent-wine text-white text-xs tracking-[0.2em] uppercase hover:bg-primary-900 transition-colors duration-300"
              >
                Más Información
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
