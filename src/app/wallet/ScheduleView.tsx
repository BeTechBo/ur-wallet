'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock, Calendar as CalendarIcon } from 'lucide-react';

export type ScheduleEvent = {
  id: string;
  title: string;
  location: string;
  day_of_week: number;
  start_time: string;
  end_time: string | null;
  valid_until: string | null;
  is_recurring: boolean;
};

// Fallback hardcoded events if DB empty
const DEFAULT_EVENTS: ScheduleEvent[] = [
  {
    id: '1',
    title: 'PDA Monday meeting',
    location: 'Saint Mary and Anba Beshoy Church',
    day_of_week: 1,
    start_time: '19:00', // 7:00 PM
    end_time: null,
    valid_until: '2026-12-12',
    is_recurring: true
  },
  {
    id: '2',
    title: 'Tasbeha and Bible study',
    location: 'AUC',
    day_of_week: 1,
    start_time: '22:00', // 10:00 PM
    end_time: null,
    valid_until: '2026-12-12',
    is_recurring: true
  },
  {
    id: '3',
    title: 'PDA Wednesday Meeting',
    location: 'AUC cubes',
    day_of_week: 3,
    start_time: '13:00', // 1:00 PM
    end_time: '14:00', // 2:00 PM
    valid_until: '2026-12-12',
    is_recurring: true
  }
];

export default function ScheduleView({ initialEvents }: { initialEvents: ScheduleEvent[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const events = initialEvents && initialEvents.length > 0 ? initialEvents : DEFAULT_EVENTS;

  // Helper functions for dates
  const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  const addDays = (d: Date, days: number) => {
    const date = new Date(d);
    date.setDate(date.getDate() + days);
    return date;
  };
  
  const addWeeks = (d: Date, weeks: number) => {
    return addDays(d, weeks * 7);
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek, i));

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Filter events for a given date
  const getEventsForDate = (date: Date) => {
    return events.filter(e => {
      // Check valid_until if recurring
      if (e.valid_until && new Date(date) > new Date(e.valid_until)) {
        return false;
      }
      return e.day_of_week === date.getDay();
    }).sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-secondary/20 shadow-lg shadow-secondary/5 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 border-b border-gray-100 pb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center border border-primary/10">
            <CalendarIcon className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground">Community Schedule</h2>
        </div>

        <div className="flex items-center gap-4 bg-gray-50/80 px-2 py-1.5 rounded-2xl border border-gray-100">
          <button 
            onClick={() => setCurrentDate(addWeeks(currentDate, -1))}
            className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-400 hover:text-primary"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="w-32 text-center text-sm font-extrabold text-foreground tracking-widest uppercase">{monthName}</h3>
          <button 
            onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
            className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-400 hover:text-primary"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Week Header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-10 relative z-10">
        {weekDays.map((date, i) => {
          const isToday = new Date().toDateString() === date.toDateString();
          return (
            <div key={i} className="flex flex-col items-center">
              <span className={`text-[10px] sm:text-xs font-extrabold uppercase tracking-widest mb-2 ${isToday ? 'text-primary' : 'text-gray-400'}`}>
                {date.toLocaleString('default', { weekday: 'short' })}
              </span>
              <div className={`w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl text-sm sm:text-base font-bold transition-all duration-300
                ${isToday ? 'bg-gradient-to-br from-primary to-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-gray-50 text-gray-600 border border-gray-100 hover:border-primary/30 hover:bg-white'}`}>
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Events List */}
      <div className="space-y-8 animate-fade-in relative">
        <div className="absolute left-[20px] sm:left-[28px] top-4 bottom-4 w-px bg-gradient-to-b from-gray-100 via-gray-200 to-gray-100 hidden sm:block"></div>
        {weekDays.map((date, i) => {
          const dayEvents = getEventsForDate(date);
          const isToday = new Date().toDateString() === date.toDateString();
          
          if (dayEvents.length === 0) return null;

          return (
            <div 
              key={i} 
              className="relative animate-slide-up sm:pl-16" 
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Timeline Dot (Desktop only) */}
              <div className={`hidden sm:block absolute left-[24px] top-4 w-3 h-3 rounded-full border-2 transform -translate-x-1/2 z-10 ${isToday ? 'bg-primary border-white shadow-[0_0_0_4px_rgba(65,96,71,0.1)]' : 'bg-white border-gray-300'}`}></div>

              <div className="sticky top-0 bg-white z-10 py-3 mb-4 flex items-center gap-3">
                <h4 className={`text-sm font-bold uppercase tracking-widest ${isToday ? 'text-primary' : 'text-gray-500'}`}>
                  {date.toLocaleString('default', { weekday: 'long' })}, {date.toLocaleString('default', { month: 'short' })} {date.getDate()}
                </h4>
                {isToday && (
                  <span className="bg-gradient-to-r from-primary to-secondary text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow-sm animate-pulse">
                    TODAY
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {dayEvents.map((event, eventIdx) => (
                  <div 
                    key={event.id} 
                    className="relative bg-gradient-to-br from-white to-gray-50/50 border border-gray-100 rounded-2xl p-5 sm:p-6 hover:shadow-lg hover:border-secondary/30 transition-all duration-300 group overflow-hidden"
                    style={{ animationDelay: `${(i * 100) + (eventIdx * 50)}ms` }}
                  >
                    {/* Left Accent Bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-secondary opacity-80 group-hover:opacity-100 group-hover:w-2 transition-all duration-300"></div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                      
                      {/* Time Block */}
                      <div className="flex flex-col min-w-[130px] shrink-0 bg-white border border-gray-100 rounded-xl p-3 shadow-sm group-hover:border-primary/20 transition-colors">
                        <div className="flex items-center gap-2 text-primary font-bold text-lg">
                          <Clock className="w-4 h-4 text-secondary" />
                          {formatTime(event.start_time)}
                        </div>
                        {event.end_time && (
                          <div className="text-xs text-gray-500 font-bold ml-6 mt-1 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            to {formatTime(event.end_time)}
                          </div>
                        )}
                      </div>
                      
                      {/* Event Details */}
                      <div className="flex-1">
                        <h5 className="font-extrabold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                          {event.title}
                        </h5>
                        <div className="inline-flex items-center gap-1.5 bg-gray-100/80 px-3 py-1.5 rounded-lg text-sm text-gray-600 font-medium">
                          <MapPin className="w-4 h-4 text-secondary shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {weekDays.every(d => getEventsForDate(d).length === 0) && (
          <div className="text-center py-16 text-gray-400 font-medium bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 animate-fade-in">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            No events scheduled for this week.
          </div>
        )}
      </div>
    </div>
  );
}
