'use client';
import { useState } from 'react';
import { SubmitButton } from '@/components/SubmitButton';
import { ScheduleEvent } from '../wallet/ScheduleView';
import { saveEvent, deleteEvent } from '../actions';
import { Edit2, Trash2, Plus, Calendar, Clock, MapPin, Repeat } from 'lucide-react';

const ICONS = [
  { id: 'church', label: 'Church' },
  { id: 'tasbeha', label: 'Tasbeha (Daf + Bible)' },
  { id: 'users', label: 'Meeting (Users)' },
  { id: 'christmas', label: 'Christmas' },
  { id: 'cross', label: 'Cross' },
  { id: 'fun', label: 'Fun (Party)' },
  { id: 'default', label: 'Default Calendar' }
];

function EventForm({ event, onCancel }: { event?: ScheduleEvent, onCancel: () => void }) {
  const [type, setType] = useState<'recurring' | 'one-time'>(event?.is_recurring === false ? 'one-time' : 'recurring');
  const [icon, setIcon] = useState(event?.icon || 'default');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <form action={async (formData) => {
      formData.append('type', type);
      formData.append('icon', icon);
      await saveEvent(formData);
      onCancel();
    }} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-primary/30 rounded-xl shadow-sm">
      {event?.id && <input type="hidden" name="id" value={event.id} />}
      
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Event Name</label>
        <input type="text" name="title" defaultValue={event?.title} required className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none" />
      </div>
      
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</label>
        <input type="text" name="location" defaultValue={event?.location} required className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none" />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Event Type</label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setType('recurring')} className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${type === 'recurring' ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>Recurring Weekly</button>
          <button type="button" onClick={() => setType('one-time')} className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${type === 'one-time' ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>One-Time Date</button>
        </div>
      </div>

      {type === 'recurring' ? (
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Day of Week</label>
          <select name="day_of_week" defaultValue={event?.day_of_week} className="w-full px-3 py-2 border rounded-lg bg-white outline-none">
            {days.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </select>
        </div>
      ) : (
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Specific Date</label>
          <input type="date" name="event_date" defaultValue={event?.event_date ? event.event_date.split('T')[0] : ''} required className="w-full px-3 py-2 border rounded-lg outline-none" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Start Time</label>
          <input type="time" name="start_time" defaultValue={event?.start_time} required className="w-full px-3 py-2 border rounded-lg outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">End Time (Opt)</label>
          <input type="time" name="end_time" defaultValue={event?.end_time || ''} className="w-full px-3 py-2 border rounded-lg outline-none" />
        </div>
      </div>

      {type === 'recurring' && (
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recurring Until (Opt)</label>
          <input type="date" name="valid_until" defaultValue={event?.valid_until ? event.valid_until.split('T')[0] : ''} className="w-full px-3 py-2 border rounded-lg outline-none max-w-sm" />
        </div>
      )}

      <div className="space-y-1 md:col-span-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Illustration Icon</label>
        <div className="flex flex-wrap gap-2">
          {ICONS.map(ic => (
            <button
              key={ic.id}
              type="button"
              onClick={() => setIcon(ic.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${icon === ic.id ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-500 border-gray-200 hover:border-secondary/50 hover:bg-secondary/5'}`}
            >
              {ic.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 md:col-span-2">
        <SubmitButton loadingText="Saving..." className="bg-primary text-white">{event ? 'Save Changes' : 'Create Event'}</SubmitButton>
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
      </div>
    </form>
  );
}

export default function AdminSchedule({ initialEvents }: { initialEvents: ScheduleEvent[] }) {
  const [events, setEvents] = useState<ScheduleEvent[]>(initialEvents);
  const [editingId, setEditingId] = useState<string | null>(null);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-gray-800">Schedule Management</h2>
        </div>
        <button
          onClick={() => setEditingId('new')}
          className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="space-y-4">
        {events.map((event, idx) => (
          <div key={event.id || idx} className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50/50">
            {editingId === event.id ? (
              <EventForm event={event} onCancel={() => setEditingId(null)} />
            ) : (
              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded-full uppercase tracking-widest">{event.is_recurring ? 'Recurring' : 'One-Time'}</span>
                    <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Icon: {event.icon || 'default'}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 mt-2">{event.title}</h4>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" /> 
                      {event.is_recurring ? days[event.day_of_week] : new Date(event.event_date!).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {event.start_time} {event.end_time && `- ${event.end_time}`}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {event.location}</span>
                  </div>
                  {event.is_recurring && event.valid_until && (
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-2 flex items-center gap-1">
                      <Repeat className="w-3 h-3" /> Until {new Date(event.valid_until).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditingId(event.id)} className="p-2 text-gray-400 hover:text-primary transition-colors bg-white rounded-lg border shadow-sm">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <form action={deleteEvent}>
                    <input type="hidden" name="id" value={event.id} />
                    <button type="submit" className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-lg border shadow-sm" onClick={e => { if(!confirm('Delete this event?')) e.preventDefault(); }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ))}

        {editingId === 'new' && (
          <EventForm onCancel={() => setEditingId(null)} />
        )}
        
        {events.length === 0 && editingId !== 'new' && (
          <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-xl border border-dashed">
            No events found. Click "Add Event" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
