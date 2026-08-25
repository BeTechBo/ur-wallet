'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { PACKAGES } from '@/lib/packages'
import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import WelcomeEmail from '@/emails/WelcomeEmail'
import PointsEmail from '@/emails/PointsEmail'
import VerseEmail from '@/emails/VerseEmail'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import versesData from '@/data/verses.json'
import React from 'react'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'))

// LOGIN
export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    console.error(error.message)
    return
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
  
  if (profile?.role === 'admin') {
     redirect('/admin')
  } else {
     redirect('/wallet')
  }
}

// LOGOUT
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

// REGISTER MEMBER
export async function registerMember(formData: FormData) {
  const email = formData.get('email') as string
  const fullName = formData.get('fullName') as string
  const major = formData.get('major') as string
  const dob = formData.get('dob') as string
  
  if (!email || !fullName || !major) {
    redirect('/admin?error=Missing required fields');
  }

  const adminClient = createAdminClient()
  
  const firstName = fullName.split(' ')[0].replace(/[^a-zA-Z]/g, '');
  const cleanFirstName = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase() : 'Member';
  const randomDigits = Math.floor(1000 + Math.random() * 9000); 
  const password = `${cleanFirstName}@UR${randomDigits}!`;

  const { data, error } = await adminClient.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: { full_name: fullName }
  })

  if (error) {
    console.error('Supabase User Creation Error:', error.message)
    redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  }

  if (data?.user) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const { error: updateError } = await adminClient.from('profiles').upsert({ 
      id: data.user.id,
      email: email,
      full_name: fullName,
      major: major, 
      date_of_birth: dob ? dob : null 
    }, { onConflict: 'id' });
    
    if (updateError) {
      console.error('Failed to update profile with major/dob:', updateError);
      redirect(`/admin?error=${encodeURIComponent(updateError.message)}`);
    }
  }

  try {
    const htmlStr = await render(WelcomeEmail({ email: email, password: password, loginUrl: `${siteUrl}/` }) as React.ReactElement)
    await transporter.sendMail({
      from: `"The Upper Room" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Welcome to The Upper Room Family! ✝',
      html: htmlStr,
    })
  } catch (e) {
    console.error('Email failed to send:', e)
  }

  revalidatePath('/admin')
}

// AWARD UR-COINS
export async function awardCoins(formData: FormData) {
  const userId = formData.get('userId') as string
  const packageId = formData.get('packageId') as string
  
  if (!userId || !packageId) return

  const pkg = PACKAGES[packageId as keyof typeof PACKAGES]
  if (!pkg) return

  const adminClient = createAdminClient()
  
  const { error } = await adminClient.from('transactions').insert({
    user_id: userId,
    points_added: pkg.points,
    event_name: pkg.name
  })

  if (error) {
    console.error(error.message)
    return
  }

  // Fetch the user's email to notify them
  const { data: profile } = await adminClient.from('profiles').select('email').eq('id', userId).single()

  if (profile?.email) {
    try {
      const htmlStr = await render(PointsEmail({ 
        packageName: pkg.name,
        reason: pkg.reason,
        pointsAdded: pkg.points, 
        walletUrl: `${siteUrl}/wallet` 
      }) as React.ReactElement)
      
      await transporter.sendMail({
        from: `"The Upper Room" <${process.env.GMAIL_USER}>`,
        to: profile.email,
        subject: `You received the ${pkg.name}!`,
        html: htmlStr,
      })
    } catch (err) {
      console.error('Failed to send coins email:', err)
    }
  }

  revalidatePath('/wallet')
}

// DISTRIBUTE VERSES
export async function distributeVerses() {
  const adminClient = createAdminClient()
  
  const { data: sentVersesData } = await adminClient.from('verses').select('verse_text')
  const sentTexts = new Set(sentVersesData?.map(v => v.verse_text) || [])
  
  const unsentVerses = versesData.filter(v => !sentTexts.has(v.text))
  
  const selectedVerses = unsentVerses.sort(() => 0.5 - Math.random()).slice(0, 3)
  if (selectedVerses.length === 0) return
  
  const { data: users } = await adminClient.from('profiles').select('id, email')
  if (!users || users.length === 0) return
  
  for (const user of users) {
     const randomVerse = selectedVerses[Math.floor(Math.random() * selectedVerses.length)]
     
     await adminClient.from('verses').insert({
       user_id: user.id,
       verse_text: randomVerse.text,
       reference: randomVerse.reference
     })
     
     try {
       const htmlStr = await render(VerseEmail({ 
         verseText: randomVerse.text, 
         verseReference: randomVerse.reference,
         walletUrl: `${siteUrl}/wallet` 
       }) as React.ReactElement)
       await transporter.sendMail({
         from: `"The Upper Room" <${process.env.GMAIL_USER}>`,
         to: user.email,
         subject: 'Echoes from the Upper Room',
         html: htmlStr,
       })
     } catch(e) {
       console.error('Email failed to send:', e)
     }
  }
  
  revalidatePath('/admin')
  revalidatePath('/wallet')
}

export async function updateMyProfile(formData: FormData) {
  const adminClient = createAdminClient()
  const { data: authData } = await adminClient.auth.getUser()
  if (!authData?.user) return
  
  const fullName = formData.get('fullName') as string
  const major = formData.get('major') as string
  const dob = formData.get('dob') as string

  if (fullName) {
    await adminClient.auth.admin.updateUserById(authData.user.id, {
      user_metadata: { full_name: fullName }
    })
  }

  await adminClient.from('profiles').upsert({
    id: authData.user.id,
    email: authData.user.email,
    full_name: fullName || undefined,
    major: major || undefined,
    date_of_birth: dob ? dob : null
  }, { onConflict: 'id' })

  revalidatePath('/wallet')
}

