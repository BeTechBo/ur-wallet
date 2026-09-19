import { Html, Head, Preview, Body, Container, Section, Text, Heading } from '@react-email/components'
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
          <Section style={header}>
            <Heading style={title}>Happy Birthday, {userName}! 🎂</Heading>
          </Section>
          <Section style={body}>
            <Text style={text}>
              <strong>Happy birthday to the precious child of the King!</strong>
            </Text>
            <Text style={text}>
              Jesus has created you from day one, and He is super proud of you, reminding you that He will be with you during this year as well!
            </Text>
            
            <div style={verseCard}>
              <Text style={verseText}>
                "The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you; the Lord turn his face toward you and give you peace."
              </Text>
              <Text style={verseRef}>— Numbers 6:24-26</Text>
            </div>
            
            <Text style={footer}>
              Have a blessed and joyful day!<br/>
              The Upper Room Family
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '12px',
  maxWidth: '500px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  borderTop: '6px solid #D97746',
}

const header = {
  textAlign: 'center' as const,
  marginBottom: '24px',
}

const title = {
  color: '#416047',
  fontSize: '26px',
  fontWeight: 'bold',
  margin: '0',
}

const body = {
  padding: '0 20px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '20px',
}

const verseCard = {
  backgroundColor: '#FCF8F2',
  borderRadius: '12px',
  padding: '24px',
  margin: '30px 0',
  borderLeft: '4px solid #416047',
}

const verseText = {
  color: '#2E4034',
  fontSize: '18px',
  fontStyle: 'italic',
  lineHeight: '1.6',
  margin: '0 0 12px 0',
}

const verseRef = {
  color: '#D97746',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'right' as const,
}

const footer = {
  color: '#666',
  fontSize: '14px',
  marginTop: '32px',
  lineHeight: '1.5',
}
