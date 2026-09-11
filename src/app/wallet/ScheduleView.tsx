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
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-secondary/30 shadow-sm">
      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
        <CalendarIcon className="w-5 h-5 text-secondary" />
        <h2 className="text-xl font-bold text-foreground">Community Schedule</h2>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => setCurrentDate(addWeeks(currentDate, -1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="text-lg font-bold text-foreground tracking-wide uppercase">{monthName}</h3>
        <button 
          onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Week Header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-8">
        {weekDays.map((date, i) => {
          const isToday = new Date().toDateString() === date.toDateString();
          return (
            <div key={i} className="flex flex-col items-center">
              <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                {date.toLocaleString('default', { weekday: 'short' })}
              </span>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all
                ${isToday ? 'bg-primary text-white shadow-md' : 'text-gray-600'}`}>
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Events List */}
      <div className="space-y-8">
        {weekDays.map((date, i) => {
          const dayEvents = getEventsForDate(date);
          const isToday = new Date().toDateString() === date.toDateString();
          
          if (dayEvents.length === 0) return null;

          return (
            <div key={i} className="relative">
              <div className="sticky top-0 bg-white z-10 py-2 mb-3 border-b border-gray-100 flex items-center gap-2">
                <h4 className={`text-sm font-bold uppercase tracking-widest ${isToday ? 'text-primary' : 'text-gray-500'}`}>
                  {date.toLocaleString('default', { weekday: 'long' })}, {date.toLocaleString('default', { month: 'short' })} {date.getDate()}
                </h4>
                {isToday && <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">TODAY</span>}
              </div>

              <div className="space-y-3">
                {dayEvents.map(event => (
                  <div key={event.id} className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 sm:p-5 hover:bg-gray-50 transition-colors group">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      
                      <div className="flex flex-col min-w-[120px]">
                        <div className="flex items-center gap-2 text-primary font-bold text-lg">
                          <Clock className="w-4 h-4 opacity-70" />
                          {formatTime(event.start_time)}
                        </div>
                        {event.end_time && (
                          <div className="text-xs text-gray-400 font-medium ml-6">
                            to {formatTime(event.end_time)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-800 text-base mb-1 group-hover:text-primary transition-colors">{event.title}</h5>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                          <MapPin className="w-3.5 h-3.5" />
                          {event.location}
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
          <div className="text-center py-12 text-gray-400 italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No events scheduled for this week.
          </div>
        )}
      </div>
    </div>
  );
}
