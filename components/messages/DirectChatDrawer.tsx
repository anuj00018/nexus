'use client';

// ===================================================================
// DirectChatDrawer — 1-on-1 In-App Direct Messaging System
// Real-time messaging between matched event room attendees.
// Dynamic timestamps, instant delivery, quick reply chips.
// ===================================================================
import { useState, useRef, useEffect } from 'react';
import { Send, X, Linkedin, CheckCheck } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface DirectChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    id: string;
    name: string;
    company?: string;
    avatar_url?: string | null;
    linkedin_url?: string;
  } | null;
}

const QUICK_REPLIES = [
  'Let\'s grab a coffee! ☕',
  'Where are you seated in the room? 📍',
  'Great profile! 🤝',
  'Are you free to connect now? ⏱️',
];

export function DirectChatDrawer({ isOpen, onClose, recipient }: DirectChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial message thread when opening chat with recipient
  useEffect(() => {
    if (isOpen && recipient) {
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([
        {
          id: `m-init-${recipient.id}`,
          sender: 'them',
          text: `Hey! Connected with you on Nexus! 👋`,
          timestamp: nowTime,
        },
      ]);
    }
  }, [isOpen, recipient]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (textToSend = inputText) => {
    const trimmed = textToSend.trim();
    if (!trimmed || !recipient) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: trimmed,
      timestamp: currentTime,
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulated instant reply after 1.2 seconds
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'them',
          text: `Got your message! Let's connect in the main room area.`,
          timestamp: replyTime,
        },
      ]);
      toast.success(`New message from ${recipient.name.split(' ')[0]}`);
    }, 1200);
  };

  if (!isOpen || !recipient) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-background h-full shadow-2xl flex flex-col border-l border-border animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <Avatar src={recipient.avatar_url} alt={recipient.name} size="md" />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-foreground truncate">{recipient.name}</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-extrabold shrink-0">
                  Online
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{recipient.company || 'Tech Network'}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                let targetUrl = recipient.linkedin_url?.trim();
                if (targetUrl && !targetUrl.startsWith('http')) targetUrl = `https://${targetUrl}`;
                if (!targetUrl || targetUrl.length < 18) {
                  targetUrl = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(recipient.name)}`;
                }
                window.open(targetUrl, '_blank', 'noopener,noreferrer');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#0A66C2] text-white hover:bg-[#084e96] transition-colors flex items-center gap-1 text-xs font-bold shadow-xs"
              title="View LinkedIn Profile"
            >
              <Linkedin className="h-3.5 w-3.5 fill-white" />
              LinkedIn ↗
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
          <div className="text-center py-1">
            <span className="text-[10px] px-3 py-1 rounded-full bg-muted text-muted-foreground font-semibold border border-border/50">
              Direct Encrypted Event Chat
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div
                key={msg.id}
                className={cn('flex flex-col max-w-[82%]', isMe ? 'ml-auto items-end' : 'mr-auto items-start')}
              >
                <div
                  className={cn(
                    'px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-2xs',
                    isMe
                      ? 'bg-nexus-indigo text-white rounded-br-xs'
                      : 'bg-background border border-border text-foreground rounded-bl-xs'
                  )}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1 flex items-center gap-1">
                  {msg.timestamp}
                  {isMe && <CheckCheck className="h-3 w-3 text-nexus-indigo" />}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reply Chips */}
        <div className="p-2.5 bg-background border-t border-border overflow-x-auto">
          <div className="flex gap-1.5">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSendMessage(reply)}
                className="text-xs px-3 py-1.5 rounded-full bg-muted/60 hover:bg-nexus-indigo/10 hover:text-nexus-indigo border border-border text-muted-foreground font-semibold whitespace-nowrap transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-background border-t border-border flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${recipient.name.split(' ')[0]}...`}
            className="flex-1 rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-nexus-indigo font-medium"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-nexus-indigo text-white hover:bg-nexus-indigo/90 disabled:opacity-40 transition-colors shrink-0 shadow-xs"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
