import { Html, Head, Preview, Body, Container, Section, Text, Heading, Img } from '@react-email/components'
import * as React from 'react'

interface BirthdayEmailProps {
  userName: string;
}

export default function BirthdayEmail({ userName = 'there' }: BirthdayEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Happy birthday to the precious child of the King! 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Festive Banner */}
          <Section style={banner}>
            <Text style={emojiRow}>🎈 🎉 🎂 🎉 🎈</Text>
            <Heading style={title}>Happy Birthday,</Heading>
            <Heading style={nameTitle}>{userName}!</Heading>
          </Section>

          <Section style={body}>
            <Text style={highlightText}>
              Happy birthday to the precious child of the King! 👑
            </Text>
            
            <Text style={text}>
              Jesus has created you from day one, and He is super proud of you, reminding you that He will be with you during this year as well! 
            </Text>
            
            <div style={verseCard}>
              <Text style={sparkle}>✨</Text>
              <Text style={verseText}>
                "The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you; the Lord turn his face toward you and give you peace."
              </Text>
              <Text style={verseRef}>- Numbers 6:24-26</Text>
              <Text style={sparkleBottom}>✨</Text>
            </div>
            
            <div style={footerRow}>
              <Text style={footer}>
                Have a beautiful, blessed, and joyful day!<br/>
                <strong>The Upper Room Family</strong> 🎁
              </Text>
            </div>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f9e8d9', // Warm, festive background for the email client
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '40px 0',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  borderRadius: '24px',
  maxWidth: '540px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
}

const banner = {
  background: 'linear-gradient(135deg, #D97746 0%, #416047 100%)', // Upper Room colors in a gradient!
  padding: '40px 20px',
  textAlign: 'center' as const,
}

const emojiRow = {
  fontSize: '28px',
  margin: '0 0 15px 0',
  letterSpacing: '10px',
}

const title = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'normal',
  margin: '0',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  opacity: 0.9,
}

const nameTitle = {
  color: '#ffffff',
  fontSize: '42px',
  fontWeight: '900',
  margin: '5px 0 0 0',
  letterSpacing: '-1px',
}

const body = {
  padding: '40px 30px',
}

const highlightText = {
  color: '#D97746',
  fontSize: '22px',
  fontWeight: 'bold',
  lineHeight: '1.4',
  textAlign: 'center' as const,
  margin: '0 0 25px 0',
}

const text = {
  color: '#444444',
  fontSize: '17px',
  lineHeight: '1.6',
  textAlign: 'center' as const,
  marginBottom: '35px',
}

const verseCard = {
  backgroundColor: '#FCF8F2',
  borderRadius: '16px',
  padding: '30px',
  margin: '0 0 35px 0',
  border: '2px dashed #D97746',
  position: 'relative' as const,
  textAlign: 'center' as const,
}

const sparkle = {
  fontSize: '24px',
  margin: '0 0 10px 0',
}

const sparkleBottom = {
  fontSize: '24px',
  margin: '15px 0 0 0',
}

const verseText = {
  color: '#2E4034',
  fontSize: '19px',
  fontStyle: 'italic',
  lineHeight: '1.5',
  margin: '0 0 15px 0',
  fontWeight: '500',
}

const verseRef = {
  color: '#D97746',
  fontSize: '15px',
  fontWeight: 'bold',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
}

const footerRow = {
  borderTop: '1px solid #f0f0f0',
  paddingTop: '25px',
}

const footer = {
  color: '#888888',
  fontSize: '15px',
  lineHeight: '1.6',
  textAlign: 'center' as const,
  margin: '0',
}
