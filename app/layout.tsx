import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'Nuestra Boda - Invitación Digital',
  description: 'Estás cordialmente invitado a nuestra boda',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/igd3jym.css" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
