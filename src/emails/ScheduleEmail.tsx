import { Html, Head, Preview, Body, Container, Section, Text, Heading } from '@react-email/components'
import * as React from 'react'

interface ScheduleEvent {
  id: string;
  title: string;
  location: string;
  day: string;
  time: string;
}

interface ScheduleEmailProps {
  userName: string;
  events: ScheduleEvent[];
}

export default function ScheduleEmail({ userName = 'there', events = [] }: ScheduleEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Weekly Schedule from The Upper Room 🗓️</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Header */}
          <Section style={banner}>
            <Heading style={title}>The Upper Room</Heading>
            <Heading style={subtitle}>Weekly Schedule</Heading>
          </Section>

          <Section style={body}>
            <Text style={greeting}>Hello {userName},</Text>
            <Text style={text}>
              Here is the schedule for our upcoming meetings this week. We can't wait to see you there!
            </Text>
            
            <div style={eventList}>
              {events.length === 0 ? (
                <Text style={text}>No events scheduled for this week.</Text>
              ) : (
                events.map((event, index) => (
                  <div key={event.id} style={index !== events.length - 1 ? eventCardWithBorder : eventCard}>
                    <Text style={eventTitle}>{event.title}</Text>
                    <Text style={eventDetail}><strong>🗓️ When:</strong> {event.day} at {event.time}</Text>
                    <Text style={eventDetail}><strong>📍 Where:</strong> {event.location}</Text>
                  </div>
                ))
              )}
            </div>
            
            <div style={footerRow}>
              <Text style={footer}>
                Stay blessed,<br/>
                <strong>The Upper Room Family</strong>
              </Text>
            </div>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '40px 0',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  borderRadius: '12px',
  maxWidth: '540px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  borderTop: '6px solid #416047',
}

const banner = {
  backgroundColor: '#FCF8F2',
  padding: '30px 20px',
  textAlign: 'center' as const,
  borderBottom: '1px solid #eaeaea',
}

const title = {
  color: '#416047',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 5px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
}

const subtitle = {
  color: '#D97746',
  fontSize: '28px',
  fontWeight: '900',
  margin: '0',
}

const body = {
  padding: '30px',
}

const greeting = {
  color: '#333333',
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '10px',
}

const text = {
  color: '#555555',
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '25px',
}

const eventList = {
  margin: '0 0 35px 0',
}

const eventCardWithBorder = {
  padding: '20px',
  backgroundColor: '#ffffff',
  border: '1px solid #eaeaea',
  borderRadius: '8px',
  marginBottom: '15px',
  borderLeft: '4px solid #D97746',
}

const eventCard = {
  padding: '20px',
  backgroundColor: '#ffffff',
  border: '1px solid #eaeaea',
  borderRadius: '8px',
  borderLeft: '4px solid #D97746',
}

const eventTitle = {
  color: '#416047',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
}

const eventDetail = {
  color: '#555555',
  fontSize: '15px',
  margin: '0 0 5px 0',
}

const footerRow = {
  borderTop: '1px solid #eaeaea',
  paddingTop: '20px',
}

const footer = {
  color: '#888888',
  fontSize: '15px',
  lineHeight: '1.5',
  margin: '0',
}
