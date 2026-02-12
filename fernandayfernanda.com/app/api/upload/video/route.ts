import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readdir, unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

export async function GET() {
  try {
    const videosDirectory = join(process.cwd(), 'public', 'videos')
    
    // Create directory if it doesn't exist
    if (!existsSync(videosDirectory)) {
      mkdirSync(videosDirectory, { recursive: true })
      return NextResponse.json({ videos: [] })
    }

    const files = await readdir(videosDirectory)
    const videoFiles = files.filter(file => 
      file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.mov')
    )

    const videos = videoFiles.map(filename => ({
      url: `/videos/${filename}`,
      filename: filename,
    }))

    return NextResponse.json({ videos })
  } catch (error) {
    console.error('Error reading videos:', error)
    return NextResponse.json({ error: 'Error al leer videos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 })
    }

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Tipo de archivo no válido. Solo se permiten MP4, WebM y MOV' 
      }, { status: 400 })
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'El video es demasiado grande. Máximo 50MB' 
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create videos directory if it doesn't exist
    const videosDirectory = join(process.cwd(), 'public', 'videos')
    if (!existsSync(videosDirectory)) {
      mkdirSync(videosDirectory, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/\s+/g, '-').toLowerCase()
    const extension = originalName.split('.').pop()
    const filename = `hero-video-${timestamp}.${extension}`
    const filepath = join(videosDirectory, filename)

    await writeFile(filepath, buffer)

    return NextResponse.json({ 
      url: `/videos/${filename}`,
      filename: filename,
      size: file.size 
    })
  } catch (error) {
    console.error('Error uploading video:', error)
    return NextResponse.json({ error: 'Error al subir el video' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || !url.startsWith('/videos/')) {
      return NextResponse.json({ error: 'URL inválida' }, { status: 400 })
    }

    const filename = url.replace('/videos/', '')
    const filepath = join(process.cwd(), 'public', 'videos', filename)

    if (existsSync(filepath)) {
      await unlink(filepath)
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Video no encontrado' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json({ error: 'Error al eliminar el video' }, { status: 500 })
  }
}
