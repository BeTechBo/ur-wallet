'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus, Upload, Trash2, FolderOpen, X, Loader2, Camera, ChevronRight, FolderPlus } from 'lucide-react'

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

interface MemoriesAdminProps {
  initialAlbums: Album[]
}

export default function MemoriesAdmin({ initialAlbums }: MemoriesAdminProps) {
  const supabase = createClient()
  const [albums, setAlbums] = useState<Album[]>(initialAlbums)

  // Navigation path: array of album IDs for nested navigation
  const [history, setHistory] = useState<string[]>([])
  const currentAlbumId = history.length > 0 ? history[history.length - 1] : null
  const currentAlbum = currentAlbumId ? albums.find(a => a.id === currentAlbumId) || null : null

  // Create album form state
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newDate, setNewDate] = useState('')
  const [creating, setCreating] = useState(false)

  // Direct upload photos state
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cover upload state
  const coverInputRef = useRef<HTMLInputElement>(null)
  const [targetCoverAlbumId, setTargetCoverAlbumId] = useState<string | null>(null)
  const [coverUploadingAlbumId, setCoverUploadingAlbumId] = useState<string | null>(null)

  // Sub-albums inside the current view
  const currentSubAlbums = albums.filter(a => {
    if (currentAlbumId === null) return !a.parent_id
    return a.parent_id === currentAlbumId
  })

  // Direct photos in current album
  const currentPhotos = currentAlbum?.memory_photos || []

  // Count photos recursively
  function getTotalPhotos(album: Album): number {
    const directCount = album.memory_photos?.length || 0
    const children = albums.filter(a => a.parent_id === album.id)
    return directCount + children.reduce((sum, c) => sum + getTotalPhotos(c), 0)
  }

  // Create album or sub-album
  async function handleCreateAlbum() {
    if (!newTitle.trim()) return
    setError(null)
    setCreating(true)

    const insertPayload: any = {
      title: newTitle.trim(),
      description: newDesc.trim() || null,
      event_date: newDate || null,
      parent_id: currentAlbumId || null
    }

    const { data, error: createErr } = await supabase
      .from('memory_albums')
      .insert(insertPayload)
      .select()
      .single()

    if (createErr) {
      setError('Error creating album: ' + createErr.message + '. Make sure supabase_memories.sql is run in Supabase.')
      setCreating(false)
      return
    }

    if (data) {
      const newAlbum: Album = { ...data, memory_photos: [] }
      setAlbums(prev => [newAlbum, ...prev])
      setNewTitle('')
      setNewDesc('')
      setNewDate('')
      setShowCreate(false)
    }
    setCreating(false)
  }

  // Delete album and cascade
  async function handleDeleteAlbum(albumId: string) {
    if (!confirm('Delete this album, all its sub-albums, and all their photos?')) return
    setError(null)
    const { error: delErr } = await supabase.from('memory_albums').delete().eq('id', albumId)
    if (delErr) {
      setError('Error deleting album: ' + delErr.message)
      return
    }

    // Recursively collect IDs to remove
    const idsToRemove = new Set<string>()
    function collect(id: string) {
      idsToRemove.add(id)
      albums.filter(a => a.parent_id === id).forEach(child => collect(child.id))
    }
    collect(albumId)

    setAlbums(prev => prev.filter(a => !idsToRemove.has(a.id)))
    if (history.includes(albumId)) {
      setHistory(prev => prev.filter(id => !idsToRemove.has(id)))
    }
  }

  // Upload photos to current album
  async function handleUploadPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    if (!currentAlbum || !e.target.files?.length) return
    setError(null)
    setUploading(true)
    const files = Array.from(e.target.files)
    const uploaded: Photo[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ext = file.name.split('.').pop()
      const path = `${currentAlbum.id}/${Date.now()}_${i}.${ext}`
      const { error: upErr } = await supabase.storage.from('memories').upload(path, file, { upsert: true })
      if (upErr) {
        setError(`Failed to upload ${file.name}: ${upErr.message}. Ensure 'memories' bucket exists in Supabase.`)
        continue
      }

      const { data: urlData } = supabase.storage.from('memories').getPublicUrl(path)
      const publicUrl = urlData.publicUrl

      const { data: photoRow, error: dbErr } = await supabase
        .from('memory_photos')
        .insert({ album_id: currentAlbum.id, url: publicUrl })
        .select()
        .single()

      if (dbErr) {
        setError(`Database error saving photo: ${dbErr.message}`)
      } else if (photoRow) {
        uploaded.push(photoRow)
      }
      setUploadProgress(Math.round(((i + 1) / files.length) * 100))
    }

    setAlbums(prev =>
      prev.map(a => {
        if (a.id === currentAlbum.id) {
          const newPhotos = [...a.memory_photos, ...uploaded]
          // If no cover, set the first uploaded photo as cover automatically
          const newCover = a.cover_url || newPhotos[0]?.url || null
          return { ...a, cover_url: newCover, memory_photos: newPhotos }
        }
        return a
      })
    )

    setUploading(false)
    setUploadProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Direct cover file upload from button / thumbnail
  async function handleCoverFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !targetCoverAlbumId) return
    setError(null)
    setCoverUploadingAlbumId(targetCoverAlbumId)

    try {
      const ext = file.name.split('.').pop()
      const path = `${targetCoverAlbumId}/cover_${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('memories').upload(path, file, { upsert: true })
      if (upErr) {
        setError(`Failed to upload cover: ${upErr.message}. Ensure 'memories' bucket exists in Supabase.`)
        setCoverUploadingAlbumId(null)
        return
      }

      const { data: urlData } = supabase.storage.from('memories').getPublicUrl(path)
      const publicUrl = urlData.publicUrl

      const { data: photoRow } = await supabase
        .from('memory_photos')
        .insert({ album_id: targetCoverAlbumId, url: publicUrl })
        .select()
        .single()

      const { error: covErr } = await supabase
        .from('memory_albums')
        .update({ cover_url: publicUrl })
        .eq('id', targetCoverAlbumId)

      if (covErr) {
        setError(`Failed to set cover: ${covErr.message}`)
      } else {
        setAlbums(prev =>
          prev.map(a => {
            if (a.id === targetCoverAlbumId) {
              const updatedPhotos = photoRow ? [...a.memory_photos, photoRow] : a.memory_photos
              return { ...a, cover_url: publicUrl, memory_photos: updatedPhotos }
            }
            return a
          })
        )
      }
    } catch (err: any) {
      setError(err?.message || 'Error uploading cover photo')
    } finally {
      setCoverUploadingAlbumId(null)
      setTargetCoverAlbumId(null)
      if (coverInputRef.current) coverInputRef.current.value = ''
    }
  }

  // Set existing photo as cover
  async function handleSetCover(photoUrl: string) {
    if (!currentAlbum) return
    setError(null)
    const { error: covErr } = await supabase
      .from('memory_albums')
      .update({ cover_url: photoUrl })
      .eq('id', currentAlbum.id)
    if (covErr) {
      setError('Error setting cover: ' + covErr.message)
      return
    }
    setAlbums(prev =>
      prev.map(a => (a.id === currentAlbum.id ? { ...a, cover_url: photoUrl } : a))
    )
  }

  // Delete individual photo
  async function handleDeletePhoto(photoId: string, photoUrl: string) {
    if (!currentAlbum) return
    setError(null)
    const { error: delPhotoErr } = await supabase.from('memory_photos').delete().eq('id', photoId)
    if (delPhotoErr) {
      setError('Error deleting photo: ' + delPhotoErr.message)
      return
    }
    const path = photoUrl.split('/memories/')[1]
    if (path) await supabase.storage.from('memories').remove([path])

    setAlbums(prev =>
      prev.map(a => {
        if (a.id === currentAlbum.id) {
          const updatedPhotos = a.memory_photos.filter(p => p.id !== photoId)
          const updatedCover = a.cover_url === photoUrl ? null : a.cover_url
          return { ...a, cover_url: updatedCover, memory_photos: updatedPhotos }
        }
        return a
      })
    )
  }

  // Breadcrumbs chain
  const breadcrumbs = history.map((id, index) => {
    const alb = albums.find(a => a.id === id)
    return {
      id,
      title: alb?.title || 'Album',
      targetHistory: history.slice(0, index + 1)
    }
  })

  return (
    <div className="bg-white rounded-2xl p-8 border border-secondary/30 shadow-sm">
      {/* Hidden input for changing cover directly from album cards */}
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCoverFileChange}
      />

      {/* Hidden input for uploading photos to current album */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleUploadPhotos}
      />

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-800 font-bold ml-2 cursor-pointer">✕</button>
        </div>
      )}

      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-sm text-foreground/60 mb-1">
            <button
              onClick={() => { setHistory([]); setShowCreate(false) }}
              className={`font-semibold hover:text-secondary transition-colors cursor-pointer ${history.length === 0 ? 'text-secondary font-bold' : ''}`}
            >
              All Albums / Seasons
            </button>
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1
              return (
                <div key={crumb.id} className="flex items-center gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-foreground/40" />
                  {isLast ? (
                    <span className="font-bold text-foreground">{crumb.title}</span>
                  ) : (
                    <button
                      onClick={() => { setHistory(crumb.targetHistory); setShowCreate(false) }}
                      className="font-semibold hover:text-secondary transition-colors cursor-pointer"
                    >
                      {crumb.title}
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          <h2 className="font-black text-2xl text-foreground">
            {currentAlbum ? currentAlbum.title : 'Memories Management'}
          </h2>
          {currentAlbum?.event_date && (
            <p className="text-xs text-foreground/50 mt-0.5">
              {new Date(currentAlbum.event_date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {currentAlbum && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 bg-secondary/10 text-secondary border border-secondary/30 px-4 py-2 rounded-xl text-sm font-bold hover:bg-secondary hover:text-white disabled:opacity-50 transition-colors cursor-pointer"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>{uploading ? `Uploading ${uploadProgress}%` : 'Upload Photos'}</span>
            </button>
          )}

          <button
            onClick={() => setShowCreate(v => !v)}
            className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-secondary/90 transition-colors cursor-pointer shadow-sm"
          >
            {currentAlbum ? <FolderPlus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{currentAlbum ? 'New Night / Sub-Album' : 'New Album (Season)'}</span>
          </button>
        </div>
      </div>

      {/* Create Album / Sub-Album Form */}
      {showCreate && (
        <div className="mb-6 bg-gray-50 rounded-2xl p-5 border border-secondary/20 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-sm text-foreground">
              {currentAlbum ? `Create Sub-Album inside "${currentAlbum.title}"` : 'Create New Album / Season'}
            </h3>
            <button onClick={() => setShowCreate(false)} className="text-foreground/40 hover:text-foreground text-xs cursor-pointer">
              ✕
            </button>
          </div>

          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder={currentAlbum ? "Night name (e.g. Welcome Night, Tasbeha 1)" : "Season / Album title (e.g. Fall 2026)"}
            className="w-full px-4 py-2 bg-white border border-secondary/30 rounded-xl text-sm outline-none focus:border-secondary"
          />
          <input
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            placeholder="Short description (optional)"
            className="w-full px-4 py-2 bg-white border border-secondary/30 rounded-xl text-sm outline-none focus:border-secondary"
          />
          <input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-secondary/30 rounded-xl text-sm outline-none focus:border-secondary"
          />
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleCreateAlbum}
              disabled={creating || !newTitle.trim()}
              className="flex-1 bg-secondary text-white py-2 rounded-xl text-sm font-bold hover:bg-secondary/90 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {creating ? 'Creating...' : currentAlbum ? 'Create Sub-Album' : 'Create Season'}
            </button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl text-sm text-foreground/60 hover:bg-gray-200 transition-colors cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sub-Albums List */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-3">
          {currentAlbum ? `Nights / Sub-Albums (${currentSubAlbums.length})` : `Seasons / Top-Level Albums (${currentSubAlbums.length})`}
        </h3>

        {currentSubAlbums.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <p className="text-sm text-foreground/50 italic">
              {currentAlbum ? 'No sub-albums here yet. Click "New Night / Sub-Album" above to add one!' : 'No albums yet. Click "New Album (Season)" above to get started!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentSubAlbums.map(sub => {
              const childCount = albums.filter(a => a.parent_id === sub.id).length
              const totalPhotos = getTotalPhotos(sub)

              return (
                <div key={sub.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  {/* Thumbnail with quick-change cover */}
                  <div className="relative group w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    {sub.cover_url ? (
                      <img src={sub.cover_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FolderOpen className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                    <button
                      type="button"
                      title="Change Cover Photo"
                      disabled={coverUploadingAlbumId === sub.id}
                      onClick={e => {
                        e.stopPropagation()
                        setTargetCoverAlbumId(sub.id)
                        coverInputRef.current?.click()
                      }}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                    >
                      {coverUploadingAlbumId === sub.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mb-0.5" />
                          <span>Change</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Title & Info - click to open */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => { setHistory(prev => [...prev, sub.id]); setShowCreate(false) }}
                  >
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground text-sm truncate hover:text-secondary transition-colors">
                        {sub.title}
                      </p>
                      <ChevronRight className="w-4 h-4 text-foreground/40 shrink-0" />
                    </div>
                    {sub.event_date && (
                      <p className="text-xs text-foreground/50 mt-0.5">
                        {new Date(sub.event_date + 'T00:00:00').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                    <p className="text-xs text-foreground/40 mt-0.5">
                      {childCount > 0 && `${childCount} night${childCount === 1 ? '' : 's'} • `}
                      {totalPhotos} photo{totalPhotos === 1 ? '' : 's'}
                    </p>
                  </div>

                  {/* Actions: Change Cover & Delete */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      title="Change Cover Photo"
                      disabled={coverUploadingAlbumId === sub.id}
                      onClick={() => {
                        setTargetCoverAlbumId(sub.id)
                        coverInputRef.current?.click()
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/10 text-secondary text-xs font-bold hover:bg-secondary hover:text-white transition-all cursor-pointer whitespace-nowrap"
                    >
                      {coverUploadingAlbumId === sub.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Camera className="w-3.5 h-3.5" />
                      )}
                      <span>Change Cover</span>
                    </button>

                    <button
                      type="button"
                      title="Delete Album"
                      onClick={() => handleDeleteAlbum(sub.id)}
                      className="text-red-400 hover:text-red-600 p-2 transition-colors rounded-xl hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Direct Photos in Current Album */}
      {currentAlbum && (
        <div className="pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-foreground/50 uppercase tracking-widest">
              Photos in "{currentAlbum.title}" ({currentPhotos.length})
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-xs font-bold text-secondary hover:underline cursor-pointer flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload more
            </button>
          </div>

          {currentPhotos.length === 0 ? (
            <p className="text-sm text-foreground/40 italic text-center py-8">
              No photos directly uploaded to this album yet. Click "Upload Photos" above!
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {currentPhotos.map(photo => (
                <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-black/5">
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => handleSetCover(photo.url)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                        currentAlbum.cover_url === photo.url
                          ? 'bg-secondary text-white'
                          : 'bg-white text-foreground hover:bg-secondary hover:text-white'
                      }`}
                    >
                      {currentAlbum.cover_url === photo.url ? '✓ Current Cover' : 'Set as Cover'}
                    </button>
                    <button
                      onClick={() => handleDeletePhoto(photo.id, photo.url)}
                      className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
