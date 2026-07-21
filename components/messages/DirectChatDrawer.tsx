'use client';

// ===================================================================
// DirectChatDrawer — 1-on-1 In-App Direct Messaging System
// Allows instant chat between matched attendees with quick reply chips
// ===================================================================
import { useState, useRef, useEffect } from 'react';
import { Send, X, Linkedin, Coffee, MapPin, Zap, Check, CheckCheck, Smile } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
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
    headline?: string;
    avatar_url?: string | null;
    linkedin_url?: string;
  } | null;
}

const QUICK_REPLIES = [
  'Let\'s grab a coffee! ☕',
  'Where are you seated in the room? 📍',
  'Great matching profile! 🤝',
  'Are you free to connect now? ⏱️',
];

export function DirectChatDrawer({ isOpen, onClose, recipient }: DirectChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'them',
      text: 'Hey! Saw we matched on AI & Startups on Nexus! 👋',
      timestamp: '2 mins ago',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: textToSend.trim(),
      timestamp: 'Just now',
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulated reply after 1.5s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'them',
          text: `Awesome! I'm near the front stage area. Let's catch up!`,
          timestamp: 'Just now',
        },
      ]);
      toast.success(`Message from ${recipient?.name?.split(' ')[0] || 'Attendee'}`);
    }, 1500);
  };

  if (!isOpen || !recipient) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-background h-full shadow-2xl flex flex-col border-l border-border animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <Avatar src={recipient.avatar_url} alt={recipient.name} size="md" />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-foreground truncate">{recipient.name}</h3>
                <span className="text-2xs px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-semibold shrink-0">
                  Online
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{recipient.headline || 'Event Attendee'}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {recipient.linkedin_url && (
              <a
                href={recipient.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 transition-colors"
                title="View LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
          <div className="text-center py-2">
            <span className="text-2xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium">
              Matched at TechFest 2025 · End-to-End Encrypted
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div
                key={msg.id}
                className={cn('flex flex-col max-w-[80%]', isMe ? 'ml-auto items-end' : 'mr-auto items-start')}
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
        <div className="p-2 bg-background border-t border-border overflow-x-auto">
          <div className="flex gap-1.5">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSendMessage(reply)}
                className="text-2xs px-3 py-1.5 rounded-full bg-muted hover:bg-nexus-indigo/10 hover:text-nexus-indigo border border-border text-muted-foreground font-medium whitespace-nowrap transition-colors"
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
            className="flex-1 rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-nexus-indigo"
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
