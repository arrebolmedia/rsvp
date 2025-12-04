'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaSave, FaPlus, FaTrash } from 'react-icons/fa'

export default function ContentEditorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

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
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (section: string) => {
    setSaving(true)
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
        alert('Guardado correctamente')
      } else {
        alert('Error al guardar')
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('Error al guardar')
    } finally {
      setSaving(false)
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

  if (loading) return <div className="p-8 text-center">Cargando...</div>

  return (
    <div className="min-h-screen bg-gray-100">
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
            {['hero', 'welcome', 'countdown', 'itinerary', 'gallery', 'accommodation', 'giftRegistry', 'footer'].map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-4 py-2 rounded capitalize transition-colors ${
                  activeSection === section ? 'bg-primary-100 text-primary-800 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {section === 'giftRegistry' ? 'Mesa de Regalos' : section}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold capitalize text-gray-800">
              {activeSection === 'giftRegistry' ? 'Mesa de Regalos' : activeSection}
            </h2>
            <button
              onClick={() => handleSave(activeSection)}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-primary-800 text-white rounded hover:bg-primary-900 transition-colors disabled:opacity-50"
            >
              <FaSave />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>

          {/* Dynamic Form */}
          <div className="space-y-6">
            {renderForm(activeSection, settings[activeSection], handleChange, handleArrayChange, handleAddItem, handleRemoveItem)}
          </div>
        </div>
      </main>
    </div>
  )
}

function renderForm(
  section: string, 
  data: any, 
  onChange: (section: string, field: string, value: any) => void,
  onArrayChange: (section: string, arrayName: string, index: number, field: string, value: any) => void,
  onAddItem: (section: string, arrayName: string, newItem: any) => void,
  onRemoveItem: (section: string, arrayName: string, index: number) => void
) {
  if (!data) return <div className="text-gray-500 italic">No hay datos configurados para esta sección.</div>

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

  switch (section) {
    case 'hero':
      return (
        <>
          <Input label="Fecha de Boda (ISO)" field="weddingDate" type="datetime-local" />
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Imágenes del Slider</h3>
              <button 
                onClick={() => onAddItem(section, 'slides', { id: Date.now(), image: '', alt: '' })}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
              >
                <FaPlus /> Agregar
              </button>
            </div>
            <div className="space-y-4">
              {data.slides?.map((slide: any, index: number) => (
                <div key={index} className="border p-4 rounded bg-gray-50 relative">
                  <button 
                    onClick={() => onRemoveItem(section, 'slides', index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">URL Imagen</label>
                      <input
                        type="text"
                        value={slide.image}
                        onChange={e => onArrayChange(section, 'slides', index, 'image', e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Texto Alt</label>
                      <input
                        type="text"
                        value={slide.alt}
                        onChange={e => onArrayChange(section, 'slides', index, 'alt', e.target.value)}
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
          <Input label="Fecha Objetivo (ISO)" field="targetDate" type="datetime-local" />
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
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
              >
                <FaPlus /> Agregar
              </button>
            </div>
            <div className="space-y-4">
              {data.events?.map((event: any, index: number) => (
                <div key={index} className="border p-4 rounded bg-gray-50 relative">
                  <button 
                    onClick={() => onRemoveItem(section, 'events', index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Título</label>
                      <input
                        type="text"
                        value={event.title}
                        onChange={e => onArrayChange(section, 'events', index, 'title', e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Hora</label>
                      <input
                        type="text"
                        value={event.time}
                        onChange={e => onArrayChange(section, 'events', index, 'time', e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Ubicación</label>
                      <input
                        type="text"
                        value={event.location}
                        onChange={e => onArrayChange(section, 'events', index, 'location', e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Descripción</label>
                      <input
                        type="text"
                        value={event.description}
                        onChange={e => onArrayChange(section, 'events', index, 'description', e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Icono (Nombre)</label>
                      <input
                        type="text"
                        value={event.icon}
                        onChange={e => onArrayChange(section, 'events', index, 'icon', e.target.value)}
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

    case 'gallery':
      return (
        <>
          <Input label="Título" field="title" />
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Fotos</h3>
              <button 
                onClick={() => onAddItem(section, 'photos', { id: Date.now(), src: '', alt: '', height: 'h-64' })}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
              >
                <FaPlus /> Agregar
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.photos?.map((photo: any, index: number) => (
                <div key={index} className="border p-4 rounded bg-gray-50 relative">
                  <button 
                    onClick={() => onRemoveItem(section, 'photos', index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">URL Imagen</label>
                      <input
                        type="text"
                        value={photo.src}
                        onChange={e => onArrayChange(section, 'photos', index, 'src', e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Alt</label>
                      <input
                        type="text"
                        value={photo.alt}
                        onChange={e => onArrayChange(section, 'photos', index, 'alt', e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Altura (Tailwind class)</label>
                      <input
                        type="text"
                        value={photo.height}
                        onChange={e => onArrayChange(section, 'photos', index, 'height', e.target.value)}
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

    case 'footer':
      return (
        <>
          <Input label="Texto del Footer" field="text" />
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
