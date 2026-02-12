'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FaGripVertical, FaTrash, FaImage, FaEdit } from 'react-icons/fa'
import ImageManager from './ImageManager'

interface ImageItem {
  id: number | string
  image?: string
  src?: string
  alt?: string
  height?: string
}

interface DraggableImageListProps {
  items: ImageItem[]
  onChange: (items: ImageItem[]) => void
  onRemove: (index: number) => void
  type?: 'hero' | 'gallery'
}

function SortableItem({
  item,
  index,
  onRemove,
  type,
  onImageSelect,
  onFieldChange,
}: {
  item: ImageItem
  index: number
  onRemove: (index: number) => void
  type: 'hero' | 'gallery'
  onImageSelect: (index: number, url: string) => void
  onFieldChange?: (index: number, field: string, value: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const [showImageManager, setShowImageManager] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const imagePath = item.image || item.src || ''

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-white border-2 rounded-lg p-4 mb-3 ${
          isDragging ? 'border-primary-500 shadow-lg' : 'border-gray-200'
        }`}
      >
        <div className="flex gap-4">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="flex items-center cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          >
            <FaGripVertical size={20} />
          </div>

          {/* Image Preview */}
          <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
            {imagePath ? (
              <img
                src={imagePath}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement!.innerHTML = '<div class="text-gray-400 text-center"><svg class="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" /></svg></div>'
                }}
              />
            ) : (
              <FaImage className="text-gray-400" size={32} />
            )}
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Imagen {index + 1}
              </label>
              <button
                type="button"
                onClick={() => setShowImageManager(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors text-sm"
              >
                <FaEdit />
                {imagePath ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
              </button>
              {imagePath && (
                <p className="text-xs text-gray-500 mt-1">{imagePath}</p>
              )}
            </div>
            {type === 'gallery' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Altura
                </label>
                <select
                  value={item.height || 'short'}
                  onChange={(e) => onFieldChange && onFieldChange(index, 'height', e.target.value)}
                  className="w-full text-sm rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border"
                >
                  <option value="short">Corta</option>
                  <option value="tall">Alta</option>
                </select>
              </div>
            )}
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onRemove(index)}
            className="flex-shrink-0 self-start text-red-600 hover:text-red-800 p-2"
          title="Eliminar imagen"
        >
          <FaTrash />
        </button>
      </div>
    </div>

    <ImageManager
      isOpen={showImageManager}
      onClose={() => setShowImageManager(false)}
      onSelectImage={(url) => onImageSelect(index, url)}
      currentImage={imagePath}
    />
  </>
  )
}

export default function DraggableImageList({
  items,
  onChange,
  onRemove,
  type = 'hero',
}: DraggableImageListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      const newItems = arrayMove(items, oldIndex, newIndex)
      onChange(newItems)
    }
  }

  const handleImageSelect = (index: number, url: string) => {
    const newItems = [...items]
    const field = type === 'hero' ? 'image' : 'src'
    newItems[index] = { ...newItems[index], [field]: url }
    onChange(newItems)
  }

  const handleFieldChange = (index: number, field: string, value: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    onChange(newItems)
  }

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item, index) => (
            <SortableItem
              key={item.id}
              item={item}
              index={index}
              onRemove={onRemove}
              type={type}
              onImageSelect={(idx, url) => {
                handleImageSelect(idx, url)
              }}
              onFieldChange={handleFieldChange}
            />
          ))}
        </SortableContext>
      </DndContext>

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <FaImage className="mx-auto mb-2 text-gray-400" size={32} />
          <p>No hay imágenes. Haz clic en "Agregar" para añadir una imagen.</p>
        </div>
      )}
    </div>
  )
}
