import { z } from 'zod'

// Validation schemas for each content section

export const heroSchema = z.object({
  brideName: z.string().min(1, 'El nombre de la novia es requerido'),
  groomName: z.string().min(1, 'El nombre del novio es requerido'),
  weddingDate: z.string().min(1, 'La fecha de la boda es requerida'),
  slides: z.array(z.object({
    id: z.number(),
    image: z.string().min(1, 'La ruta de la imagen es requerida'),
    alt: z.string().optional(),
  })).min(1, 'Debes tener al menos una imagen'),
})

export const welcomeSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  message1: z.string().min(1, 'El primer mensaje es requerido'),
  message2: z.string().min(1, 'El segundo mensaje es requerido'),
})

export const countdownSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  targetDate: z.string().min(1, 'La fecha objetivo es requerida'),
})

export const itinerarySchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  events: z.array(z.object({
    icon: z.string().min(1, 'El icono es requerido'),
    time: z.string().min(1, 'La hora es requerida'),
    title: z.string().min(1, 'El título del evento es requerido'),
    location: z.string().min(1, 'La ubicación es requerida'),
    description: z.string().min(1, 'La descripción es requerida'),
  })).min(1, 'Debes tener al menos un evento'),
})

export const gallerySchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  photos: z.array(z.object({
    id: z.number(),
    src: z.string().min(1, 'La ruta de la imagen es requerida'),
    alt: z.string().optional(),
    height: z.enum(['tall', 'short']),
  })).min(1, 'Debes tener al menos una foto'),
})

export const dressCodeSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  subtitle: z.string().min(1, 'El subtítulo es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  note: z.string().min(1, 'La nota es requerida'),
  icons: z.object({
    icon1: z.object({
      icon: z.string().min(1, 'El ícono es requerido'),
      label: z.string().min(1, 'La etiqueta es requerida'),
    }),
    icon2: z.object({
      icon: z.string().min(1, 'El ícono es requerido'),
      label: z.string().min(1, 'La etiqueta es requerida'),
    }),
    icon3: z.object({
      icon: z.string().min(1, 'El ícono es requerido'),
      label: z.string().min(1, 'La etiqueta es requerida'),
    }),
    icon4: z.object({
      icon: z.string().min(1, 'El ícono es requerido'),
      label: z.string().min(1, 'La etiqueta es requerida'),
    }),
  }),
})

export const accommodationSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  hotels: z.array(z.object({
    name: z.string().min(1, 'El nombre del hotel es requerido'),
    code: z.string(),
    address: z.string().min(1, 'La dirección es requerida'),
    phone: z.string().min(1, 'El teléfono es requerido'),
    url: z.string().url('Debe ser una URL válida').or(z.literal('')),
  })).min(1, 'Debes tener al menos un hotel'),
})

export const giftRegistrySchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  registries: z.array(z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    description: z.string().min(1, 'La descripción es requerida'),
    link: z.string().url('Debe ser una URL válida').or(z.literal('')),
    eventNumber: z.string(),
  })).min(1, 'Debes tener al menos una opción de regalo'),
})

export const rsvpSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  buttonText: z.string().min(1, 'El texto del botón es requerido'),
  showDeadline: z.boolean().optional(),
  deadline: z.string().optional(),
})

// Schema map for each section (footer removed - not editable)
export const sectionSchemas: Record<string, z.ZodSchema> = {
  hero: heroSchema,
  welcome: welcomeSchema,
  countdown: countdownSchema,
  itinerary: itinerarySchema,
  gallery: gallerySchema,
  dressCode: dressCodeSchema,
  accommodation: accommodationSchema,
  giftRegistry: giftRegistrySchema,
  rsvp: rsvpSchema,
}

// Helper function to validate section data
export function validateSection(section: string, data: any) {
  const schema = sectionSchemas[section]
  if (!schema) {
    throw new Error(`No validation schema found for section: ${section}`)
  }
  return schema.safeParse(data)
}
