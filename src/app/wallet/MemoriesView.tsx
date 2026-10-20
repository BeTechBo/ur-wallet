'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Images, Folder, Calendar } from 'lucide-react'

interface Photo {
  id: string
  url: string
}

interface Album {
  id: string
  parent_id?: string | null
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
  // history of album IDs: [] = root (e.g. Fall 2026, Spring 2026)
  const [history, setHistory] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const currentAlbumId = history.length > 0 ? history[history.length - 1] : null
  const currentAlbum = currentAlbumId ? albums.find(a => a.id === currentAlbumId) || null : null

  // Sub-albums inside the current view
  const currentSubAlbums = albums.filter(a => {
    if (currentAlbumId === null) {
      return !a.parent_id
    }
    return a.parent_id === currentAlbumId
  })

  // Direct photos in current album
  const currentPhotos = currentAlbum?.memory_photos || []

  // Helper to count all photos recursively for an album
  function getTotalPhotos(album: Album): number {
    const directCount = album.memory_photos?.length || 0
    const children = albums.filter(a => a.parent_id === album.id)
    const childCount = children.reduce((sum, child) => sum + getTotalPhotos(child), 0)
    return directCount + childCount
  }

  // Helper to get effective cover photo (own cover or first child's cover)
  function getEffectiveCover(album: Album): string | null {
    if (album.cover_url) return album.cover_url
    if (album.memory_photos?.length > 0) return album.memory_photos[0].url
    const children = albums.filter(a => a.parent_id === album.id)
    for (const child of children) {
      const childCover = getEffectiveCover(child)
      if (childCover) return childCover
    }
    return null
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) setLightboxIndex(null)
        else if (history.length > 0) setHistory(prev => prev.slice(0, -1))
      }
      if (e.key === 'ArrowRight' && lightboxIndex !== null && currentPhotos.length > 0) {
        setLightboxIndex(prev => (prev !== null ? (prev + 1) % currentPhotos.length : null))
      }
      if (e.key === 'ArrowLeft' && lightboxIndex !== null && currentPhotos.length > 0) {
        setLightboxIndex(prev =>
          prev !== null ? (prev - 1 + currentPhotos.length) % currentPhotos.length : null
        )
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, currentPhotos, history])

  // Breadcrumbs chain
  const breadcrumbs = history.map((id, index) => {
    const alb = albums.find(a => a.id === id)
    return {
      id,
      title: alb?.title || 'Album',
      targetHistory: history.slice(0, index + 1)
    }
  })

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
      {/* Breadcrumb Navigation */}
      {history.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
          <button
            onClick={() => setHistory([])}
            className="flex items-center gap-1 text-foreground/60 hover:text-secondary font-semibold transition-colors cursor-pointer"
          >
            <span>All Memories</span>
          </button>
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1
            return (
              <div key={crumb.id} className="flex items-center gap-2">
                <span className="text-foreground/30">/</span>
                {isLast ? (
                  <span className="font-bold text-foreground truncate max-w-[200px]">{crumb.title}</span>
                ) : (
                  <button
                    onClick={() => setHistory(crumb.targetHistory)}
                    className="text-foreground/60 hover:text-secondary font-semibold transition-colors cursor-pointer truncate max-w-[150px]"
                  >
                    {crumb.title}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Album Header Info if viewing inside an album */}
      {currentAlbum && (
        <div className="mb-8">
          <h2 className="text-2xl font-black text-foreground">{currentAlbum.title}</h2>
          {currentAlbum.event_date && (
            <p className="text-foreground/50 text-sm mt-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-secondary" />
              {new Date(currentAlbum.event_date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
          {currentAlbum.description && (
            <p className="text-foreground/70 text-sm mt-2 leading-relaxed">{currentAlbum.description}</p>
          )}
        </div>
      )}

      {/* Sub-Albums Grid (e.g. Fall 2026 seasons, or nights within Fall 2026) */}
      {currentSubAlbums.length > 0 && (
        <div className="mb-10">
          {currentAlbum && currentPhotos.length > 0 && (
            <h3 className="text-sm font-bold text-foreground/60 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Folder className="w-4 h-4 text-secondary" />
              Nights / Gatherings
            </h3>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSubAlbums.map(sub => {
              const cover = getEffectiveCover(sub)
              const childSubCount = albums.filter(a => a.parent_id === sub.id).length
              const totalPhotos = getTotalPhotos(sub)

              return (
                <button
                  key={sub.id}
                  onClick={() => setHistory(prev => [...prev, sub.id])}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 shadow-sm border border-secondary/15 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer text-left flex flex-col justify-end"
                >
                  {cover ? (
                    <img
                      src={cover}
                      alt={sub.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-secondary/10 to-primary/20 flex items-center justify-center">
                      <Folder className="w-12 h-12 text-secondary/40" />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Text details */}
                  <div className="relative z-10 p-5">
                    <p className="text-white font-black text-lg leading-tight group-hover:text-amber-200 transition-colors">
                      {sub.title}
                    </p>
                    {sub.event_date && (
                      <p className="text-white/80 text-xs mt-1">
                        {new Date(sub.event_date + 'T00:00:00').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-white/60 text-xs mt-2 font-medium">
                      {childSubCount > 0 && (
                        <span>
                          {childSubCount} {childSubCount === 1 ? 'event' : 'events'}
                        </span>
                      )}
                      {childSubCount > 0 && <span>•</span>}
                      <span>
                        {totalPhotos} {totalPhotos === 1 ? 'photo' : 'photos'}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Direct Photos in this Album */}
      {currentPhotos.length > 0 && (
        <div>
          {currentSubAlbums.length > 0 && (
            <h3 className="text-sm font-bold text-foreground/60 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Images className="w-4 h-4 text-secondary" />
              Photos ({currentPhotos.length})
            </h3>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {currentPhotos.map((photo, idx) => (
              <button
                key={photo.id}
                onClick={() => setLightboxIndex(idx)}
                className="aspect-square rounded-xl overflow-hidden bg-gray-100 hover:opacity-90 hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-sm border border-black/5"
              >
                <img
                  src={photo.url}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State inside an empty album */}
      {currentAlbum && currentSubAlbums.length === 0 && currentPhotos.length === 0 && (
        <div className="flex flex-col items-center py-16 text-foreground/40">
          <Images className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-base font-semibold">No photos or nights in this album yet.</p>
          <p className="text-xs mt-1">Check back soon for memories!</p>
        </div>
      )}

      {/* Full-screen Lightbox */}
      {lightboxIndex !== null && currentPhotos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors z-20 p-2 cursor-pointer"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Counter */}
          <p className="absolute top-6 left-6 text-white/70 text-sm font-bold tracking-wider">
            {lightboxIndex + 1} / {currentPhotos.length}
          </p>

          {/* Prev button */}
          {currentPhotos.length > 1 && (
            <button
              onClick={e => {
                e.stopPropagation()
                setLightboxIndex(prev =>
                  prev !== null ? (prev - 1 + currentPhotos.length) % currentPhotos.length : 0
                )
              }}
              className="absolute left-4 text-white/70 hover:text-white transition-colors z-20 p-2 cursor-pointer bg-black/40 hover:bg-black/70 rounded-full"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Image */}
          <img
            src={currentPhotos[lightboxIndex].url}
            alt={`Photo ${lightboxIndex + 1}`}
            className="max-h-[88vh] max-w-[92vw] object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />

          {/* Next button */}
          {currentPhotos.length > 1 && (
            <button
              onClick={e => {
                e.stopPropagation()
                setLightboxIndex(prev =>
                  prev !== null ? (prev + 1) % currentPhotos.length : 0
                )
              }}
              className="absolute right-4 text-white/70 hover:text-white transition-colors z-20 p-2 cursor-pointer bg-black/40 hover:bg-black/70 rounded-full"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
