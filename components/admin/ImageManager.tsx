'use client'

import { useState, useEffect, useRef } from 'react'
import { FaTimes, FaUpload, FaImage, FaCheck, FaTrash } from 'react-icons/fa'
import imageCompression from 'browser-image-compression'
import { toast } from 'sonner'

interface ImageManagerProps {
  isOpen: boolean
  onClose: () => void
  onSelectImage: (url: string) => void
  currentImage?: string
}

export default function ImageManager({ isOpen, onClose, onSelectImage, currentImage }: ImageManagerProps) {
  const [images, setImages] = useState<{ url: string; filename: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      fetchImages()
      setSelectedImage(currentImage || null)
    }
  }, [isOpen, currentImage])

  const fetchImages = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/upload')
      if (res.ok) {
        const data = await res.json()
        setImages(data.images || [])
      }
    } catch (error) {
      console.error('Error fetching images:', error)
      toast.error('Error al cargar las imágenes')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Tipo de archivo no válido. Solo se permiten JPEG, PNG y WEBP')
      return
    }

    setUploading(true)
    const toastId = toast.loading('Comprimiendo y subiendo imagen...')

    try {
      // Compress image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type,
      }

      const compressedFile = await imageCompression(file, options)
      
      // Check compressed size
      if (compressedFile.size > 1 * 1024 * 1024) {
        toast.error('La imagen es demasiado grande. Por favor, elige una imagen más pequeña.', { id: toastId })
        setUploading(false)
        return
      }

      // Upload to server
      const formData = new FormData()
      formData.append('file', compressedFile, file.name)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        toast.success(`Imagen subida (${(compressedFile.size / 1024).toFixed(0)}KB)`, { id: toastId })
        await fetchImages()
        setSelectedImage(data.url)
      } else {
        const error = await res.json()
        toast.error(error.error || 'Error al subir la imagen', { id: toastId })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Error al procesar la imagen', { id: toastId })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSelect = () => {
    if (selectedImage) {
      onSelectImage(selectedImage)
      onClose()
    } else {
      toast.error('Por favor, selecciona una imagen')
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-800">Gestor de Imágenes</h2>
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
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaUpload />
              {uploading ? 'Subiendo...' : 'Subir Nueva Imagen'}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Formatos: JPEG, PNG, WEBP. Las imágenes se comprimirán automáticamente a menos de 1MB.
            </p>
          </div>

          {/* Image Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FaImage size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No hay imágenes disponibles</p>
                <p className="text-sm mt-2">Sube tu primera imagen para comenzar</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div
                    key={image.url}
                    onClick={() => setSelectedImage(image.url)}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-4 transition-all ${
                      selectedImage === image.url
                        ? 'border-primary-600 ring-2 ring-primary-300'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                    />
                    {selectedImage === image.url && (
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
              {selectedImage && `Imagen seleccionada: ${images.find(i => i.url === selectedImage)?.filename}`}
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
                disabled={!selectedImage}
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
