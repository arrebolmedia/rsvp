import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin - Panel de Gestión',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
