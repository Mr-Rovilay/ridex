// components/ChatPanel.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle,
  X,
  Send,
  Users,
  Search,
  CheckCheck,
  Clock,
  User,
  Mail,
  Phone,
} from "lucide-react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

interface Partner {
  _id: string;
  name: string;
  email: string;
  mobileNumber?: string;
  partnerStatus: string;
  videoKycStatus: string;
}

interface Message {
  _id: string;
  sender: string;
  senderRole: string;
  recipient: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  partner: Partner;
  lastMessage: Message | null;
  unreadCount: number;
}

const ChatPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const { data } = await axios.get("/api/admin/chat");
      setConversations(data.conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  // Fetch messages with specific partner
  const fetchMessages = async (partnerId: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/admin/chat?userId=${partnerId}`);
      setMessages(data.messages);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedPartner) return;

    try {
      const { data } = await axios.post("/api/admin/chat", {
        recipientId: selectedPartner._id,
        message: newMessage,
      });
      setMessages([...messages, data.message]);
      setNewMessage("");
      scrollToBottom();
      
      // Update last message in conversation list
      fetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/20 text-emerald-400";
      case "pending":
        return "bg-amber-500/20 text-amber-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.partner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedPartner) {
      fetchMessages(selectedPartner._id);
    }
  }, [selectedPartner]);

  // Auto-refresh messages every 5 seconds when chat is open
  useEffect(() => {
    if (!isOpen || !selectedPartner) return;
    
    const interval = setInterval(() => {
      fetchMessages(selectedPartner._id);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isOpen, selectedPartner]);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg hover:shadow-xl transition-all group"
      >
        <MessageCircle size={24} className="text-black" />
      </button>

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
                  <div className="flex items-center gap-2">
                    <Users size={20} className="text-amber-400" />
                    <h2 className="font-semibold text-white">Partner Support Chat</h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 rounded-full transition"
                  >
                    <X size={20} className="text-white/60" />
                  </button>
                </div>
                <p className="text-xs text-white/40 mt-1">
                  Chat with partners and resolve their queries
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                {!selectedPartner ? (
                  // Conversations List
                  <div className="h-full flex flex-col">
                    {/* Search Bar */}
                    <div className="p-4 border-b border-white/10">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          type="text"
                          placeholder="Search partners by name or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-400/50"
                        />
                      </div>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto">
                      {filteredConversations.length === 0 ? (
                        <div className="p-8 text-center text-white/40">
                          <Users size={32} className="mx-auto mb-2 opacity-40" />
                          <p className="text-sm">No conversations yet</p>
                          <p className="text-xs mt-1">Messages from partners will appear here</p>
                        </div>
                      ) : (
                        filteredConversations.map((conv) => (
                          <div
                            key={conv.partner._id}
                            onClick={() => setSelectedPartner(conv.partner)}
                            className="p-4 border-b border-white/5 hover:bg-white/5 transition cursor-pointer"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                                  <User size={14} className="text-black" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-white">{conv.partner.name}</h3>
                                  <p className="text-xs text-white/40">{conv.partner.email}</p>
                                </div>
                              </div>
                              {conv.unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-amber-500 rounded-full text-xs text-white">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(conv.partner.partnerStatus)}`}>
                                {conv.partner.partnerStatus}
                              </span>
                              {conv.lastMessage && (
                                <p className="text-xs text-white/30">
                                  {formatDistanceToNow(new Date(conv.lastMessage.createdAt), {
                                    addSuffix: true,
                                  })}
                                </p>
                              )}
                            </div>
                            {conv.lastMessage && (
                              <p className="text-sm text-white/60 mt-2 truncate">
                                {conv.lastMessage.senderRole === "admin" ? "You: " : "Partner: "}
                                {conv.lastMessage.message}
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  // Chat Messages View
                  <div className="h-full flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-white/10 bg-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                            <User size={18} className="text-black" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{selectedPartner.name}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(selectedPartner.partnerStatus)}`}>
                                {selectedPartner.partnerStatus}
                              </span>
                              {selectedPartner.mobileNumber && (
                                <span className="text-xs text-white/40 flex items-center gap-1">
                                  <Phone size={10} />
                                  {selectedPartner.mobileNumber}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedPartner(null)}
                          className="text-xs text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
                        >
                          Back to list
                        </button>
                      </div>
                    </div>

                    {/* Messages - Fixed alignment: Admin (sender) on RIGHT, Partner on LEFT */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {loading ? (
                        <div className="text-center text-white/40 py-8">
                          <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-sm">Loading messages...</p>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                            <MessageCircle size={32} className="text-white/20" />
                          </div>
                          <h3 className="text-white font-medium mb-1">No messages yet</h3>
                          <p className="text-white/40 text-sm">
                            Send a message to start the conversation
                          </p>
                        </div>
                      ) : (
                        messages.map((msg) => (
                          <div
                            key={msg._id}
                            className={`flex ${msg.senderRole === "admin" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-xl ${
                                msg.senderRole === "admin"
                                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black"
                                  : "bg-white/10 text-white"
                              }`}
                            >
                              {/* Sender label */}
                              <div className="flex items-center gap-1 mb-1">
                                <span className="text-[10px] font-medium opacity-70">
                                  {msg.senderRole === "admin" ? "You (Admin)" : selectedPartner.name.split(" ")[0]}
                                </span>
                              </div>
                              <p className="text-sm break-words">{msg.message}</p>
                              <div className="flex items-center justify-end gap-1 mt-1">
                                <span className="text-[10px] opacity-70">
                                  {formatDistanceToNow(new Date(msg.createdAt), {
                                    addSuffix: true,
                                  })}
                                </span>
                                {msg.senderRole === "admin" && msg.isRead && (
                                  <CheckCheck size={12} className="opacity-70" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                          placeholder={`Message ${selectedPartner.name.split(" ")[0]}...`}
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
                        Messages are secured and monitored for quality assurance
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatPanel;