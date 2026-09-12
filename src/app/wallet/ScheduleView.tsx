'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock, Calendar as CalendarIcon, Church, BookOpen, Users, TreePine, Gift, PartyPopper, Cross, Smile } from 'lucide-react';

const NaqoosIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="12" r="6" />
    <circle cx="9" cy="12" r="2" />
    <path d="M5 12 C3 16, 8 18, 10.5 14 C12 11, 7 8, 5 12 Z" />
    <path d="M14 4 L6 20 L22 20 L18 12" />
    <line x1="14" y1="4" x2="14" y2="1" />
    <line x1="22" y1="9" x2="15" y2="16" strokeWidth="2" />
    <line x1="23" y1="8" x2="21" y2="10" strokeWidth="3" />
  </svg>
);

const EventIconIllustration = ({ icon, title }: { icon?: string, title: string }) => {
  // Determine icon to use: use explicit icon if available, otherwise try to guess from title
  let iconType = icon && icon !== 'default' ? icon : '';
  if (!iconType) {
    const lower = title.toLowerCase();
    if (lower.includes('monday') || lower.includes('church')) iconType = 'church';
    else if (lower.includes('tasbeha')) iconType = 'tasbeha';
    else if (lower.includes('wednesday') || lower.includes('meeting')) iconType = 'users';
  }
  
  if (iconType === 'church') {
    return (
      <div className="flex items-center justify-center animate-float" style={{ animationDelay: '0.2s' }}>
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#FCF8F2] to-[#EBE3D5] rounded-full shadow-[0_4px_10px_rgba(65,96,71,0.15)] flex items-center justify-center border-2 border-white">
          <Church className="w-8 h-8 sm:w-10 sm:h-10 text-primary drop-shadow-sm" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  if (iconType === 'tasbeha') {
    return (
      <div className="flex items-center justify-center gap-2 animate-float-delayed">
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#D97746] to-[#b35e33] rounded-2xl shadow-[0_4px_10px_rgba(217,119,70,0.3)] flex items-center justify-center border-2 border-white rotate-[-8deg] hover:rotate-0 transition-transform">
          <NaqoosIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-sm" />
        </div>
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-[#2E4034] rounded-full shadow-[0_4px_10px_rgba(65,96,71,0.3)] flex items-center justify-center border-2 border-white rotate-[8deg] hover:rotate-0 transition-transform">
          <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-sm" />
        </div>
      </div>
    );
  }
  if (iconType === 'users') {
    return (
      <div className="flex items-center justify-center animate-sway">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] rounded-3xl shadow-[0_4px_10px_rgba(186,230,253,0.4)] flex items-center justify-center border-2 border-white rotate-[3deg]">
          <Users className="w-8 h-8 sm:w-10 sm:h-10 text-[#0369a1] drop-shadow-sm" />
          <div className="absolute -bottom-2 -left-2 text-xl filter drop-shadow-sm animate-bounce">👋</div>
        </div>
      </div>
    );
  }
  if (iconType === 'christmas') {
    return (
      <div className="flex items-center justify-center animate-float">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-full shadow-[0_4px_10px_rgba(220,38,38,0.15)] flex items-center justify-center border-2 border-white">
          <TreePine className="w-8 h-8 sm:w-10 sm:h-10 text-green-700 drop-shadow-sm" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-sm animate-pulse">
            <Gift className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>
    );
  }
  if (iconType === 'cross') {
    return (
      <div className="flex items-center justify-center animate-float">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl shadow-[0_4px_10px_rgba(217,119,70,0.2)] flex items-center justify-center border-2 border-white rotate-[45deg] hover:rotate-0 transition-transform">
          <div className="-rotate-[45deg] group-hover:rotate-0 transition-transform">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-secondary drop-shadow-sm">
              <path d="M12 2v20" />
              <path d="M5 8h14" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (iconType === 'fun') {
    return (
      <div className="flex items-center justify-center animate-sway">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-50 to-fuchsia-100 rounded-full shadow-[0_4px_10px_rgba(192,38,211,0.2)] flex items-center justify-center border-2 border-white">
          <PartyPopper className="w-8 h-8 sm:w-10 sm:h-10 text-fuchsia-600 drop-shadow-sm" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm animate-bounce">
            <Smile className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    );
  }

  // Fallback icon
  return (
    <div className="flex items-center justify-center animate-float">
      <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center border-2 border-gray-100 shadow-inner">
        <CalendarIcon className="w-6 h-6 text-gray-300" />
      </div>
    </div>
  );
};

export type ScheduleEvent = {
  id: string;
  title: string;
  location: string;
  day_of_week: number;
  start_time: string;
  end_time: string | null;
  valid_until: string | null;
  is_recurring: boolean;
  event_date?: string | null;
  icon?: string;
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
      // If it's a one-time event, check the specific date
      if (!e.is_recurring && e.event_date) {
        return new Date(e.event_date).toDateString() === date.toDateString();
      }
      
      // If recurring, check valid_until
      if (e.is_recurring) {
        if (e.valid_until && new Date(date) > new Date(e.valid_until)) {
          return false;
        }
        return e.day_of_week === date.getDay();
      }
      return false;
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
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 w-full">
                      
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
                      
                      {/* Cartoon Illustration (Right) */}
                      <div className="hidden sm:flex shrink-0 min-w-[100px] items-center justify-end pr-2 md:pr-6">
                        <EventIconIllustration icon={event.icon} title={event.title} />
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
