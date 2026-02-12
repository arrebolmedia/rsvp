'use client'

import { useState, useEffect, memo, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaSave, FaPlus, FaTrash, FaSync, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { Toaster, toast } from 'sonner'
import { validateSection } from '@/lib/validationSchemas'
import DraggableImageList from '@/components/admin/DraggableImageList'
import IconPicker from '@/components/admin/IconPicker'
import ImageManager from '@/components/admin/ImageManager'
import VideoManager from '@/components/admin/VideoManager'

export default function ContentEditorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [originalSettings, setOriginalSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('design')
  const [showHeroImageModal, setShowHeroImageModal] = useState(false)
  const [showGalleryImageModal, setShowGalleryImageModal] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchSettings()
    }
  }, [status, router])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
        setOriginalSettings(JSON.parse(JSON.stringify(data))) // Deep copy
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (section: string) => {
    console.log('=== HANDLE SAVE DEBUG ===')
    console.log('Section:', section)
    console.log('Data to save:', settings[section])
    
    // Validate data before saving
    const validationResult = validateSection(section, settings[section])
    
    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error.issues)
      const errors = validationResult.error.issues.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('\n')
      toast.error('Errores de validación', {
        description: errors,
        duration: 5000,
      })
      return
    }

    console.log('Validation passed, sending to API...')
    setSaving(true)
    const toastId = toast.loading('Guardando cambios...')
    try {
      const payload = {
        section,
        content: settings[section]
      }
      console.log('Payload:', JSON.stringify(payload, null, 2))
      
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      console.log('Response status:', res.status)
      
      if (res.ok) {
        const responseData = await res.json()
        console.log('Save successful, response:', responseData)
        toast.success('Cambios guardados correctamente', { 
          id: toastId,
          icon: <FaCheckCircle />
        })
        await fetchSettings() // Refetch para mostrar datos actualizados
        
        // Notificar a ventanas de preview abiertas que se actualicen
        if (typeof window !== 'undefined') {
          // Buscar todas las ventanas abiertas y enviar mensaje
          window.postMessage({ type: 'SETTINGS_UPDATED' }, '*')
        }
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

  const handleChange = useCallback((section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }, [])

  const handleArrayChange = useCallback((section: string, arrayName: string, index: number, field: string, value: any) => {
    setSettings(prev => {
      const newArray = [...(prev[section][arrayName] || [])]
      newArray[index] = { ...newArray[index], [field]: value }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayName]: newArray
        }
      }
    })
  }, [])

  const handleAddItem = useCallback((section: string, arrayName: string, newItem: any) => {
    setSettings(prev => {
      const newArray = [...(prev[section][arrayName] || []), newItem]
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayName]: newArray
        }
      }
    })
  }, [])

  const handleRemoveItem = useCallback((section: string, arrayName: string, index: number) => {
    setSettings(prev => {
      const newArray = [...(prev[section][arrayName] || [])]
      newArray.splice(index, 1)
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayName]: newArray
        }
      }
    })
  }, [])

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

  const handleVideoSelect = (url: string) => {
    handleChange('hero', 'videoUrl', url)
    setShowVideoModal(false)
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
            {['design', 'hero', 'welcome', 'countdown', 'itinerary', 'gallery', 'dressCode', 'accommodation', 'giftRegistry', 'rsvp'].map(section => {
              const sectionLabels: Record<string, string> = {
                design: 'Diseño',
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
                    design: 'Diseño',
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
            </div>
            <div className="flex gap-2">
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
                disabled={saving}
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
              settings,
              handleChange, 
              handleArrayChange, 
              handleAddItem, 
              handleRemoveItem, 
              handleLoadDefaults,
              () => setShowHeroImageModal(true),
              () => setShowGalleryImageModal(true),
              () => setShowVideoModal(true)
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
      <VideoManager
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        onSelectVideo={handleVideoSelect}
        currentVideo={settings.hero?.videoUrl}
      />
    </div>
  )
}

// Helper components moved outside renderForm to prevent re-creation on each render
// Memoized to prevent unnecessary re-renders
const Input = memo(({ 
  label, 
  field, 
  type = 'text',
  value,
  onChange
}: { 
  label: string
  field: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border"
    />
  </div>
))

Input.displayName = 'Input'

const TextArea = memo(({ 
  label, 
  field, 
  rows = 3,
  value,
  onChange
}: { 
  label: string
  field: string
  rows?: number
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border"
    />
  </div>
))

TextArea.displayName = 'TextArea'

const DateTimeInput = memo(({ 
  label, 
  field,
  value,
  onChange
}: { 
  label: string
  field: string
  value: string
  onChange: (isoString: string) => void
}) => {
  // Convertir de ISO con timezone a datetime-local format
  const isoToLocal = (isoString: string) => {
    if (!isoString) return ''
    try {
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
        value={isoToLocal(value)}
        onChange={e => onChange(localToISO(e.target.value))}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border"
      />
      <p className="text-xs text-gray-500 mt-1">
        Hora de México (UTC-6). Valor guardado: {value || 'No establecido'}
      </p>
    </div>
  )
})

DateTimeInput.displayName = 'DateTimeInput'

// Wrapper components that connect to section data
const InputField = memo(({ 
  label, 
  field, 
  type = 'text',
  section,
  data,
  onChange
}: { 
  label: string
  field: string
  type?: string
  section: string
  data: any
  onChange: (section: string, field: string, value: any) => void
}) => (
  <Input
    label={label}
    field={field}
    type={type}
    value={data[field] || ''}
    onChange={(e) => onChange(section, field, e.target.value)}
  />
))

InputField.displayName = 'InputField'

const TextAreaField = memo(({ 
  label, 
  field, 
  rows = 3,
  section,
  data,
  onChange
}: { 
  label: string
  field: string
  rows?: number
  section: string
  data: any
  onChange: (section: string, field: string, value: any) => void
}) => (
  <TextArea
    label={label}
    field={field}
    rows={rows}
    value={data[field] || ''}
    onChange={(e) => onChange(section, field, e.target.value)}
  />
))

TextAreaField.displayName = 'TextAreaField'

const DateTimeField = memo(({ 
  label, 
  field,
  section,
  data,
  onChange
}: { 
  label: string
  field: string
  section: string
  data: any
  onChange: (section: string, field: string, value: any) => void
}) => (
  <DateTimeInput
    label={label}
    field={field}
    value={data[field] || ''}
    onChange={(isoString) => onChange(section, field, isoString)}
  />
))

DateTimeField.displayName = 'DateTimeField'

function renderForm(
  section: string, 
  data: any,
  settings: any,
  onChange: (section: string, field: string, value: any) => void,
  onArrayChange: (section: string, arrayName: string, index: number, field: string, value: any) => void,
  onAddItem: (section: string, arrayName: string, newItem: any) => void,
  onRemoveItem: (section: string, arrayName: string, index: number) => void,
  onLoadDefaults: (section: string) => void,
  onOpenHeroImageModal: () => void,
  onOpenGalleryImageModal: () => void,
  onOpenVideoModal: () => void
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

  switch (section) {
    case 'design':
      return (
        <>
          {/* Tipo de Hero */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estilo de Portada (Hero)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Opción 1: Clásico */}
              <div
                onClick={() => onChange(section, 'heroType', 'classic')}
                className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all ${
                  data.heroType === 'classic'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded mb-3 flex items-center justify-center">
                  <span className="text-xs text-gray-600">Slider de imágenes</span>
                </div>
                <h3 className="font-medium text-gray-900">Clásico</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Slider de imágenes con transiciones suaves
                </p>
              </div>

              {/* Opción 2: Video Arrebol */}
              <div
                onClick={() => onChange(section, 'heroType', 'video')}
                className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all ${
                  data.heroType === 'video'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="aspect-video bg-black rounded mb-3 flex items-center justify-center">
                  <span className="text-xs text-white">Video B&N</span>
                </div>
                <h3 className="font-medium text-gray-900">Arrebol Video</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Video en blanco y negro con texto central
                </p>
              </div>

              {/* Opción 3: Minimalista */}
              <div
                onClick={() => onChange(section, 'heroType', 'minimal')}
                className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all ${
                  data.heroType === 'minimal'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center">
                  <span className="text-xs text-gray-600">Imagen única</span>
                </div>
                <h3 className="font-medium text-gray-900">Arrebol Minimalista</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Imagen estática con título superior
                </p>
              </div>
            </div>
          </div>

          {/* Nota informativa sobre contenido multimedia */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Nota:</strong> Las imágenes y videos se gestionan en la sección <strong>"Portada"</strong>.
              {data.heroType === 'video' && ' Ve a Portada para subir tu video.'}
              {data.heroType === 'classic' && ' Ve a Portada para gestionar las imágenes del slider.'}
              {data.heroType === 'minimal' && ' Ve a Portada para seleccionar la imagen principal.'}
            </p>
          </div>

          {/* Paletas Predefinidas */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Paletas de Colores Predefinidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Paleta 1: Terracota & Vino */}
              <div
                onClick={() => onChange(section, 'colors', {
                  primary: '#8B4444',
                  secondary: '#C87259',
                  accent: '#D4AF37',
                  text: '#2B2B2B',
                  background: '#FAF8F5'
                })}
                className="cursor-pointer border-2 rounded-lg p-4 transition-all hover:border-primary-600 hover:shadow-lg"
                style={{
                  borderColor: data.colors?.primary === '#8B4444' ? '#8B4444' : '#d1d5db',
                  backgroundColor: data.colors?.primary === '#8B4444' ? '#fef2f2' : 'white'
                }}
              >
                <div className="flex gap-2 mb-3">
                  <div className="w-full h-12 rounded" style={{backgroundColor: '#8B4444'}}></div>
                  <div className="w-full h-12 rounded" style={{backgroundColor: '#C87259'}}></div>
                  <div className="w-full h-12 rounded" style={{backgroundColor: '#D4AF37'}}></div>
                </div>
                <h4 className="font-medium text-sm text-gray-900">Terracota & Vino</h4>
                <p className="text-xs text-gray-600 mt-1">Cálida y elegante</p>
              </div>

              {/* Paleta 2: Beige & Oliva */}
              <div
                onClick={() => onChange(section, 'colors', {
                  primary: '#7C9070',
                  secondary: '#9B8B7E',
                  accent: '#C9ADA7',
                  text: '#3D3D3D',
                  background: '#F8F6F4'
                })}
                className="cursor-pointer border-2 rounded-lg p-4 transition-all hover:border-primary-600 hover:shadow-lg"
                style={{
                  borderColor: data.colors?.primary === '#7C9070' ? '#7C9070' : '#d1d5db',
                  backgroundColor: data.colors?.primary === '#7C9070' ? '#f5f5f4' : 'white'
                }}
              >
                <div className="flex gap-2 mb-3">
                  <div className="w-full h-12 rounded" style={{backgroundColor: '#7C9070'}}></div>
                  <div className="w-full h-12 rounded" style={{backgroundColor: '#9B8B7E'}}></div>
                  <div className="w-full h-12 rounded" style={{backgroundColor: '#C9ADA7'}}></div>
                </div>
                <h4 className="font-medium text-sm text-gray-900">Beige & Oliva</h4>
                <p className="text-xs text-gray-600 mt-1">Natural y suave</p>
              </div>

              {/* Paleta 3: Azul & Dorado */}
              <div
                onClick={() => onChange(section, 'colors', {
                  primary: '#4A6FA5',
                  secondary: '#8B9DC3',
                  accent: '#D4A574',
                  text: '#2C3E50',
                  background: '#F7F9FB'
                })}
                className="cursor-pointer border-2 rounded-lg p-4 transition-all hover:border-primary-600 hover:shadow-lg"
                style={{
                  borderColor: data.colors?.primary === '#4A6FA5' ? '#4A6FA5' : '#d1d5db',
                  backgroundColor: data.colors?.primary === '#4A6FA5' ? '#eff6ff' : 'white'
                }}
              >
                <div className="flex gap-2 mb-3">
                  <div className="w-full h-12 rounded" style={{backgroundColor: '#4A6FA5'}}></div>
                  <div className="w-full h-12 rounded" style={{backgroundColor: '#8B9DC3'}}></div>
                  <div className="w-full h-12 rounded" style={{backgroundColor: '#D4A574'}}></div>
                </div>
                <h4 className="font-medium text-sm text-gray-900">Azul & Dorado</h4>
                <p className="text-xs text-gray-600 mt-1">Clásica y sofisticada</p>
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-4 mt-6">Personalizar Colores</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Primario
                </label>
                <input
                  type="color"
                  value={data.colors?.primary || '#8B4444'}
                  onChange={e => onChange(section, 'colors', {...(data.colors || {}), primary: e.target.value})}
                  className="w-full h-12 rounded border-2 border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={data.colors?.primary || '#8B4444'}
                  onChange={e => onChange(section, 'colors', {...(data.colors || {}), primary: e.target.value})}
                  className="w-full mt-1 p-1 text-xs border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Secundario
                </label>
                <input
                  type="color"
                  value={data.colors?.secondary || '#C87259'}
                  onChange={e => onChange(section, 'colors', {...(data.colors || {}), secondary: e.target.value})}
                  className="w-full h-12 rounded border-2 border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={data.colors?.secondary || '#C87259'}
                  onChange={e => onChange(section, 'colors', {...(data.colors || {}), secondary: e.target.value})}
                  className="w-full mt-1 p-1 text-xs border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color de Acento
                </label>
                <input
                  type="color"
                  value={data.colors?.accent || '#D4AF37'}
                  onChange={e => onChange(section, 'colors', {...(data.colors || {}), accent: e.target.value})}
                  className="w-full h-12 rounded border-2 border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={data.colors?.accent || '#D4AF37'}
                  onChange={e => onChange(section, 'colors', {...(data.colors || {}), accent: e.target.value})}
                  className="w-full mt-1 p-1 text-xs border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color de Texto
                </label>
                <input
                  type="color"
                  value={data.colors?.text || '#2B2B2B'}
                  onChange={e => onChange(section, 'colors', {...(data.colors || {}), text: e.target.value})}
                  className="w-full h-12 rounded border-2 border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={data.colors?.text || '#2B2B2B'}
                  onChange={e => onChange(section, 'colors', {...(data.colors || {}), text: e.target.value})}
                  className="w-full mt-1 p-1 text-xs border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color de Fondo
                </label>
                <input
                  type="color"
                  value={data.colors?.background || '#FAF8F5'}
                  onChange={e => onChange(section, 'colors', {...(data.colors || {}), background: e.target.value})}
                  className="w-full h-12 rounded border-2 border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={data.colors?.background || '#FAF8F5'}
                  onChange={e => onChange(section, 'colors', {...(data.colors || {}), background: e.target.value})}
                  className="w-full mt-1 p-1 text-xs border rounded"
                />
              </div>
            </div>
          </div>

          {/* Tipografía */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tipografía</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuente para Títulos
                  </label>
                  <select
                    value={data.fonts?.heading || 'Cormorant'}
                    onChange={e => onChange(section, 'fonts', {...(data.fonts || {}), heading: e.target.value})}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  >
                    <option value="Cormorant">Cormorant (Elegante y Ligera)</option>
                    <option value="Cinzel">Cinzel (Clásica)</option>
                    <option value="Playfair Display">Playfair Display (Clásica)</option>
                    <option value="Montserrat">Montserrat (Moderna)</option>
                    <option value="Lora">Lora (Serif Moderna)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grosor de Títulos
                  </label>
                  <select
                    value={data.fonts?.headingWeight || 300}
                    onChange={e => onChange(section, 'fonts', {...(data.fonts || {}), headingWeight: parseInt(e.target.value)})}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  >
                    <option value={100}>Ultra Ligera (100)</option>
                    <option value={200}>Extra Ligera (200)</option>
                    <option value={300}>Ligera (300)</option>
                    <option value={400}>Normal (400)</option>
                    <option value={500}>Media (500)</option>
                    <option value={600}>Semi Negrita (600)</option>
                    <option value={700}>Negrita (700)</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-2" style={{fontFamily: data.fonts?.heading || 'Cormorant', fontWeight: data.fonts?.headingWeight || 300}}>
                  Vista previa del texto con esta fuente y grosor
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuente para Texto
                  </label>
                  <select
                    value={data.fonts?.body || 'Montserrat'}
                    onChange={e => onChange(section, 'fonts', {...(data.fonts || {}), body: e.target.value})}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  >
                    <option value="Montserrat">Montserrat</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Roboto">Roboto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grosor de Texto
                  </label>
                  <select
                    value={data.fonts?.bodyWeight || 300}
                    onChange={e => onChange(section, 'fonts', {...(data.fonts || {}), bodyWeight: parseInt(e.target.value)})}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                  >
                    <option value={100}>Ultra Ligera (100)</option>
                    <option value={200}>Extra Ligera (200)</option>
                    <option value={300}>Ligera (300)</option>
                    <option value={400}>Normal (400)</option>
                    <option value={500}>Media (500)</option>
                    <option value={600}>Semi Negrita (600)</option>
                    <option value={700}>Negrita (700)</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-2" style={{fontFamily: data.fonts?.body || 'Montserrat', fontWeight: data.fonts?.bodyWeight || 300}}>
                  Vista previa del texto con esta fuente y grosor
                </p>
              </div>
            </div>
          </div>

          {/* Overlay Opacity */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opacidad del Overlay (oscurecimiento de imágenes)
            </label>
            <input
              type="range"
              min="0"
              max="0.7"
              step="0.1"
              value={data.overlayOpacity || 0.3}
              onChange={e => onChange(section, 'overlayOpacity', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-600 mt-1">
              {Math.round((data.overlayOpacity || 0.3) * 100)}%
            </div>
          </div>
        </>
      )

    case 'hero':
      const heroType = settings.design?.heroType || 'classic'
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Nombre de la Novia" field="brideName" section={section} data={data} onChange={onChange} />
            <InputField label="Nombre del Novio" field="groomName" section={section} data={data} onChange={onChange} />
          </div>
          <DateTimeField label="Fecha y Hora de la Boda" field="weddingDate" section={section} data={data} onChange={onChange} />
          
          {/* Mostrar selector de imágenes para Classic y Minimal */}
          {(heroType === 'classic' || heroType === 'minimal') && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {heroType === 'classic' ? 'Imágenes del Slider' : 'Imagen Principal'}
                </h3>
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
              {heroType === 'minimal' && data.slides && data.slides.length > 1 && (
                <p className="text-xs text-amber-600 mt-2">
                  ⚠️ El Hero Minimalista solo usa la primera imagen.
                </p>
              )}
            </div>
          )}

          {/* Mostrar selector de video para Video */}
          {heroType === 'video' && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Video de Fondo</h3>
                <button 
                  type="button"
                  onClick={onOpenVideoModal}
                  className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                >
                  <FaPlus /> Seleccionar Video
                </button>
              </div>
              {data.videoUrl && (
                <div className="border rounded-lg p-3 bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                  <video 
                    src={data.videoUrl} 
                    className="w-full max-w-md rounded"
                    controls
                    muted
                  />
                </div>
              )}
              {!data.videoUrl && (
                <p className="text-sm text-gray-500 italic py-4 text-center bg-gray-50 rounded-lg">
                  No hay video. Haz clic en "Seleccionar Video" para subir uno.
                </p>
              )}
            </div>
          )}
        </>
      )

    case 'welcome':
      return (
        <>
          <InputField label="Título" field="title" section={section} data={data} onChange={onChange} />
          <TextAreaField label="Mensaje Principal" field="message1" section={section} data={data} onChange={onChange} />
          <TextAreaField label="Mensaje Secundario" field="message2" section={section} data={data} onChange={onChange} />
        </>
      )

    case 'countdown':
      return (
        <>
          <InputField label="Título" field="title" section={section} data={data} onChange={onChange} />
          <DateTimeField label="Fecha y Hora Objetivo" field="targetDate" section={section} data={data} onChange={onChange} />
        </>
      )

    case 'itinerary':
      return (
        <>
          <InputField label="Título" field="title" section={section} data={data} onChange={onChange} />
          
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
                          type="time"
                          value={event.time}
                          onChange={e => onArrayChange(section, 'events', index, 'time', e.target.value)}
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
          <InputField label="Título" field="title" section={section} data={data} onChange={onChange} />
          
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
          <InputField label="Título" field="title" section={section} data={data} onChange={onChange} />
          <InputField label="Subtítulo" field="subtitle" section={section} data={data} onChange={onChange} />
          <TextAreaField label="Descripción" field="description" section={section} data={data} onChange={onChange} rows={3} />
          <TextAreaField label="Nota especial" field="note" section={section} data={data} onChange={onChange} rows={2} />
          
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
          <InputField label="Título" field="title" section={section} data={data} onChange={onChange} />
          <TextAreaField label="Descripción" field="description" section={section} data={data} onChange={onChange} />
          
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
          <InputField label="Título" field="title" section={section} data={data} onChange={onChange} />
          <TextAreaField label="Descripción" field="description" section={section} data={data} onChange={onChange} />
          
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
          <InputField label="Título" field="title" section={section} data={data} onChange={onChange} />
          <TextAreaField label="Descripción" field="description" section={section} data={data} onChange={onChange} rows={2} />
          <InputField label="Texto del Botón" field="buttonText" section={section} data={data} onChange={onChange} />
          
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
