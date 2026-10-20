'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react'

interface Photo {
  id: string
  url: string
}

interface Album {
  id: string
  title: string
  description: string | null
  event_date: string | null
  cover_url: string | null
  memory_photos: Photo[]
}

interface MemoriesViewProps {
  albums: Album[]
}

export default function MemoriesView({ albums }: MemoriesViewProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Close lightbox on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) setLightboxIndex(null)
        else setSelectedAlbum(null)
      }
      if (e.key === 'ArrowRight' && lightboxIndex !== null && selectedAlbum) {
        setLightboxIndex(prev =>
          prev !== null ? (prev + 1) % selectedAlbum.memory_photos.length : null
        )
      }
      if (e.key === 'ArrowLeft' && lightboxIndex !== null && selectedAlbum) {
        setLightboxIndex(prev =>
          prev !== null
            ? (prev - 1 + selectedAlbum.memory_photos.length) % selectedAlbum.memory_photos.length
            : null
        )
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, selectedAlbum])

  if (albums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-foreground/40">
        <Images className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg font-semibold">No memories yet</p>
        <p className="text-sm mt-1">Check back soon — photos will appear here after our gatherings!</p>
      </div>
    )
  }

  return (
    <div>
      {/* Album Grid */}
      {!selectedAlbum && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {albums.map(album => (
            <button
              key={album.id}
              onClick={() => setSelectedAlbum(album)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 shadow-sm border border-secondary/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-left"
            >
              {album.cover_url ? (
                <img
                  src={album.cover_url}
                  alt={album.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-secondary/20 flex items-center justify-center">
                  <Images className="w-12 h-12 text-secondary/50" />
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white font-bold text-lg leading-tight">{album.title}</p>
                {album.event_date && (
                  <p className="text-white/70 text-sm mt-1">
                    {new Date(album.event_date + 'T00:00:00').toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                )}
                <p className="text-white/60 text-xs mt-1">
                  {album.memory_photos.length} photo{album.memory_photos.length !== 1 ? 's' : ''}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Album View (photo grid) */}
      {selectedAlbum && lightboxIndex === null && (
        <div>
          <button
            onClick={() => setSelectedAlbum(null)}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground text-sm font-semibold mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Albums
          </button>
          <div className="mb-6">
            <h2 className="text-2xl font-black text-foreground">{selectedAlbum.title}</h2>
            {selectedAlbum.event_date && (
              <p className="text-foreground/50 text-sm mt-1">
                {new Date(selectedAlbum.event_date + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            )}
            {selectedAlbum.description && (
              <p className="text-foreground/70 text-sm mt-2 leading-relaxed">{selectedAlbum.description}</p>
            )}
          </div>

          {selectedAlbum.memory_photos.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-foreground/40">
              <Images className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">No photos in this album yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectedAlbum.memory_photos.map((photo, idx) => (
                <button
                  key={photo.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 hover:opacity-90 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                >
                  <img
                    src={photo.url}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {selectedAlbum && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Counter */}
          <p className="absolute top-5 left-5 text-white/60 text-sm font-medium">
            {lightboxIndex + 1} / {selectedAlbum.memory_photos.length}
          </p>

          {/* Prev button */}
          {selectedAlbum.memory_photos.length > 1 && (
            <button
              onClick={e => {
                e.stopPropagation()
                setLightboxIndex(prev =>
                  prev !== null
                    ? (prev - 1 + selectedAlbum.memory_photos.length) % selectedAlbum.memory_photos.length
                    : 0
                )
              }}
              className="absolute left-4 text-white/70 hover:text-white transition-colors z-10 p-2"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
          )}

          {/* Image */}
          <img
            src={selectedAlbum.memory_photos[lightboxIndex].url}
            alt={`Photo ${lightboxIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />

          {/* Next button */}
          {selectedAlbum.memory_photos.length > 1 && (
            <button
              onClick={e => {
                e.stopPropagation()
                setLightboxIndex(prev =>
                  prev !== null ? (prev + 1) % selectedAlbum.memory_photos.length : 0
                )
              }}
              className="absolute right-4 text-white/70 hover:text-white transition-colors z-10 p-2"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
