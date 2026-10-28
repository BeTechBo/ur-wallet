import { Html, Head, Preview, Body, Container, Section, Text, Heading, Button, Hr } from '@react-email/components'
import * as React from 'react'

export interface LeaderboardMember {
  rank: number;
  name: string;
  points: number;
}

interface LeaderboardEmailProps {
  userName?: string;
  leaders?: LeaderboardMember[];
  customNote?: string;
  walletUrl?: string;
}

export default function LeaderboardEmail({
  userName = 'there',
  leaders = [
    { rank: 1, name: 'David Samir', points: 420 },
    { rank: 2, name: 'Mary Nabil', points: 380 },
    { rank: 3, name: 'Peter George', points: 340 },
    { rank: 4, name: 'Marina Ashraf', points: 310 },
    { rank: 5, name: 'Youssef Mina', points: 290 },
  ],
  customNote,
  walletUrl = 'https://urwallet.vercel.app/wallet',
}: LeaderboardEmailProps) {
  const top1 = leaders.find(l => l.rank === 1) || leaders[0];
  const top2 = leaders.find(l => l.rank === 2) || leaders[1];
  const top3 = leaders.find(l => l.rank === 3) || leaders[2];
  const remaining = leaders.filter(l => l.rank > 3);

  return (
    <Html>
      <Head />
      <Preview>Celebrating our Top 5 fellowship champions this week! 🏆✨</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Celebratory Banner */}
          <Section style={banner}>
            <Text style={bannerPretitle}>THE UPPER ROOM FELLOWSHIP</Text>
            <Heading style={bannerTitle}>Top 5 Champions! 🏆</Heading>
            <Text style={bannerSubtitle}>Celebrating commitment, fellowship & joy</Text>
          </Section>

          <Section style={content}>
            {/* Warm Greeting */}
            <Text style={greeting}>Hello {userName},</Text>
            <Text style={introText}>
              We are so grateful for each one of you in our Upper Room family! This week, we celebrate our brothers and sisters who are shining bright on our fellowship leaderboard:
            </Text>

            {/* Optional Custom Admin Note */}
            {customNote && customNote.trim().length > 0 && (
              <div style={customNoteBox}>
                <Text style={customNoteText}>"{customNote}"</Text>
              </div>
            )}

            {/* PODIUM: 1st Place Spotlight */}
            {top1 && (
              <div style={firstPlaceCard}>
                <div style={medalBadgeGold}>👑 1st Place</div>
                <Text style={firstPlaceName}>{top1.name}</Text>
                <div style={firstPlacePointsPill}>
                  <span style={pointsValueGold}>{top1.points}</span>
                  <span style={pointsLabelGold}>UR-coins</span>
                </div>
              </div>
            )}

            {/* 2nd & 3rd Place Cards */}
            {(top2 || top3) && (
              <div style={runnerUpGrid}>
                {top2 && (
                  <div style={secondPlaceCard}>
                    <div style={medalBadgeSilver}>🥈 2nd Place</div>
                    <Text style={runnerUpName}>{top2.name}</Text>
                    <div style={pointsPillSilver}>
                      <span style={runnerUpPoints}>{top2.points}</span>
                      <span style={runnerUpLabel}>coins</span>
                    </div>
                  </div>
                )}
                {top3 && (
                  <div style={thirdPlaceCard}>
                    <div style={medalBadgeBronze}>🥉 3rd Place</div>
                    <Text style={runnerUpName}>{top3.name}</Text>
                    <div style={pointsPillBronze}>
                      <span style={runnerUpPoints}>{top3.points}</span>
                      <span style={runnerUpLabel}>coins</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4th & 5th Place List */}
            {remaining.length > 0 && (
              <div style={remainingList}>
                {remaining.map((m) => (
                  <div key={m.rank} style={remainingRow}>
                    <div style={rankCircle}>{m.rank}th</div>
                    <Text style={remainingName}>{m.name}</Text>
                    <div style={remainingPointsPill}>
                      <strong>{m.points}</strong> UR-coins
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Hr style={divider} />

            {/* Uplifting Encouragement & Scripture */}
            <div style={scriptureCard}>
              <Text style={scriptureIcon}>🕊️</Text>
              <Text style={scriptureText}>
                "Therefore encourage one another and build each other up, just as in fact you are doing."
              </Text>
              <Text style={scriptureRef}>— 1 Thessalonians 5:11</Text>
            </div>

            <Text style={encouragementBody}>
              Every gathering attended, every Bible verse memorized, and every act of service builds up our Upper Room family in Christ. Let’s keep encouraging one another!
            </Text>

            {/* Action Button */}
            <div style={buttonContainer}>
              <Button style={button} href={walletUrl}>
                Open My UR Wallet →
              </Button>
            </div>

            {/* Footer */}
            <div style={footerContainer}>
              <Text style={footerText}>
                With all our love & prayers,<br />
                <strong>The Upper Room Family</strong> ❤️
              </Text>
            </div>

          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// STYLES
const main = {
  backgroundColor: '#f6f3ee',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: '36px 0',
  margin: '0',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  borderRadius: '20px',
  maxWidth: '540px',
  border: '1px solid #ebd9c8',
  overflow: 'hidden',
  boxShadow: '0 6px 24px rgba(65, 40, 20, 0.06)',
}

const banner = {
  background: 'linear-gradient(135deg, #C25E2E 0%, #D97746 55%, #345239 100%)',
  padding: '36px 24px 32px 24px',
  textAlign: 'center' as const,
}

const bannerPretitle = {
  color: 'rgba(255, 255, 255, 0.85)',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '2.5px',
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
}

const bannerTitle = {
  color: '#ffffff',
  fontSize: '30px',
  fontWeight: '800',
  letterSpacing: '-0.5px',
  margin: '0 0 6px 0',
  lineHeight: '1.2',
}

const bannerSubtitle = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
}

const content = {
  padding: '32px 28px',
}

const greeting = {
  fontSize: '19px',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0 0 8px 0',
}

const introText = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#4b5563',
  margin: '0 0 24px 0',
}

const customNoteBox = {
  backgroundColor: '#fffbeb',
  borderLeft: '4px solid #f59e0b',
  borderRadius: '8px',
  padding: '12px 16px',
  margin: '0 0 24px 0',
}

const customNoteText = {
  fontSize: '14px',
  fontStyle: 'italic',
  color: '#92400e',
  margin: '0',
  lineHeight: '1.5',
}

// 1st Place Card
const firstPlaceCard = {
  backgroundColor: '#fffdf5',
  border: '2px solid #f59e0b',
  borderRadius: '16px',
  padding: '24px 20px',
  textAlign: 'center' as const,
  margin: '0 0 16px 0',
  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.12)',
}

const medalBadgeGold = {
  display: 'inline-block',
  backgroundColor: '#fef3c7',
  color: '#b45309',
  fontSize: '12px',
  fontWeight: '800',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  padding: '5px 14px',
  borderRadius: '999px',
  marginBottom: '10px',
  border: '1px solid #fde68a',
}

const firstPlaceName = {
  fontSize: '24px',
  fontWeight: '800',
  color: '#111827',
  margin: '0 0 10px 0',
  lineHeight: '1.2',
}

const firstPlacePointsPill = {
  display: 'inline-flex',
  alignItems: 'baseline',
  backgroundColor: '#f59e0b',
  borderRadius: '12px',
  padding: '6px 16px',
}

const pointsValueGold = {
  color: '#ffffff',
  fontSize: '22px',
  fontWeight: '900',
  marginRight: '6px',
}

const pointsLabelGold = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '13px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
}

// 2nd & 3rd Place Grid
const runnerUpGrid = {
  display: 'flex',
  gap: '12px',
  margin: '0 0 16px 0',
}

const secondPlaceCard = {
  flex: '1',
  backgroundColor: '#f8fafc',
  border: '1.5px solid #cbd5e1',
  borderRadius: '14px',
  padding: '16px 12px',
  textAlign: 'center' as const,
}

const medalBadgeSilver = {
  display: 'inline-block',
  backgroundColor: '#e2e8f0',
  color: '#334155',
  fontSize: '11px',
  fontWeight: '800',
  letterSpacing: '0.5px',
  padding: '4px 10px',
  borderRadius: '999px',
  marginBottom: '8px',
}

const thirdPlaceCard = {
  flex: '1',
  backgroundColor: '#fff7ed',
  border: '1.5px solid #fdba74',
  borderRadius: '14px',
  padding: '16px 12px',
  textAlign: 'center' as const,
}

const medalBadgeBronze = {
  display: 'inline-block',
  backgroundColor: '#fed7aa',
  color: '#9a3412',
  fontSize: '11px',
  fontWeight: '800',
  letterSpacing: '0.5px',
  padding: '4px 10px',
  borderRadius: '999px',
  marginBottom: '8px',
}

const runnerUpName = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#1e293b',
  margin: '0 0 8px 0',
  lineHeight: '1.3',
}

const pointsPillSilver = {
  display: 'inline-block',
  backgroundColor: '#475569',
  color: '#ffffff',
  borderRadius: '8px',
  padding: '4px 10px',
  fontSize: '12px',
}

const pointsPillBronze = {
  display: 'inline-block',
  backgroundColor: '#c2410c',
  color: '#ffffff',
  borderRadius: '8px',
  padding: '4px 10px',
  fontSize: '12px',
}

const runnerUpPoints = {
  fontWeight: '800',
  fontSize: '14px',
  marginRight: '4px',
}

const runnerUpLabel = {
  opacity: 0.9,
  fontSize: '11px',
}

// 4th & 5th Place List
const remainingList = {
  backgroundColor: '#f9fafb',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  padding: '4px 14px',
  margin: '0 0 24px 0',
}

const remainingRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 0',
  borderBottom: '1px solid #f3f4f6',
}

const rankCircle = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  backgroundColor: '#e5e7eb',
  color: '#4b5563',
  fontSize: '11px',
  fontWeight: '800',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '12px',
}

const remainingName = {
  flex: '1',
  fontSize: '14px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0',
}

const remainingPointsPill = {
  fontSize: '13px',
  color: '#6b7280',
}

const divider = {
  borderTop: '1px solid #e5e7eb',
  borderBottom: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  margin: '28px 0 24px 0',
}

const scriptureCard = {
  backgroundColor: '#f3f6f4',
  borderLeft: '4px solid #345239',
  borderRadius: '8px',
  padding: '16px 20px',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
}

const scriptureIcon = {
  fontSize: '22px',
  margin: '0 0 6px 0',
}

const scriptureText = {
  fontSize: '14px',
  fontStyle: 'italic',
  lineHeight: '1.5',
  color: '#26402c',
  margin: '0 0 6px 0',
}

const scriptureRef = {
  fontSize: '12px',
  fontWeight: '700',
  color: '#345239',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}

const encouragementBody = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#4b5563',
  textAlign: 'center' as const,
  margin: '0 0 24px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '0 0 28px 0',
}

const button = {
  backgroundColor: '#D97746',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '700',
  borderRadius: '12px',
  padding: '13px 28px',
  textDecoration: 'none',
  display: 'inline-block',
  boxShadow: '0 4px 12px rgba(217, 119, 70, 0.25)',
}

const footerContainer = {
  borderTop: '1px solid #f3f4f6',
  paddingTop: '20px',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#6b7280',
  margin: '0',
}
