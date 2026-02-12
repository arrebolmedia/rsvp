'use client'

import { useState, useEffect, useRef } from 'react'
import { FaTimes, FaUpload, FaVideo, FaCheck, FaTrash } from 'react-icons/fa'
import { toast } from 'sonner'

interface VideoManagerProps {
  isOpen: boolean
  onClose: () => void
  onSelectVideo: (url: string) => void
  currentVideo?: string
}

export default function VideoManager({ isOpen, onClose, onSelectVideo, currentVideo }: VideoManagerProps) {
  const [videos, setVideos] = useState<{ url: string; filename: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(currentVideo || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      fetchVideos()
      setSelectedVideo(currentVideo || null)
    }
  }, [isOpen, currentVideo])

  const fetchVideos = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/upload/video')
      if (res.ok) {
        const data = await res.json()
        setVideos(data.videos || [])
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
      toast.error('Error al cargar los videos')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!validTypes.includes(file.type)) {
      toast.error('Tipo de archivo no válido. Solo se permiten MP4, WebM y MOV')
      return
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('El video es demasiado grande. Máximo 50MB')
      return
    }

    setUploading(true)
    const toastId = toast.loading('Subiendo video...')

    try {
      // Upload to server
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        toast.success(`Video subido (${(file.size / 1024 / 1024).toFixed(1)}MB)`, { id: toastId })
        await fetchVideos()
        setSelectedVideo(data.url)
      } else {
        const error = await res.json()
        toast.error(error.error || 'Error al subir el video', { id: toastId })
      }
    } catch (error) {
      console.error('Error uploading video:', error)
      toast.error('Error al procesar el video', { id: toastId })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSelect = () => {
    if (selectedVideo) {
      onSelectVideo(selectedVideo)
      onClose()
    } else {
      toast.error('Por favor, selecciona un video')
    }
  }

  const handleDelete = async (url: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('¿Estás seguro de eliminar este video?')) return

    try {
      const res = await fetch('/api/upload/video', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (res.ok) {
        toast.success('Video eliminado')
        await fetchVideos()
        if (selectedVideo === url) {
          setSelectedVideo(null)
        }
      } else {
        toast.error('Error al eliminar el video')
      }
    } catch (error) {
      console.error('Error deleting video:', error)
      toast.error('Error al eliminar el video')
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-800">Gestor de Videos</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Upload Section */}
          <div className="p-6 border-b bg-gray-50">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaUpload />
              {uploading ? 'Subiendo...' : 'Subir Nuevo Video'}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Formatos: MP4, WebM, MOV. Tamaño máximo: 50MB.
            </p>
          </div>

          {/* Video Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-video bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FaVideo size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No hay videos disponibles</p>
                <p className="text-sm mt-2">Sube tu primer video para comenzar</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {videos.map((video) => (
                  <div
                    key={video.url}
                    onClick={() => setSelectedVideo(video.url)}
                    className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-4 transition-all ${
                      selectedVideo === video.url
                        ? 'border-primary-600 ring-2 ring-primary-300'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <video
                      src={video.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.filename}
                    </div>
                    <button
                      onClick={(e) => handleDelete(video.url, e)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <FaTrash size={12} />
                    </button>
                    {selectedVideo === video.url && (
                      <div className="absolute inset-0 bg-primary-600/20 flex items-center justify-center">
                        <div className="bg-primary-600 text-white rounded-full p-2">
                          <FaCheck size={20} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {selectedVideo && `Video seleccionado: ${videos.find(v => v.url === selectedVideo)?.filename}`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSelect}
                disabled={!selectedVideo}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Seleccionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
