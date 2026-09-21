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
      <Preview>Your Weekly Schedule from The Upper Room</Preview>
      <Body style={main}>
        <Container style={container}>
          
          <Section style={header}>
            <Heading style={title}>The Upper Room</Heading>
            <Text style={subtitle}>Weekly Schedule</Text>
          </Section>

          <Section style={body}>
            <Text style={greeting}>Hello {userName},</Text>
            <Text style={text}>
              Here is the schedule for our upcoming meetings this week. We hope you can join us!
            </Text>
            
            <div style={eventList}>
              {events.length === 0 ? (
                <Text style={text}>No events scheduled for this week.</Text>
              ) : (
                events.map((event) => (
                  <div key={event.id} style={eventCard}>
                    <Text style={eventTitle}>{event.title}</Text>
                    <div style={eventDetailsGroup}>
                      <Text style={eventDetail}>
                        <span style={iconSpan}>📅</span> {event.day} at {event.time}
                      </Text>
                      <Text style={eventDetail}>
                        <span style={iconSpan}>📍</span> {event.location}
                      </Text>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <Section style={footer}>
              <Text style={footerText}>
                Stay blessed,<br/>
                The Upper Room Family
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f9fafb',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  padding: '40px 0',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  maxWidth: '500px',
}

const header = {
  padding: '32px 32px 24px 32px',
  borderBottom: '1px solid #e5e7eb',
}

const title = {
  fontSize: '22px',
  fontWeight: '600',
  color: '#111827',
  margin: '0 0 4px 0',
}

const subtitle = {
  fontSize: '15px',
  color: '#6b7280',
  margin: '0',
}

const body = {
  padding: '32px',
}

const greeting = {
  fontSize: '16px',
  color: '#111827',
  margin: '0 0 16px 0',
}

const text = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#374151',
  margin: '0 0 32px 0',
}

const eventList = {
  margin: '0 0 32px 0',
}

const eventCard = {
  marginBottom: '24px',
}

const eventTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#111827',
  margin: '0 0 8px 0',
}

const eventDetailsGroup = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '4px',
}

const eventDetail = {
  fontSize: '14px',
  color: '#4b5563',
  margin: '0',
}

const iconSpan = {
  display: 'inline-block',
  width: '20px',
}

const footer = {
  borderTop: '1px solid #e5e7eb',
  paddingTop: '24px',
}

const footerText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#6b7280',
  margin: '0',
}
