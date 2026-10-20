'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus, Upload, Trash2, FolderOpen, X, Loader2, Camera } from 'lucide-react'

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

interface MemoriesAdminProps {
  initialAlbums: Album[]
}

export default function MemoriesAdmin({ initialAlbums }: MemoriesAdminProps) {
  const supabase = createClient()
  const [albums, setAlbums] = useState<Album[]>(initialAlbums)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)

  // Create album form
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newDate, setNewDate] = useState('')
  const [creating, setCreating] = useState(false)

  // Upload
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const [targetCoverAlbumId, setTargetCoverAlbumId] = useState<string | null>(null)
  const [coverUploadingAlbumId, setCoverUploadingAlbumId] = useState<string | null>(null)

  async function handleCreateAlbum() {
    if (!newTitle.trim()) return
    setError(null)
    setCreating(true)
    const { data, error: createErr } = await supabase
      .from('memory_albums')
      .insert({ title: newTitle.trim(), description: newDesc.trim() || null, event_date: newDate || null })
      .select()
      .single()
    if (createErr) {
      setError('Error creating album: ' + createErr.message)
      setCreating(false)
      return
    }
    if (data) {
      const newAlbum = { ...data, memory_photos: [] }
      setAlbums(prev => [newAlbum, ...prev])
      setNewTitle(''); setNewDesc(''); setNewDate('')
      setShowCreate(false)
    }
    setCreating(false)
  }

  async function handleDeleteAlbum(albumId: string) {
    if (!confirm('Delete this album and all its photos?')) return
    setError(null)
    const { error: delErr } = await supabase.from('memory_albums').delete().eq('id', albumId)
    if (delErr) {
      setError('Error deleting album: ' + delErr.message)
      return
    }
    setAlbums(prev => prev.filter(a => a.id !== albumId))
    if (selectedAlbum?.id === albumId) setSelectedAlbum(null)
  }

  async function handleUploadPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    if (!selectedAlbum || !e.target.files?.length) return
    setError(null)
    setUploading(true)
    const files = Array.from(e.target.files)
    const uploaded: Photo[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ext = file.name.split('.').pop()
      const path = `${selectedAlbum.id}/${Date.now()}_${i}.${ext}`
      const { error: upErr } = await supabase.storage.from('memories').upload(path, file, { upsert: true })
      if (upErr) {
        console.error('Upload error:', upErr)
        setError(`Failed to upload ${file.name}: ${upErr.message}. Ensure the 'memories' bucket exists in Supabase.`)
        continue
      }

      const { data: urlData } = supabase.storage.from('memories').getPublicUrl(path)
      const publicUrl = urlData.publicUrl

      const { data: photoRow, error: dbErr } = await supabase
        .from('memory_photos')
        .insert({ album_id: selectedAlbum.id, url: publicUrl })
        .select()
        .single()

      if (dbErr) {
        console.error('DB error inserting photo:', dbErr)
        setError(`Database error saving photo: ${dbErr.message}`)
      } else if (photoRow) {
        uploaded.push(photoRow)
      }
      setUploadProgress(Math.round(((i + 1) / files.length) * 100))
    }

    const updated = { ...selectedAlbum, memory_photos: [...selectedAlbum.memory_photos, ...uploaded] }
    setSelectedAlbum(updated)
    setAlbums(prev => prev.map(a => a.id === selectedAlbum.id ? updated : a))
    setUploading(false)
    setUploadProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSetCover(photoUrl: string) {
    if (!selectedAlbum) return
    setError(null)
    const { error: covErr } = await supabase.from('memory_albums').update({ cover_url: photoUrl }).eq('id', selectedAlbum.id)
    if (covErr) {
      setError('Error setting cover: ' + covErr.message)
      return
    }
    const updated = { ...selectedAlbum, cover_url: photoUrl }
    setSelectedAlbum(updated)
    setAlbums(prev => prev.map(a => a.id === selectedAlbum.id ? updated : a))
  }

  async function handleDeletePhoto(photoId: string, photoUrl: string) {
    if (!selectedAlbum) return
    setError(null)
    const { error: delPhotoErr } = await supabase.from('memory_photos').delete().eq('id', photoId)
    if (delPhotoErr) {
      setError('Error deleting photo: ' + delPhotoErr.message)
      return
    }
    // Also remove from storage
    const path = photoUrl.split('/memories/')[1]
    if (path) await supabase.storage.from('memories').remove([path])

    const updated = { ...selectedAlbum, memory_photos: selectedAlbum.memory_photos.filter(p => p.id !== photoId) }
    if (selectedAlbum.cover_url === photoUrl) {
      await supabase.from('memory_albums').update({ cover_url: null }).eq('id', selectedAlbum.id)
      updated.cover_url = null
    }
    setSelectedAlbum(updated)
    setAlbums(prev => prev.map(a => a.id === selectedAlbum.id ? updated : a))
  }

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

      // Insert into photos table as well
      const { data: photoRow } = await supabase
        .from('memory_photos')
        .insert({ album_id: targetCoverAlbumId, url: publicUrl })
        .select()
        .single()

      // Update album cover_url
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

  return (
    <div className="bg-white rounded-2xl p-8 border border-secondary/30 shadow-sm">
      {/* Hidden input for changing cover directly from album list */}
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCoverFileChange}
      />

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-800 font-bold ml-2">✕</button>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-5 h-5 text-secondary" />
          <h2 className="font-bold text-xl text-foreground">Memories Albums</h2>
        </div>
        {!selectedAlbum && (
          <button
            onClick={() => setShowCreate(v => !v)}
            className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-secondary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Album
          </button>
        )}
        {selectedAlbum && (
          <button
            onClick={() => setSelectedAlbum(null)}
            className="text-foreground/60 hover:text-foreground text-sm font-semibold transition-colors flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Back
          </button>
        )}
      </div>

      {/* Create Album Form */}
      {showCreate && !selectedAlbum && (
        <div className="mb-6 bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-3">
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Album title (e.g. Christmas Night 2024)"
            className="w-full px-4 py-2 border border-secondary/30 rounded-xl text-sm outline-none focus:border-secondary"
          />
          <input
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            placeholder="Short description (optional)"
            className="w-full px-4 py-2 border border-secondary/30 rounded-xl text-sm outline-none focus:border-secondary"
          />
          <input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="w-full px-4 py-2 border border-secondary/30 rounded-xl text-sm outline-none focus:border-secondary"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateAlbum}
              disabled={creating || !newTitle.trim()}
              className="flex-1 bg-secondary text-white py-2 rounded-xl text-sm font-bold hover:bg-secondary/90 disabled:opacity-50 transition-colors"
            >
              {creating ? 'Creating...' : 'Create Album'}
            </button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl text-sm text-foreground/60 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Album List */}
      {!selectedAlbum && (
        <div className="space-y-3">
          {albums.length === 0 && (
            <p className="text-sm text-foreground/50 italic text-center py-8">No albums yet. Create one to get started!</p>
          )}
          {albums.map(album => (
            <div key={album.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
              {/* Cover Thumbnail with quick-change button */}
              <div className="relative group w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                {album.cover_url ? (
                  <img src={album.cover_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-gray-300" />
                  </div>
                )}
                <button
                  type="button"
                  title="Change Cover Photo"
                  disabled={coverUploadingAlbumId === album.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setTargetCoverAlbumId(album.id)
                    coverInputRef.current?.click()
                  }}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                >
                  {coverUploadingAlbumId === album.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mb-0.5" />
                      <span>Change</span>
                    </>
                  )}
                </button>
              </div>

              {/* Title and details (click to open album) */}
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedAlbum(album)}>
                <p className="font-bold text-foreground text-sm truncate hover:text-secondary transition-colors">{album.title}</p>
                {album.event_date && (
                  <p className="text-xs text-foreground/50 mt-0.5">
                    {new Date(album.event_date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                )}
                <p className="text-xs text-foreground/40 mt-0.5">{album.memory_photos.length} photo{album.memory_photos.length !== 1 ? 's' : ''}</p>
              </div>

              {/* Actions: Change Cover button & Delete */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  title="Change Cover Photo"
                  disabled={coverUploadingAlbumId === album.id}
                  onClick={() => {
                    setTargetCoverAlbumId(album.id)
                    coverInputRef.current?.click()
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-secondary/30 text-secondary text-xs font-bold hover:bg-secondary hover:text-white transition-colors"
                >
                  {coverUploadingAlbumId === album.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Camera className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">Change Cover</span>
                </button>

                <button
                  type="button"
                  title="Delete Album"
                  onClick={() => handleDeleteAlbum(album.id)}
                  className="text-red-400 hover:text-red-600 p-2 transition-colors rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Album Detail / Upload */}
      {selectedAlbum && (
        <div>
          <div className="mb-5">
            <h3 className="font-black text-xl text-foreground">{selectedAlbum.title}</h3>
            {selectedAlbum.event_date && <p className="text-xs text-foreground/50 mt-1">{new Date(selectedAlbum.event_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>}
          </div>

          {/* Upload button */}
          <div className="mb-5">
            <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleUploadPhotos} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 bg-secondary/10 text-secondary border border-secondary/30 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-secondary/20 disabled:opacity-50 transition-colors"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? `Uploading... ${uploadProgress}%` : 'Upload Photos'}
            </button>
          </div>

          {/* Photos grid */}
          {selectedAlbum.memory_photos.length === 0 ? (
            <p className="text-sm text-foreground/40 italic text-center py-10">No photos yet. Upload some above!</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectedAlbum.memory_photos.map(photo => (
                <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <button
                      onClick={() => handleSetCover(photo.url)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${selectedAlbum.cover_url === photo.url ? 'bg-secondary text-white' : 'bg-white text-foreground hover:bg-secondary hover:text-white'}`}
                    >
                      {selectedAlbum.cover_url === photo.url ? '✓ Cover' : 'Set Cover'}
                    </button>
                    <button
                      onClick={() => handleDeletePhoto(photo.id, photo.url)}
                      className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-red-600 transition-colors"
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
