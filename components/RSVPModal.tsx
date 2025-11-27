'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaSearch, FaCheck, FaTimes as FaDecline } from 'react-icons/fa'

interface Guest {
  id: string
  firstName: string
  lastName: string
  maxCompanions: number
  rsvp?: {
    status: string
    numberOfCompanions: number
    message?: string
  }
}

interface RSVPModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RSVPModal({ isOpen, onClose }: RSVPModalProps) {
  const [step, setStep] = useState<'search' | 'confirm'>('search')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [searchResults, setSearchResults] = useState<Guest[]>([])
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [numberOfCompanions, setNumberOfCompanions] = useState(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'CONFIRMED' | 'DECLINED'>('CONFIRMED')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setTimeout(() => {
        setStep('search')
        setFirstName('')
        setLastName('')
        setSearchResults([])
        setSelectedGuest(null)
        setNumberOfCompanions(0)
        setMessage('')
        setStatus('CONFIRMED')
        setError('')
        setSuccess(false)
      }, 300)
    }
  }, [isOpen])

  const handleSearch = async () => {
    if (!firstName && !lastName) {
      setError('Por favor ingresa al menos un nombre o apellido')
      return
    }

    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      if (firstName) params.append('firstName', firstName)
      if (lastName) params.append('lastName', lastName)

      const response = await fetch(`/api/guests/search?${params}`)
      const data = await response.json()

      if (response.ok) {
        setSearchResults(data)
        if (data.length === 0) {
          setError('No se encontró ningún invitado con ese nombre')
        }
      } else {
        setError(data.error || 'Error al buscar invitado')
      }
    } catch (err) {
      setError('Error de conexión. Por favor intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectGuest = (guest: Guest) => {
    setSelectedGuest(guest)
    setNumberOfCompanions(guest.rsvp?.numberOfCompanions || 0)
    setMessage(guest.rsvp?.message || '')
    setStatus(guest.rsvp?.status === 'DECLINED' ? 'DECLINED' : 'CONFIRMED')
    setStep('confirm')
  }

  const handleSubmit = async () => {
    if (!selectedGuest) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestId: selectedGuest.id,
          status,
          numberOfCompanions,
          message,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setError(data.error || 'Error al confirmar asistencia')
      }
    } catch (err) {
      setError('Error de conexión. Por favor intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-accent-wine to-accent-terracotta text-white p-8 flex justify-between items-center">
                <h2 className="font-elegant text-3xl md:text-4xl" style={{ fontWeight: 300 }}>Confirmar Asistencia</h2>
                <button
                  onClick={onClose}
                  className="text-white hover:text-white/70 transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 border-2 border-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaCheck className="text-4xl text-green-600" />
                    </div>
                    <h3 className="font-elegant text-3xl text-foreground mb-4" style={{ fontWeight: 300 }}>
                      ¡Confirmación Exitosa!
                    </h3>
                    <p className="text-foreground/80 font-light">
                      {status === 'CONFIRMED' 
                        ? '¡Gracias por confirmar! Nos vemos pronto.'
                        : 'Lamentamos que no puedas asistir.'}
                    </p>
                  </motion.div>
                ) : step === 'search' ? (
                  <>
                    <p className="text-foreground/80 mb-8 font-light text-base">
                      Por favor, busca tu nombre en nuestra lista de invitados:
                    </p>

                    <div className="space-y-6 mb-8">
                      <div>
                        <label className="block text-sm tracking-[0.2em] uppercase text-muted-foreground mb-3 font-light">
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-3 border border-subtle focus:ring-1 focus:ring-accent-wine focus:border-accent-wine font-light transition-all"
                          placeholder="Tu nombre"
                        />
                      </div>

                      <div>
                        <label className="block text-sm tracking-[0.2em] uppercase text-muted-foreground mb-3 font-light">
                          Apellido
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-3 border border-subtle focus:ring-1 focus:ring-accent-wine focus:border-accent-wine font-light transition-all"
                          placeholder="Tu apellido"
                        />
                      </div>

                      <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="w-full border-2 border-accent-wine text-accent-wine py-4 font-light text-sm tracking-[0.2em] uppercase hover:bg-accent-wine hover:text-white transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        <FaSearch />
                        {loading ? 'Buscando...' : 'Buscar'}
                      </button>
                    </div>

                    {error && (
                      <div className="border border-red-300 text-red-600 bg-red-50/50 p-4 mb-4 font-light text-sm">
                        {error}
                      </div>
                    )}

                    {searchResults.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-elegant text-xl text-foreground mb-4" style={{ fontWeight: 300 }}>
                          Resultados ({searchResults.length}):
                        </h3>
                        {searchResults.map((guest) => (
                          <button
                            key={guest.id}
                            onClick={() => handleSelectGuest(guest)}
                            className="w-full p-5 border border-subtle hover:bg-accent-wine/5 hover:border-accent-wine/40 transition-all duration-300 text-left"
                          >
                            <div className="font-elegant text-lg text-foreground" style={{ fontWeight: 300 }}>
                              {guest.firstName} {guest.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground font-light mt-1">
                              Pases: {guest.maxCompanions + 1} 
                              {guest.rsvp && (
                                <span className={`ml-2 ${
                                  guest.rsvp.status === 'CONFIRMED' ? 'text-green-600' : 
                                  guest.rsvp.status === 'DECLINED' ? 'text-red-600' : 
                                  'text-yellow-600'
                                }`}>
                                  • {guest.rsvp.status === 'CONFIRMED' ? 'Confirmado' : 
                                     guest.rsvp.status === 'DECLINED' ? 'No asistirá' : 
                                     'Pendiente'}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mb-8 p-6 border border-subtle">
                      <h3 className="font-elegant text-2xl text-foreground mb-3" style={{ fontWeight: 300 }}>
                        {selectedGuest?.firstName} {selectedGuest?.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground font-light">
                        Total de pases disponibles: {(selectedGuest?.maxCompanions || 0) + 1}
                      </p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <label className="block text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4 font-light">
                          ¿Asistirás?
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => setStatus('CONFIRMED')}
                            className={`p-6 border-2 transition-all duration-300 ${
                              status === 'CONFIRMED'
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-subtle hover:border-green-400'
                            }`}
                          >
                            <FaCheck className="text-2xl mx-auto mb-3" />
                            <div className="font-light text-sm">Sí, asistiré</div>
                          </button>
                          <button
                            onClick={() => setStatus('DECLINED')}
                            className={`p-6 border-2 transition-all duration-300 ${
                              status === 'DECLINED'
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-subtle hover:border-red-400'
                            }`}
                          >
                            <FaDecline className="text-2xl mx-auto mb-3" />
                            <div className="font-light text-sm">No podré asistir</div>
                          </button>
                        </div>
                      </div>

                      {status === 'CONFIRMED' && (
                        <div>
                          <label className="block text-sm tracking-[0.2em] uppercase text-muted-foreground mb-3 font-light">
                            Número de acompañantes (máximo {selectedGuest?.maxCompanions || 0})
                          </label>
                          <select
                            value={numberOfCompanions}
                            onChange={(e) => setNumberOfCompanions(parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-subtle focus:ring-1 focus:ring-accent-wine focus:border-accent-wine font-light transition-all"
                          >
                            {Array.from({ length: (selectedGuest?.maxCompanions || 0) + 1 }, (_, i) => (
                              <option key={i} value={i}>
                                {i} {i === 1 ? 'acompañante' : 'acompañantes'}
                              </option>
                            ))}
                          </select>
                          <p className="text-sm text-muted-foreground mt-2 font-light">
                            Total de asistentes: {numberOfCompanions + 1}
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm tracking-[0.2em] uppercase text-muted-foreground mb-3 font-light">
                          Mensaje (opcional)
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-subtle focus:ring-1 focus:ring-accent-wine focus:border-accent-wine font-light transition-all resize-none"
                          placeholder="Deja un mensaje para los novios..."
                        />
                      </div>

                      {error && (
                        <div className="border border-red-300 text-red-600 bg-red-50/50 p-4 font-light text-sm">
                          {error}
                        </div>
                      )}

                      <div className="flex gap-4">
                        <button
                          onClick={() => setStep('search')}
                          className="flex-1 border-2 border-subtle text-foreground py-4 font-light text-sm tracking-[0.2em] uppercase hover:bg-foreground/5 transition-all duration-300"
                        >
                          Volver
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={loading}
                          className="flex-1 border-2 border-accent-wine bg-accent-wine text-white py-4 font-light text-sm tracking-[0.2em] uppercase hover:bg-accent-wine/90 transition-all duration-300 disabled:opacity-50"
                        >
                          {loading ? 'Confirmando...' : 'Confirmar'}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
