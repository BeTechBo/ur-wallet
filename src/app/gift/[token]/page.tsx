import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import GiftRevealClient from './GiftRevealClient'

export default async function GiftRevealPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const adminClient = createAdminClient()

  // Find the gift by token, joining sender and recipient profiles
  const { data: gift, error } = await adminClient
    .from('gifts')
    .select(`
      id,
      sender_id,
      recipient_id,
      coins_amount,
      verse_text,
      verse_reference,
      personal_note,
      opened_at,
      sent_at
    `)
    .eq('token', token)
    .maybeSingle()

  if (error || !gift) {
    notFound()
  }

  // Fetch sender and recipient names
  const { data: senderProfile } = await adminClient
    .from('profiles')
    .select('full_name, email')
    .eq('id', gift.sender_id)
    .maybeSingle()

  const { data: recipientProfile } = await adminClient
    .from('profiles')
    .select('full_name, email')
    .eq('id', gift.recipient_id)
    .maybeSingle()

  const senderName =
    senderProfile?.full_name || senderProfile?.email?.split('@')[0] || 'Someone'
  const recipientName =
    recipientProfile?.full_name || recipientProfile?.email?.split('@')[0] || 'You'

  const alreadyOpened = Boolean(gift.opened_at)

  // If the gift is not yet opened, credit coins and mark as opened
  if (!alreadyOpened) {
    // Check if the recipient is currently logged in (optional safety: only recipient can open)
    // We credit the coins regardless so a simple email link works without login
    const now = new Date().toISOString()

    // Mark gift as opened
    await adminClient
      .from('gifts')
      .update({ opened_at: now })
      .eq('id', gift.id)

    // Credit coins to recipient's wallet
    await adminClient.from('transactions').insert({
      user_id: gift.recipient_id,
      points_added: gift.coins_amount,
      event_name: `Gift from ${senderName}`,
    })
  }

  return (
    <GiftRevealClient
      senderName={senderName}
      recipientName={recipientName}
      coinsAmount={gift.coins_amount}
      verseText={gift.verse_text}
      verseReference={gift.verse_reference}
      personalNote={gift.personal_note}
      alreadyOpened={alreadyOpened}
    />
  )
}
