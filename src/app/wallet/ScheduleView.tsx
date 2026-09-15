'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock, Church, BookOpen, Users, TreePine, PartyPopper, CalendarDays } from 'lucide-react';

const CopticDafIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    <circle cx="13" cy="16" r="9" stroke="currentColor" strokeWidth="2"/>
    <circle cx="13" cy="16" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M18 8 L26 4 L30 12 L22 16Z" fill="currentColor" opacity="0.7"/>
    <line x1="26" y1="4" x2="30" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const EventBadge = ({ icon, title }: { icon?: string; title: string }) => {
  let iconType = icon && icon !== 'default' ? icon : '';
  if (!iconType) {
    const t = title.toLowerCase();
    if (t.includes('monday') || t.includes('church')) iconType = 'church';
    else if (t.includes('tasbeha')) iconType = 'tasbeha';
    else if (t.includes('wednesday') || t.includes('meeting')) iconType = 'users';
  }

  const configs: Record<string, { bg: string; fg: string; icon: React.ReactNode }> = {
    church: { bg: 'bg-[#EDF2EE]', fg: 'text-[#416047]', icon: <Church strokeWidth={1.5} className="w-5 h-5" /> },
    tasbeha: { bg: 'bg-[#FEF0E7]', fg: 'text-[#D97746]', icon: <CopticDafIcon className="w-5 h-5" /> },
    users: { bg: 'bg-[#EEF4FB]', fg: 'text-[#2D6FAB]', icon: <Users strokeWidth={1.5} className="w-5 h-5" /> },
    christmas: { bg: 'bg-[#EDFBF0]', fg: 'text-[#1A6B33]', icon: <TreePine strokeWidth={1.5} className="w-5 h-5" /> },
    cross: {
      bg: 'bg-[#FDF8EE]', fg: 'text-[#9A6B10]',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5"><path d="M12 2v20M5 8h14" /></svg>,
    },
    fun: { bg: 'bg-[#F5F0FE]', fg: 'text-[#6B3FA0]', icon: <PartyPopper strokeWidth={1.5} className="w-5 h-5" /> },
  };

  const cfg = configs[iconType] ?? { bg: 'bg-gray-100', fg: 'text-gray-400', icon: <CalendarDays strokeWidth={1.5} className="w-5 h-5" /> };

  return (
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.fg}`}>
      {cfg.icon}
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

const DEFAULT_EVENTS: ScheduleEvent[] = [
  { id: '1', title: 'PDA Monday meeting', location: 'Saint Mary and Anba Beshoy Church', day_of_week: 1, start_time: '19:00', end_time: null, valid_until: '2026-12-12', is_recurring: true },
  { id: '2', title: 'Tasbeha and Bible study', location: 'AUC', day_of_week: 1, start_time: '22:00', end_time: null, valid_until: '2026-12-12', is_recurring: true },
  { id: '3', title: 'PDA Wednesday Meeting', location: 'AUC cubes', day_of_week: 3, start_time: '13:00', end_time: '14:00', valid_until: '2026-12-12', is_recurring: true },
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function ScheduleView({ initialEvents }: { initialEvents: ScheduleEvent[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const events = initialEvents && initialEvents.length > 0 ? initialEvents : DEFAULT_EVENTS;

  const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    date.setDate(date.getDate() - date.getDay());
    return date;
  };

  const addDays = (d: Date, n: number) => {
    const date = new Date(d);
    date.setDate(date.getDate() + n);
    return date;
  };

  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek, i));
  const today = new Date();
  const todayStr = today.toDateString();

  const monthLabel = MONTH_NAMES[startOfWeek.getMonth()];
  const endMonth = MONTH_NAMES[weekDays[6].getMonth()];
  const yearLabel = startOfWeek.getFullYear();
  const monthDisplay = monthLabel === endMonth ? `${monthLabel} ${yearLabel}` : `${monthLabel} – ${endMonth} ${yearLabel}`;

  const getEventsForDate = (date: Date) =>
    events
      .filter(e => {
        if (!e.is_recurring && e.event_date) return new Date(e.event_date).toDateString() === date.toDateString();
        if (e.is_recurring) {
          if (e.valid_until && date > new Date(e.valid_until)) return false;
          return e.day_of_week === date.getDay();
        }
        return false;
      })
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const activeDays = weekDays.map(d => ({ date: d, events: getEventsForDate(d) })).filter(d => d.events.length > 0);
  const hasEvents = activeDays.length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary mb-0.5">Community</p>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Schedule</h2>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-black/5 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 text-sm font-semibold text-foreground/70 min-w-[148px] text-center">{monthDisplay}</span>
          <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-black/5 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Week Strip */}
      <div className="grid grid-cols-7 mb-8 border border-black/8 rounded-2xl overflow-hidden divide-x divide-black/8 bg-white shadow-sm">
        {weekDays.map((date, i) => {
          const isToday = date.toDateString() === todayStr;
          const hasEvt = getEventsForDate(date).length > 0;
          return (
            <div key={i} className={`flex flex-col items-center py-3 gap-1.5 ${isToday ? 'bg-foreground' : ''}`}>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${isToday ? 'text-white/50' : 'text-foreground/35'}`}>{DAY_NAMES[date.getDay()]}</span>
              <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-foreground/70'}`}>{date.getDate()}</span>
              <div className={`w-1 h-1 rounded-full transition-opacity ${hasEvt ? 'opacity-100' : 'opacity-0'} ${isToday ? 'bg-secondary' : 'bg-primary'}`} />
            </div>
          );
        })}
      </div>

      {/* Events */}
      {!hasEvents ? (
        <div className="text-center py-20 text-foreground/30">
          <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No events this week</p>
        </div>
      ) : (
        <div className="space-y-7">
          {activeDays.map(({ date, events: dayEvents }, dayIdx) => {
            const isToday = date.toDateString() === todayStr;
            const isPast = date < today && !isToday;
            return (
              <div key={dayIdx}>
                {/* Day Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${isToday ? 'bg-foreground text-white' : isPast ? 'bg-black/5 text-foreground/25' : 'bg-black/5 text-foreground/55'}`}>
                    {date.getDate()}
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-widest ${isToday ? 'text-secondary' : 'text-foreground/35'}`}>
                    {FULL_DAY_NAMES[date.getDay()]}
                  </span>
                  {isToday && <span className="text-[9px] font-bold uppercase tracking-wider text-white bg-secondary rounded-full px-2 py-0.5">Today</span>}
                  <div className="flex-1 h-px bg-black/6" />
                </div>

                {/* Cards */}
                <div className="ml-11 space-y-2.5">
                  {dayEvents.map((event) => (
                    <div key={event.id} className={`group relative bg-white rounded-xl border border-black/7 px-5 py-4 hover:shadow-md hover:border-black/12 transition-all duration-200 ${isPast ? 'opacity-50' : ''}`}>
                      <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-primary group-hover:top-2 group-hover:bottom-2 transition-all duration-200" />
                      <div className="flex items-start gap-4">
                        <EventBadge icon={event.icon} title={event.title} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground text-sm leading-snug mb-1.5">{event.title}</h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-foreground/45 font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 shrink-0" />
                              {formatTime(event.start_time)}{event.end_time && ` – ${formatTime(event.end_time)}`}
                            </span>
                            <span className="w-px h-3 bg-foreground/15 hidden sm:block" />
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 shrink-0" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                        {event.is_recurring && (
                          <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-foreground/30 bg-black/5 px-2 py-1 rounded-md self-start mt-0.5 hidden sm:block">
                            Weekly
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
