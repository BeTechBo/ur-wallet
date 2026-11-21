'use client'

import { useState, useTransition } from 'react'
import { Gift, Send, Coins, Clock, CheckCircle, ChevronDown } from 'lucide-react'
import { sendGift } from '@/app/actions'

type Verse = {
  verse_text: string
  reference: string
}

type SentGift = {
  id: string
  recipient_name: string
  coins_amount: number
  verse_reference: string | null
  personal_note: string | null
  sent_at: string
  opened_at: string | null
}

type ReceivedGift = {
  id: string
  sender_name: string
  coins_amount: number
  verse_text: string | null
  verse_reference: string | null
  personal_note: string | null
  sent_at: string
  opened_at: string | null
}

type Member = {
  id: string
  full_name: string
  email: string
}

type SendGiftsProps = {
  userId: string
  verses: Verse[]
  members: Member[]
  budgetRemaining: number
  budgetTotal: number
  sentGifts: SentGift[]
  receivedGifts: ReceivedGift[]
}

export default function SendGifts({
  userId,
  verses,
  members,
  budgetRemaining,
  budgetTotal,
  sentGifts,
  receivedGifts,
}: SendGiftsProps) {
  const [recipientId, setRecipientId] = useState('')
  const [coinsAmount, setCoinsAmount] = useState(5)
  const [selectedVerseIdx, setSelectedVerseIdx] = useState<number | null>(null)
  const [personalNote, setPersonalNote] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipientId) { setErrorMsg('Please select a recipient.'); setStatus('error'); return }
    if (coinsAmount < 1 || coinsAmount > budgetRemaining) {
      setErrorMsg(`Amount must be between 1 and ${budgetRemaining}.`); setStatus('error'); return
    }
    if (selectedVerseIdx === null) { setErrorMsg('Please choose a verse to include.'); setStatus('error'); return }

    setStatus('idle')
    setErrorMsg('')

    const verse = verses[selectedVerseIdx]
    const formData = new FormData()
    formData.set('recipientId', recipientId)
    formData.set('coinsAmount', coinsAmount.toString())
    formData.set('verseText', verse.verse_text)
    formData.set('verseReference', verse.reference)
    formData.set('personalNote', personalNote)

    startTransition(async () => {
      const result = await sendGift(formData)
      if (result?.error) {
        setErrorMsg(result.error)
        setStatus('error')
      } else {
        setStatus('success')
        setRecipientId('')
        setCoinsAmount(5)
        setSelectedVerseIdx(null)
        setPersonalNote('')
      }
    })
  }

  const usedPercent = Math.round(((budgetTotal - budgetRemaining) / budgetTotal) * 100)

  return (
    <div className="bg-zakhrafa rounded-2xl p-8 border border-secondary/30 shadow-sm space-y-10">

      {/* Header + Budget */}
      <div>
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <Gift className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-bold text-foreground">Send Gifts</h2>
        </div>

        {/* Budget bar */}
        <div className="bg-white border border-secondary/20 rounded-xl p-5 mb-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Monthly Gift Budget</p>
              <p className="text-2xl font-black text-secondary mt-0.5">
                {budgetRemaining}
                <span className="text-sm font-bold text-foreground/40 ml-1">/ {budgetTotal} coins</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Gifted</p>
              <p className="text-lg font-black text-foreground/60">{budgetTotal - budgetRemaining}</p>
            </div>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-500"
              style={{ width: `${100 - usedPercent}%` }}
            />
          </div>
          <p className="text-xs text-foreground/40 mt-2 font-medium">Resets on the 1st of each month</p>
        </div>
      </div>

      {/* Gift Form */}
      {budgetRemaining > 0 ? (
        <form onSubmit={handleSubmit} className="bg-white border border-secondary/20 rounded-xl p-6 space-y-6">
          <h3 className="font-bold text-lg text-foreground">Send a Gift</h3>

          {/* Recipient */}
          <div>
            <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">
              To
            </label>
            <div className="relative">
              <select
                value={recipientId}
                onChange={e => setRecipientId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-foreground bg-gray-50 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none appearance-none cursor-pointer"
                required
              >
                <option value="">Choose a member...</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.full_name || m.email}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
            </div>
          </div>

          {/* Coin Amount */}
          <div>
            <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">
              Coins to Gift (max {budgetRemaining})
            </label>
            <div className="flex items-center gap-3">
              {[1, 3, 5, 10, 15].filter(v => v <= budgetRemaining).map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setCoinsAmount(v)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-black border-2 transition-all ${
                    coinsAmount === v
                      ? 'border-secondary bg-secondary text-white shadow-sm'
                      : 'border-gray-200 bg-gray-50 text-foreground/70 hover:border-secondary/50'
                  }`}
                >
                  {v}
                </button>
              ))}
              <div className="flex items-center border-2 border-gray-200 rounded-xl bg-gray-50 overflow-hidden flex-1">
                <input
                  type="number"
                  min={1}
                  max={budgetRemaining}
                  value={coinsAmount}
                  onChange={e => setCoinsAmount(Math.min(budgetRemaining, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-3 py-2.5 text-sm font-black text-center bg-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Verse Selector */}
          <div>
            <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">
              Choose a Verse to Include
            </label>
            {verses.length === 0 ? (
              <p className="text-sm text-foreground/40 italic border border-dashed border-gray-200 rounded-xl p-4 text-center">
                No verses collected yet. Receive your first verse to start gifting!
              </p>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {verses.map((v, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedVerseIdx === idx
                        ? 'border-secondary bg-secondary/5'
                        : 'border-gray-100 bg-gray-50 hover:border-secondary/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="verse"
                      checked={selectedVerseIdx === idx}
                      onChange={() => setSelectedVerseIdx(idx)}
                      className="mt-1 accent-secondary shrink-0"
                    />
                    <div>
                      <p className="text-sm font-bold text-secondary">{v.reference}</p>
                      <p className="text-xs text-foreground/70 leading-relaxed mt-0.5 line-clamp-2" dir="rtl">{v.verse_text}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Personal Note */}
          <div>
            <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">
              Personal Note (optional)
            </label>
            <textarea
              value={personalNote}
              onChange={e => setPersonalNote(e.target.value)}
              maxLength={300}
              rows={3}
              placeholder="Write something from the heart..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-foreground bg-gray-50 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none resize-none"
            />
            <p className="text-xs text-foreground/30 mt-1 text-right">{personalNote.length}/300</p>
          </div>

          {/* Error */}
          {status === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          {/* Success */}
          {status === 'success' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              Gift sent! They will receive a beautiful email with their surprise.
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending || budgetRemaining === 0 || verses.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-secondary text-white rounded-xl font-bold text-sm shadow-sm hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Sending Gift...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Gift
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="bg-white border border-secondary/20 rounded-xl p-8 text-center">
          <Coins className="w-10 h-10 text-foreground/20 mx-auto mb-3" />
          <p className="font-bold text-foreground/60">Budget used for this month</p>
          <p className="text-sm text-foreground/40 mt-1">Your 30-coin gift budget refreshes on the 1st of next month.</p>
        </div>
      )}

      {/* Sent Gifts History */}
      {sentGifts.length > 0 && (
        <div>
          <h3 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
            <Send className="w-4 h-4 text-secondary" />
            Gifts You Sent
          </h3>
          <div className="space-y-3">
            {sentGifts.map(g => (
              <div key={g.id} className="bg-white border border-secondary/20 rounded-xl p-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">
                    To: {g.recipient_name}
                  </p>
                  {g.verse_reference && (
                    <p className="text-xs text-foreground/50 mt-0.5">{g.verse_reference}</p>
                  )}
                  <p className="text-xs text-foreground/40 mt-0.5">
                    {new Date(g.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-secondary font-black text-sm">{g.coins_amount} coins</span>
                  {g.opened_at ? (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Opened
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> Waiting
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Received Gifts History */}
      {receivedGifts.length > 0 && (
        <div>
          <h3 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
            <Gift className="w-4 h-4 text-secondary" />
            Gifts You Received
          </h3>
          <div className="space-y-3">
            {receivedGifts.map(g => (
              <div key={g.id} className="bg-white border border-secondary/20 rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-sm text-foreground">From: {g.sender_name}</p>
                    <p className="text-xs text-foreground/40 mt-0.5">
                      {new Date(g.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <span className="text-secondary font-black text-sm shrink-0">{g.coins_amount} coins</span>
                </div>
                {g.verse_text && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-bold text-secondary mb-1">{g.verse_reference}</p>
                    <p className="text-sm text-foreground/70 italic leading-relaxed" dir="rtl">
                      "{g.verse_text}"
                    </p>
                  </div>
                )}
                {g.personal_note && (
                  <p className="text-xs text-foreground/60 mt-2 italic border-l-2 border-secondary/30 pl-2">{g.personal_note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
