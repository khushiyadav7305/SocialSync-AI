'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'react-hot-toast';
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { Post } from '../../models/types';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: Post;
}

export default function ContentCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCalendarPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        // Map backend posts items to Big Calendar standard object types
        const formattedEvents = response.data.map((post: Post) => {
          const startTime = new Date(post.scheduledTime);
          // Ending block sets an hour duration window allocation mockup
          const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); 

          return {
            title: post.caption || 'Untitled Post',
            start: startTime,
            end: endTime,
            resource: post
          };
        });
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error('Calendar Fetch Error:', error);
      toast.error('Failed to load scheduling calendar entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarPosts();
  }, []);

  // Event component styling overriding layout behaviors
  const eventStyleGetter = (event: CalendarEvent) => {
    const isPublished = event.resource?.status === 'published';
    const backgroundColor = isPublished ? '#065f46' : '#4f46e5';
    const borderColor = isPublished ? '#059669' : '#6366f1';
    
    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: `1px solid ${borderColor}`,
        display: 'block',
        fontSize: '12px',
        padding: '2px 6px'
      }
    };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-[#0B0F19] border border-gray-800 p-4 rounded-xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg border border-indigo-500/20">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-200">Visual Content Planning Schedule</h2>
            <p className="text-xs text-gray-500 mt-0.5">Track, review, and navigate your monthly queue distributions seamlessly.</p>
          </div>
        </div>
        <button 
          onClick={fetchCalendarPosts}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-white bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Big Calendar UI Grid Panel wrapper */}
      <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 shadow-xl min-h-[600px] text-gray-300">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
            <div className="h-6 w-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-xs text-gray-500">Syncing Editorial Calendar Matrix...</span>
          </div>
        ) : (
          <div className="h-[550px] custom-calendar-wrapper">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              eventPropGetter={eventStyleGetter}
              views={['month', 'week', 'day']}
            />
          </div>
        )}
      </div>

      {/* Global CSS injection hacks directly customizing calendar subelements borders and background grids */}
      <style jsx global>{`
        .rbc-calendar { font-family: inherit; }
        .rbc-header { padding: 8px !important; font-size: 13px !important; font-weight: 600 !important; border-bottom: 1px solid #1f2937 !important; color: #9ca3af; }
        .rbc-month-view, .rbc-time-view { background: #030712 !important; border: 1px solid #1f2937 !important; border-radius: 12px !important; overflow: hidden; }
        .rbc-day-bg { border-right: 1px solid #1f2937 !important; }
        .rbc-month-row { border-bottom: 1px solid #1f2937 !important; }
        .rbc-off-range-bg { background: #0b0f19/20 !important; opacity: 0.3; }
        .rbc-today { background: #1f2937/40 !important; }
        .rbc-toolbar button { color: #d1d5db !important; border: 1px solid #1f2937 !important; background: #0B0F19 !important; font-size: 13px !important; padding: 6px 12px !important; border-radius: 6px !important; margin-right: 2px; transition: all 0.2s; }
        .rbc-toolbar button:hover { background: #1f2937 !important; color: white !important; border-color: #374151 !important; }
        .rbc-toolbar button.rbc-active { background: #4f46e5 !important; color: white !important; border-color: #6366f1 !important; }
        .rbc-toolbar-label { font-size: 15px !important; font-weight: 600 !important; color: #f3f4f6 !important; }
      `}</style>
    </div>
  );
}