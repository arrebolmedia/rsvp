'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaSave, FaPlus, FaTrash, FaSync, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { Toaster, toast } from 'sonner'
import { validateSection } from '@/lib/validationSchemas'
import DraggableImageList from '@/components/admin/DraggableImageList'
import IconPicker from '@/components/admin/IconPicker'
import ImageManager from '@/components/admin/ImageManager'

export default function ContentEditorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [originalSettings, setOriginalSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showHeroImageModal, setShowHeroImageModal] = useState(false)
  const [showGalleryImageModal, setShowGalleryImageModal] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchSettings()
    }
  }, [status, router])

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
        setOriginalSettings(JSON.parse(JSON.stringify(data))) // Deep copy
        setHasUnsavedChanges(false)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (section: string) => {
    // Validate data before saving
    const validationResult = validateSection(section, settings[section])
    
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('\n')
      toast.error('Errores de validación', {
        description: errors,
        duration: 5000,
      })
      return
    }

    setSaving(true)
    const toastId = toast.loading('Guardando cambios...')
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          content: settings[section]
        }),
      })
      if (res.ok) {
        toast.success('Cambios guardados correctamente', { 
          id: toastId,
          icon: <FaCheckCircle />
        })
        await fetchSettings() // Refetch para mostrar datos actualizados
      } else {
        const error = await res.json()
        toast.error(error.error || 'Error al guardar los cambios', { 
          id: toastId,
          icon: <FaExclamationTriangle />
        })
      }
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('Error de conexión al guardar', { 
        id: toastId,
        icon: <FaExclamationTriangle />
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLoadDefaults = async (section: string) => {
    const toastId = toast.loading('Cargando configuración por defecto...')
    try {
      const res = await fetch('/api/settings/defaults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section }),
      })
      if (res.ok) {
        toast.success('Configuración por defecto cargada', { id: toastId })
        await fetchSettings()
      } else {
        toast.error('Error al cargar configuración por defecto', { id: toastId })
      }
    } catch (error) {
      console.error('Error loading defaults:', error)
      toast.error('Error de conexión', { id: toastId })
    }
  }

  const handleChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    setHasUnsavedChanges(true)
  }

  const handleArrayChange = (section: string, arrayName: string, index: number, field: string, value: any) => {
    const newArray = [...(settings[section][arrayName] || [])]
    newArray[index] = { ...newArray[index], [field]: value }
    handleChange(section, arrayName, newArray)
  }

  const handleAddItem = (section: string, arrayName: string, newItem: any) => {
    const newArray = [...(settings[section][arrayName] || []), newItem]
    handleChange(section, arrayName, newArray)
  }

  const handleRemoveItem = (section: string, arrayName: string, index: number) => {
    const newArray = [...(settings[section][arrayName] || [])]
    newArray.splice(index, 1)
    handleChange(section, arrayName, newArray)
  }

  const handleDiscardChanges = () => {
    if (confirm('¿Estás seguro de que quieres descartar los cambios?')) {
      setSettings(JSON.parse(JSON.stringify(originalSettings)))
      setHasUnsavedChanges(false)
      toast.info('Cambios descartados')
    }
  }

  const handleHeroImageSelect = (url: string) => {
    const newSlide = { id: Date.now(), image: url, alt: 'Imagen de boda' }
    const newSlides = [...(settings.hero?.slides || []), newSlide]
    handleChange('hero', 'slides', newSlides)
    setShowHeroImageModal(false)
  }

  const handleGalleryImageSelect = (url: string) => {
    const newPhoto = { id: Date.now(), src: url, alt: 'Foto de galería', height: 'short' }
    const newPhotos = [...(settings.gallery?.photos || []), newPhoto]
    handleChange('gallery', 'photos', newPhotos)
    setShowGalleryImageModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" richColors />
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-800">
              <FaArrowLeft />
            </Link>
            <h1 className="font-elegant text-3xl text-primary-800">
              Editar Contenido
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow p-4 h-fit">
          <nav className="space-y-2">
            {['hero', 'welcome', 'countdown', 'itinerary', 'gallery', 'dressCode', 'accommodation', 'giftRegistry', 'rsvp'].map(section => {
              const sectionLabels: Record<string, string> = {
                hero: 'Portada',
                welcome: 'Bienvenida',
                countdown: 'Cuenta Regresiva',
                itinerary: 'Cronograma',
                gallery: 'Galería',
                dressCode: 'Código de Vestimenta',
                accommodation: 'Hospedaje',
                giftRegistry: 'Mesa de Regalos',
                rsvp: 'Confirmación (RSVP)',
              }
              
              return (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`w-full text-left px-4 py-2 rounded transition-colors ${
                    activeSection === section ? 'bg-primary-100 text-primary-800 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {sectionLabels[section]}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {(() => {
                  const sectionLabels: Record<string, string> = {
                    hero: 'Portada',
                    welcome: 'Bienvenida',
                    countdown: 'Cuenta Regresiva',
                    itinerary: 'Cronograma',
                    gallery: 'Galería',
                    dressCode: 'Código de Vestimenta',
                    accommodation: 'Hospedaje',
                    giftRegistry: 'Mesa de Regalos',
                    rsvp: 'Confirmación (RSVP)',
                  }
                  return sectionLabels[activeSection] || activeSection
                })()}
              </h2>
              {hasUnsavedChanges && (
                <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                  <FaExclamationTriangle className="text-xs" />
                  Tienes cambios sin guardar
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {hasUnsavedChanges && (
                <button
                  onClick={handleDiscardChanges}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  Descartar
                </button>
              )}
              <button
                onClick={() => {
                  // Save current settings to sessionStorage for preview
                  sessionStorage.setItem('previewSettings', JSON.stringify(settings))
                  window.open('/admin/preview', '_blank')
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Vista Previa
              </button>
              <button
                onClick={() => handleSave(activeSection)}
                disabled={saving || !hasUnsavedChanges}
                className="flex items-center gap-2 px-6 py-2 bg-primary-800 text-white rounded hover:bg-primary-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
          {/* Dynamic Form */}
          <div className="space-y-6">
            {renderForm(
              activeSection, 
              settings[activeSection], 
              handleChange, 
              handleArrayChange, 
              handleAddItem, 
              handleRemoveItem, 
              handleLoadDefaults,
              () => setShowHeroImageModal(true),
              () => setShowGalleryImageModal(true)
            )}
          </div>
        </div>
      </main>

      {/* Image Manager Modals */}
      <ImageManager
        isOpen={showHeroImageModal}
        onClose={() => setShowHeroImageModal(false)}
        onSelectImage={handleHeroImageSelect}
      />
      <ImageManager
        isOpen={showGalleryImageModal}
        onClose={() => setShowGalleryImageModal(false)}
        onSelectImage={handleGalleryImageSelect}
      />
    </div>
  )
}

function renderForm(
  section: string, 
  data: any, 
  onChange: (section: string, field: string, value: any) => void,
  onArrayChange: (section: string, arrayName: string, index: number, field: string, value: any) => void,
  onAddItem: (section: string, arrayName: string, newItem: any) => void,
  onRemoveItem: (section: string, arrayName: string, index: number) => void,
  onLoadDefaults: (section: string) => void,
  onOpenHeroImageModal: () => void,
  onOpenGalleryImageModal: () => void
) {
  if (!data) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 italic mb-4">No hay datos configurados para esta sección.</div>
        <button
          onClick={() => onLoadDefaults(section)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaSync className="animate-spin-slow" />
          Cargar Configuración Por Defecto
        </button>
      </div>
    )
  }

  const Input = ({ label, field, type = 'text' }: { label: string, field: string, type?: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={data[field] || ''}
        onChange={e => onChange(section, field, e.target.value)}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border"
      />
    </div>
  )

  const TextArea = ({ label, field, rows = 3 }: { label: string, field: string, rows?: number }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        rows={rows}
        value={data[field] || ''}
        onChange={e => onChange(section, field, e.target.value)}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border"
      />
    </div>
  )

  // Componente para seleccionar fecha y hora con calendario
  const DateTimeInput = ({ label, field }: { label: string, field: string }) => {
    // Convertir de ISO con timezone a datetime-local format
    const isoToLocal = (isoString: string) => {
      if (!isoString) return ''
      try {
        // Remover el timezone offset para obtener la fecha/hora local
        const match = isoString.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/)
        return match ? match[1] : ''
      } catch {
        return ''
      }
    }

    // Convertir de datetime-local a ISO con timezone de México (-06:00)
    const localToISO = (localString: string) => {
      if (!localString) return ''
      return `${localString}:00-06:00`
    }

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
          type="datetime-local"
          value={isoToLocal(data[field] || '')}
          onChange={e => onChange(section, field, localToISO(e.target.value))}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border"
        />
        <p className="text-xs text-gray-500 mt-1">
          Hora de México (UTC-6). Valor guardado: {data[field] || 'No establecido'}
        </p>
      </div>
    )
  }

  switch (section) {
    case 'hero':
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nombre de la Novia" field="brideName" />
            <Input label="Nombre del Novio" field="groomName" />
          </div>
          <DateTimeInput label="Fecha y Hora de la Boda" field="weddingDate" />
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Imágenes del Slider</h3>
              <button 
                type="button"
                onClick={onOpenHeroImageModal}
                className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
              >
                <FaPlus /> Agregar Imagen
              </button>
            </div>
            <DraggableImageList
              items={data.slides || []}
              onChange={(newSlides) => onChange(section, 'slides', newSlides)}
              onRemove={(index) => onRemoveItem(section, 'slides', index)}
              type="hero"
            />
          </div>
        </>
      )

    case 'welcome':
      return (
        <>
          <Input label="Título" field="title" />
          <TextArea label="Mensaje Principal" field="message1" />
          <TextArea label="Mensaje Secundario" field="message2" />
        </>
      )

    case 'countdown':
      return (
        <>
          <Input label="Título" field="title" />
          <DateTimeInput label="Fecha y Hora Objetivo" field="targetDate" />
        </>
      )

    case 'itinerary':
      return (
        <>
          <Input label="Título" field="title" />
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Eventos</h3>
              <button 
                onClick={() => onAddItem(section, 'events', { icon: 'FaGlassCheers', time: '', title: '', location: '', description: '' })}
                className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
              >
                <FaPlus /> Agregar Evento
              </button>
            </div>
            <div className="space-y-4">
              {data.events?.map((event: any, index: number) => (
                <div key={index} className="border-2 border-gray-200 p-4 rounded-lg bg-white relative">
                  <button 
                    onClick={() => onRemoveItem(section, 'events', index)}
                    className="absolute top-3 right-3 text-red-600 hover:text-red-800 p-2"
                  >
                    <FaTrash />
                  </button>
                  <div className="space-y-4 pr-8">
                    <IconPicker
                      value={event.icon}
                      onChange={(value) => onArrayChange(section, 'events', index, 'icon', value)}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                        <input
                          type="text"
                          value={event.time}
                          onChange={e => onArrayChange(section, 'events', index, 'time', e.target.value)}
                          placeholder="18:00"
                          className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input
                          type="text"
                          value={event.title}
                          onChange={e => onArrayChange(section, 'events', index, 'title', e.target.value)}
                          placeholder="Ceremonia Religiosa"
                          className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                      <input
                        type="text"
                        value={event.location}
                        onChange={e => onArrayChange(section, 'events', index, 'location', e.target.value)}
                        placeholder="Iglesia de San Miguel"
                        className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                      <textarea
                        rows={2}
                        value={event.description}
                        onChange={e => onArrayChange(section, 'events', index, 'description', e.target.value)}
                        placeholder="La ceremonia comenzará puntualmente..."
                        className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )

    case 'gallery':
      return (
        <>
          <Input label="Título" field="title" />
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Fotos</h3>
              <button 
                type="button"
                onClick={onOpenGalleryImageModal}
                className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
              >
                <FaPlus /> Agregar Foto
              </button>
            </div>
            <DraggableImageList
              items={data.photos || []}
              onChange={(newPhotos) => onChange(section, 'photos', newPhotos)}
              onRemove={(index) => onRemoveItem(section, 'photos', index)}
              type="gallery"
            />
          </div>
        </>
      )

    case 'dressCode':
      return (
        <>
          <Input label="Título" field="title" />
          <Input label="Subtítulo" field="subtitle" />
          <TextArea label="Descripción" field="description" rows={3} />
          <TextArea label="Nota especial" field="note" rows={2} />
          
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Íconos de Vestimenta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Ícono 1</h4>
                <IconPicker
                  value={data.icons?.icon1?.icon || 'GiBowTie'}
                  onChange={(value) => {
                    const newIcons = { ...data.icons, icon1: { ...data.icons?.icon1, icon: value } }
                    onChange(section, 'icons', newIcons)
                  }}
                />
                <Input 
                  label="Etiqueta" 
                  field="icons.icon1.label" 
                  value={data.icons?.icon1?.label || ''}
                  onChange={(e: any) => {
                    const newIcons = { ...data.icons, icon1: { ...data.icons?.icon1, label: e.target.value } }
                    onChange(section, 'icons', newIcons)
                  }}
                />
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Ícono 2</h4>
                <IconPicker
                  value={data.icons?.icon2?.icon || 'GiDress'}
                  onChange={(value) => {
                    const newIcons = { ...data.icons, icon2: { ...data.icons?.icon2, icon: value } }
                    onChange(section, 'icons', newIcons)
                  }}
                />
                <Input 
                  label="Etiqueta" 
                  field="icons.icon2.label" 
                  value={data.icons?.icon2?.label || ''}
                  onChange={(e: any) => {
                    const newIcons = { ...data.icons, icon2: { ...data.icons?.icon2, label: e.target.value } }
                    onChange(section, 'icons', newIcons)
                  }}
                />
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Ícono 3</h4>
                <IconPicker
                  value={data.icons?.icon3?.icon || 'FaUserTie'}
                  onChange={(value) => {
                    const newIcons = { ...data.icons, icon3: { ...data.icons?.icon3, icon: value } }
                    onChange(section, 'icons', newIcons)
                  }}
                />
                <Input 
                  label="Etiqueta" 
                  field="icons.icon3.label" 
                  value={data.icons?.icon3?.label || ''}
                  onChange={(e: any) => {
                    const newIcons = { ...data.icons, icon3: { ...data.icons?.icon3, label: e.target.value } }
                    onChange(section, 'icons', newIcons)
                  }}
                />
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Ícono 4</h4>
                <IconPicker
                  value={data.icons?.icon4?.icon || 'GiHighHeel'}
                  onChange={(value) => {
                    const newIcons = { ...data.icons, icon4: { ...data.icons?.icon4, icon: value } }
                    onChange(section, 'icons', newIcons)
                  }}
                />
                <Input 
                  label="Etiqueta" 
                  field="icons.icon4.label" 
                  value={data.icons?.icon4?.label || ''}
                  onChange={(e: any) => {
                    const newIcons = { ...data.icons, icon4: { ...data.icons?.icon4, label: e.target.value } }
                    onChange(section, 'icons', newIcons)
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )

    case 'accommodation':
      return (
        <>
          <Input label="Título" field="title" />
          <TextArea label="Descripción" field="description" />
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Hoteles</h3>
              <button 
                onClick={() => onAddItem(section, 'hotels', { name: '', code: '', address: '', phone: '', url: '#' })}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
              >
                <FaPlus /> Agregar
              </button>
            </div>
            <div className="space-y-4">
              {data.hotels?.map((hotel: any, index: number) => (
                <div key={index} className="border p-4 rounded bg-gray-50 relative">
                  <button 
                    onClick={() => onRemoveItem(section, 'hotels', index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500">Nombre</label>
                      <input
                        type="text"
                        value={hotel.name}
                        onChange={e => onArrayChange(section, 'hotels', index, 'name', e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Código</label>
                      <input
                        type="text"
                        value={hotel.code}
                        onChange={e => onArrayChange(section, 'hotels', index, 'code', e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Teléfono</label>
                      <input
                        type="text"
                        value={hotel.phone}
                        onChange={e => onArrayChange(section, 'hotels', index, 'phone', e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500">Dirección</label>
                      <input
                        type="text"
                        value={hotel.address}
                        onChange={e => onArrayChange(section, 'hotels', index, 'address', e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500">URL</label>
                      <input
                        type="text"
                        value={hotel.url}
                        onChange={e => onArrayChange(section, 'hotels', index, 'url', e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )

    case 'giftRegistry':
      return (
        <>
          <Input label="Título" field="title" />
          <TextArea label="Descripción" field="description" />
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Registros</h3>
              <button 
                onClick={() => onAddItem(section, 'registries', { name: '', description: '', link: '', eventNumber: '' })}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
              >
                <FaPlus /> Agregar
              </button>
            </div>
            <div className="space-y-4">
              {data.registries?.map((registry: any, index: number) => (
                <div key={index} className="border p-4 rounded bg-gray-50 relative">
                  <button 
                    onClick={() => onRemoveItem(section, 'registries', index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Nombre</label>
                      <input
                        type="text"
                        value={registry.name}
                        onChange={e => onArrayChange(section, 'registries', index, 'name', e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Número de Evento</label>
                      <input
                        type="text"
                        value={registry.eventNumber}
                        onChange={e => onArrayChange(section, 'registries', index, 'eventNumber', e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500">Descripción</label>
                      <input
                        type="text"
                        value={registry.description}
                        onChange={e => onArrayChange(section, 'registries', index, 'description', e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500">Link</label>
                      <input
                        type="text"
                        value={registry.link}
                        onChange={e => onArrayChange(section, 'registries', index, 'link', e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )

    case 'rsvp':
      return (
        <>
          <Input label="Título" field="title" />
          <TextArea label="Descripción" field="description" rows={2} />
          <Input label="Texto del Botón" field="buttonText" />
          
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Mostrar fecha límite</label>
              <button
                type="button"
                onClick={() => onChange(section, 'showDeadline', !data.showDeadline)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  data.showDeadline ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    data.showDeadline ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {data.showDeadline && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite</label>
                <input
                  type="date"
                  value={data.deadline || ''}
                  onChange={e => onChange(section, 'deadline', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Fecha límite para confirmar asistencia
                </p>
              </div>
            )}
          </div>
        </>
      )

    default:
      return (
        <div className="bg-yellow-50 p-4 rounded text-yellow-800">
          Formulario no implementado para {section}. <br/>
          Raw Data: <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )
  }
}
