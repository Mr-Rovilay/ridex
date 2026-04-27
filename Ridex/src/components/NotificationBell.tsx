// components/NotificationBell.tsx
"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, CheckCircle, XCircle, Clock, Truck, Video, X } from "lucide-react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get("/api/admin/notifications?limit=20");
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.put("/api/admin/notifications", { notificationId });
      setNotifications(prev =>
        prev.map(n => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    for (const notification of unreadNotifications) {
      await markAsRead(notification._id);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    
    const initializeNotifications = async () => {
      try {
        const { data } = await axios.get("/api/admin/notifications?limit=20", {
          signal: abortController.signal,
        });
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (error) {
        if (error instanceof Error && error.message !== "canceled") {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    initializeNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Fetch every 30 seconds
    return () => {
      clearInterval(interval);
      abortController.abort();
    };
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "partner_approved":
        return <CheckCircle size={16} className="text-emerald-400" />;
      case "partner_rejected":
        return <XCircle size={16} className="text-red-400" />;
      case "kyc_approved":
        return <Video size={16} className="text-blue-400" />;
      case "vehicle_approved":
        return <Truck size={16} className="text-purple-400" />;
      default:
        return <Clock size={16} className="text-amber-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer p-2 hover:bg-white/10 rounded-full transition"
      >
        <Bell size={18} className="text-white/60" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 md:w-96 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-semibold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-amber-400 hover:text-amber-300 transition"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-white/40">
                    <Bell size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => markAsRead(notification._id)}
                      className={`p-4 border-b border-white/5 hover:bg-white/5 transition cursor-pointer ${
                        !notification.isRead ? "bg-amber-400/5" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">
                            {notification.title}
                          </p>
                          <p className="text-xs text-white/50 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-white/30 mt-2">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-amber-400 rounded-full mt-2" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;