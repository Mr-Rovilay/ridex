// components/PartnerChat.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle,
  X,
  Send,
  Headphones,
  Clock,
  CheckCheck,
  Phone,
  Mail,
  HelpCircle,
} from "lucide-react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Message {
  _id: string;
  sender: string;
  senderRole: string;
  recipient: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

const PartnerChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  
  const { userData } = useSelector((state: RootState) => state.user);
  const user = userData?.user;

  // Fetch messages
  const fetchMessages = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/partner/chat?userId=${user._id}`);
      setMessages(data.messages);
      
      // Count unread messages (received from admin)
      const unread = data.messages.filter(
        (msg: Message) => msg.senderRole === "admin" && !msg.isRead
      ).length;
      setUnreadCount(unread);
      
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !user?._id) return;

    try {
      const { data } = await axios.post("/api/partner/chat", {
        message: newMessage,
      });
      setMessages([...messages, data.message]);
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Mark messages as read when chat opens
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      const markAsRead = async () => {
        try {
          await axios.put("/api/partner/chat/mark-read");
          setUnreadCount(0);
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      };
      markAsRead();
    }
  }, [isOpen, unreadCount]);

  // Setup WebSocket for real-time messages
  useEffect(() => {
    if (!user?._id) return;

    // Simulate typing indicator (you can implement real WebSocket later)
    const interval = setInterval(() => {
      // Poll for new messages every 5 seconds
      if (isOpen) {
        fetchMessages();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user?._id, isOpen]);

  // Initial fetch
  useEffect(() => {
    if (user?._id) {
      fetchMessages();
    }
  }, [user?._id]);

  const getSupportStatus = () => {
    if (user?.partnerStatus === "approved") {
      return { text: "Priority Support", color: "text-emerald-400", bg: "bg-emerald-400/10" };
    } else if (user?.partnerStatus === "pending") {
      return { text: "Awaiting Review", color: "text-amber-400", bg: "bg-amber-400/10" };
    } else if (user?.partnerStatus === "rejected") {
      return { text: "Support Available", color: "text-blue-400", bg: "bg-blue-400/10" };
    }
    return { text: "General Support", color: "text-gray-400", bg: "bg-gray-400/10" };
  };

  const supportStatus = getSupportStatus();

  return (
    <>
      {/* Chat Button - Only show if needed */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg hover:shadow-xl transition-all group"
        >
          <div className="relative">
            <MessageCircle size={24} className="text-black" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </div>
        </motion.button>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-zinc-900 shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 bg-gradient-to-r from-amber-400/10 to-orange-500/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                      <Headphones size={20} className="text-black" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-white">Support Chat</h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${supportStatus.bg} ${supportStatus.color}`}>
                          {supportStatus.text}
                        </span>
                        <span className="text-xs text-white/40 flex items-center gap-1">
                          <Clock size={10} />
                          Usually responds in &lt; 5 min
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 rounded-full transition"
                  >
                    <X size={20} className="text-white/60" />
                  </button>
                </div>
              </div>

              {/* Support Info Banner */}
              <div className="p-3 bg-white/5 border-b border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-white/40">
                      <Mail size={12} />
                      <span>support@ridex.com</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/40">
                      <Phone size={12} />
                      <span>1-800-RIDEX</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span>Online</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? (
                  <div className="text-center text-white/40 py-8">
                    <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                      <HelpCircle size={32} className="text-white/20" />
                    </div>
                    <h3 className="text-white font-medium mb-1">No messages yet</h3>
                    <p className="text-white/40 text-sm">
                      Send a message to start the conversation
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${msg.senderRole === "partner" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-xl ${
                            msg.senderRole === "partner"
                              ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black"
                              : "bg-white/10 text-white"
                          }`}
                        >
                          {msg.senderRole === "admin" && (
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-[10px] font-medium text-amber-400">Support</span>
                            </div>
                          )}
                          <p className="text-sm break-words">{msg.message}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-[10px] opacity-70">
                              {formatDistanceToNow(new Date(msg.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                            {msg.senderRole === "partner" && msg.isRead && (
                              <CheckCheck size={12} className="opacity-70" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {typing && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 p-3 rounded-xl">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-400/50"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg disabled:opacity-50 transition cursor-pointer"
                  >
                    <Send size={18} className="text-black" />
                  </button>
                </div>
                <p className="text-[10px] text-white/30 mt-2 text-center">
                  Our support team is available 24/7 to assist you
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PartnerChat;