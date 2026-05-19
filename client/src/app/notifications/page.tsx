'use client';
import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { Bell, CheckCircle, AlertTriangle, Clock, Trash2 } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'failed' | 'info';
  timestamp: Date;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Socket connection establish kiya backend url ke sath
    const socketInstance = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket Channel via Socket.io Server ⚡');
    });

    // Listener for successful auto post publication from BullMQ Worker
    socketInstance.on('postPublished', (data: { postId: string; caption: string }) => {
      const newNotification: NotificationItem = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Post Published Successfully! 🚀',
        message: `Your scheduled post "${data.caption.substring(0, 40)}..." is now live on social channels.`,
        type: 'success',
        timestamp: new Date(),
        read: false
      };

      setNotifications((prev) => [newNotification, ...prev]);
      toast.success('Live Notification: Post Published! 📢', { duration: 4000 });
    });

    // Listener for structural failures alerts
    socketInstance.on('postFailed', (data: { postId: string; reason: string }) => {
      const newNotification: NotificationItem = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Upload Failed ❌',
        message: `Post upload dropped due to: ${data.reason}`,
        type: 'failed',
        timestamp: new Date(),
        read: false
      };

      setNotifications((prev) => [newNotification, ...prev]);
      toast.error('Alert: Automatic scheduling task failed.');
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    toast.success('All updates marked as read.');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success('Notifications cleared.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Alert Config Panel Wrapper Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0B0F19] border border-gray-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-200">Real-Time Notification Hub</h2>
            <p className="text-xs text-gray-500 mt-0.5">BullMQ background tasks aur automatic queues processing ki live state monitor karein.</p>
          </div>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-gray-950 border border-gray-800 rounded-lg transition-colors"
            >
              Mark all as read
            </button>
            <button
              onClick={clearAllNotifications}
              className="p-1.5 text-gray-500 hover:text-red-400 bg-gray-950 border border-gray-800 hover:border-red-500/20 rounded-lg transition-colors"
              title="Clear Matrix"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Notifications Map Feed Cards Layout */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-[#0B0F19]/40 border border-gray-800/60 rounded-2xl p-16 text-center flex flex-col items-center justify-center min-h-[350px]">
            <div className="p-3.5 bg-gray-900/50 rounded-full text-gray-600 border border-gray-800 mb-3.5">
              <Bell className="h-6 w-6" />
            </div>
            <h3 className="text-gray-300 font-medium text-sm">No new alerts received</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              Jab aapka automatic scheduling worker backend me post status complete karega, toh yahan automatic live feeds render honge.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border rounded-xl p-4 transition-all duration-200 flex gap-4 shadow-sm ${
                notification.read 
                  ? 'bg-[#0B0F19]/60 border-gray-800/80 opacity-70' 
                  : 'bg-[#0B0F19] border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="mt-0.5">
                {notification.type === 'success' && (
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                )}
                {notification.type === 'failed' && (
                  <div className="p-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                )}
                {notification.type === 'info' && (
                  <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg">
                    <Clock className="h-4 w-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-sm font-semibold text-gray-200">{notification.title}</h4>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {notification.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{notification.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}