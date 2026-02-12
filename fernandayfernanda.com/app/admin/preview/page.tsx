'use client'

import { useEffect, useState } from 'react'
import HomePage from '@/components/HomePage'

export default function PreviewPage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    // Always fetch from database for preview
    fetchSettings()
    
    // Listen for settings updates from parent window
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SETTINGS_UPDATED') {
        // Refetch from database when settings are saved
        fetchSettings(true)
      }
    }
    
    window.addEventListener('message', handleMessage)
    
    // Also listen for storage events (when sessionStorage is updated)
    const handleStorage = () => {
      fetchSettings(true)
    }
    
    window.addEventListener('storage', handleStorage)
    
    return () => {
      window.removeEventListener('message', handleMessage)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const fetchSettings = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      // Add cache busting parameter to force fresh data
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/settings?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      if (response.ok) {
        const data = await response.json()
        console.log('Preview: Datos cargados', data)
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
      if (isRefresh) {
        setTimeout(() => setRefreshing(false), 500)
      }
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
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black px-4 py-2 flex items-center justify-center gap-4 font-medium shadow-lg">
        <span>🔍 MODO VISTA PREVIA</span>
        <button
          onClick={() => fetchSettings(true)}
          disabled={refreshing}
          className="px-3 py-1 bg-black text-yellow-500 rounded text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
          {refreshing ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>
      <div className="pt-10">
        <HomePage settings={settings} />
      </div>
    </>
  )
}
