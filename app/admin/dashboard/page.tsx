'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { 
  FaUsers, FaCheck, FaClock, FaTimes, 
  FaFileExport, FaFileImport, FaSignOutAlt,
  FaEdit, FaTrash, FaPlus, FaFilter, FaUserFriends
} from 'react-icons/fa'

interface Guest {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  maxCompanions: number
  rsvp?: {
    status: string
    numberOfCompanions: number
    message?: string
    confirmedAt?: string
  }
}

interface Stats {
  totalGuests: number
  confirmed: number
  pending: number
  declined: number
  confirmedWithGuests: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [guests, setGuests] = useState<Guest[]>([])
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'CONFIRMED' | 'PENDING' | 'DECLINED'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    maxCompanions: 0,
    rsvpStatus: '' as 'CONFIRMED' | 'DECLINED' | 'PENDING' | '',
    numberOfCompanions: 0,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (editingGuest) {
      setFormData({
        firstName: editingGuest.firstName,
        lastName: editingGuest.lastName,
        email: editingGuest.email || '',
        phone: editingGuest.phone || '',
        maxCompanions: editingGuest.maxCompanions,
        rsvpStatus: (editingGuest.rsvp?.status as 'CONFIRMED' | 'DECLINED' | 'PENDING') || '',
        numberOfCompanions: editingGuest.rsvp?.numberOfCompanions || 0,
      })
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        maxCompanions: 0,
        rsvpStatus: '',
        numberOfCompanions: 0,
      })
    }
  }, [editingGuest])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData()
    }
  }, [status])

  useEffect(() => {
    applyFilters()
  }, [guests, filter, searchTerm])

  const fetchData = async () => {
    try {
      const [guestsRes, statsRes] = await Promise.all([
        fetch('/api/guests'),
        fetch('/api/stats'),
      ])

      if (guestsRes.ok) {
        const guestsData = await guestsRes.json()
        setGuests(guestsData)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = guests

    // Filtro por estado
    if (filter === 'CONFIRMED') {
      filtered = filtered.filter(g => g.rsvp?.status === 'CONFIRMED')
    } else if (filter === 'PENDING') {
      filtered = filtered.filter(g => !g.rsvp || g.rsvp?.status === 'PENDING')
    } else if (filter === 'DECLINED') {
      filtered = filtered.filter(g => g.rsvp?.status === 'DECLINED')
    }

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(g =>
        `${g.firstName} ${g.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredGuests(filtered)
  }

  const handleExport = async () => {
    try {
      const response = await fetch('/api/guests/export')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invitados-${new Date().toISOString()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting:', error)
      alert('Error al exportar CSV')
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/guests/import', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      if (response.ok) {
        alert(`Importación exitosa: ${result.created} invitados creados, ${result.errors} errores`)
        fetchData()
      } else {
        alert('Error al importar CSV')
      }
    } catch (error) {
      console.error('Error importing:', error)
      alert('Error al importar CSV')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/guests/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDeleteConfirm(null)
        fetchData()
      } else {
        alert('Error al eliminar invitado')
      }
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Error al eliminar invitado')
    }
  }

  const handleSaveGuest = async () => {
    try {
      const url = editingGuest ? `/api/guests/${editingGuest.id}` : '/api/guests'
      const method = editingGuest ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          maxCompanions: formData.maxCompanions,
        }),
      })

      if (response.ok) {
        const savedGuest = await response.json()
        
        // Si hay un estado RSVP seleccionado, actualizar/crear el RSVP
        if (formData.rsvpStatus) {
          await fetch('/api/rsvp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              guestId: savedGuest.id,
              status: formData.rsvpStatus,
              numberOfCompanions: formData.numberOfCompanions,
            }),
          })
        }
        
        setShowAddModal(false)
        setEditingGuest(null)
        fetchData()
      } else {
        alert('Error al guardar invitado')
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('Error al guardar invitado')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Cargando...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-elegant text-3xl text-primary-800">
            Panel de Administración
          </h1>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaSignOutAlt />
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaUsers className="text-2xl text-blue-600" />
                <h3 className="text-gray-600 text-sm">Total Invitados</h3>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.totalGuests}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaCheck className="text-2xl text-green-600" />
                <h3 className="text-gray-600 text-sm">Confirmados</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
              <p className="text-xs text-gray-500 mt-1">
                Invitaciones
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaUserFriends className="text-2xl text-purple-600" />
                <h3 className="text-gray-600 text-sm">Total Asistentes</h3>
              </div>
              <p className="text-3xl font-bold text-purple-600">{stats.confirmedWithGuests}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.confirmed} invitados + {stats.confirmedWithGuests - stats.confirmed} acompañantes
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaClock className="text-2xl text-yellow-600" />
                <h3 className="text-gray-600 text-sm">Pendientes</h3>
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaTimes className="text-2xl text-red-600" />
                <h3 className="text-gray-600 text-sm">No Asisten</h3>
              </div>
              <p className="text-3xl font-bold text-red-600">{stats.declined}</p>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <FaFileExport />
                Exportar CSV
              </button>

              <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer">
                <FaFileImport />
                Importar CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <FaPlus />
                Agregar
              </button>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Buscar invitado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 mt-4 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('CONFIRMED')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'CONFIRMED'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Confirmados
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'PENDING'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilter('DECLINED')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'DECLINED'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              No Asisten
            </button>
          </div>
        </div>

        {/* Tabla de Invitados */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pases
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mensaje
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {guest.firstName} {guest.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {guest.email && <div>{guest.email}</div>}
                      {guest.phone && <div>{guest.phone}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Máx: {guest.maxCompanions + 1}</div>
                      {guest.rsvp?.status === 'CONFIRMED' && (
                        <div className="text-green-600">
                          Confirmados: {guest.rsvp.numberOfCompanions + 1}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          guest.rsvp?.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-800'
                            : guest.rsvp?.status === 'DECLINED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {guest.rsvp?.status === 'CONFIRMED'
                          ? 'Confirmado'
                          : guest.rsvp?.status === 'DECLINED'
                          ? 'No asiste'
                          : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {guest.rsvp?.message || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingGuest(guest)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(guest.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredGuests.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No se encontraron invitados
            </div>
          )}
        </div>
      </main>

      {/* Modal Agregar/Editar */}
      {(showAddModal || editingGuest) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-elegant mb-6">
              {editingGuest ? 'Editar Invitado' : 'Agregar Invitado'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Juan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="juan@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="55 1234 5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de acompañantes permitidos
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.maxCompanions}
                  onChange={(e) => setFormData({ ...formData, maxCompanions: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="0"
                />
              </div>

              {editingGuest && (
                <>
                  <div className="border-t pt-4 mt-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Estado de Confirmación</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado RSVP
                    </label>
                    <select
                      value={formData.rsvpStatus}
                      onChange={(e) => setFormData({ ...formData, rsvpStatus: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Sin respuesta</option>
                      <option value="PENDING">Pendiente</option>
                      <option value="CONFIRMED">Confirmado</option>
                      <option value="DECLINED">No asiste</option>
                    </select>
                  </div>

                  {formData.rsvpStatus === 'CONFIRMED' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de acompañantes confirmados
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={formData.maxCompanions}
                        value={formData.numberOfCompanions}
                        onChange={(e) => setFormData({ ...formData, numberOfCompanions: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingGuest(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveGuest}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-elegant mb-4">Confirmar Eliminación</h2>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar este invitado? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
