'use client'

import { useEffect, useState } from 'react'
import HomePage from '@/components/HomePage'

export default function PreviewPage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try to get preview data from sessionStorage
    const previewData = sessionStorage.getItem('previewSettings')
    
    if (previewData) {
      try {
        const parsedData = JSON.parse(previewData)
        setSettings(parsedData)
        setLoading(false)
      } catch (error) {
        console.error('Error parsing preview data:', error)
        // Fallback to fetching from database
        fetchSettings()
      }
    } else {
      // No preview data, fetch from database
      fetchSettings()
    }
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando vista previa...</p>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No hay datos de vista previa disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Preview Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black px-4 py-2 text-center font-medium shadow-lg">
        🔍 MODO VISTA PREVIA - Los cambios no están guardados
      </div>
      <div className="pt-10">
        <HomePage settings={settings} />
      </div>
    </>
  )
}
