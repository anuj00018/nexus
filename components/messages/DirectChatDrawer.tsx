'use client';

// ===================================================================
// DirectChatDrawer — 1-on-1 In-App Direct Messaging System
// Deep navy glass panel with electric blue chat bubbles.
// Dynamic timestamps, instant delivery, quick reply chips.
// Preserves: All message state, auto-reply, LinkedIn link logic.
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
    <div
      className="fixed inset-0 z-50 flex justify-end animate-fade-in"
      style={{ background: 'rgba(5, 10, 24, 0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <div
        className="w-full max-w-md h-full flex flex-col animate-slide-in-right shadow-2xl"
        style={{
          background: 'rgba(8, 12, 24, 0.95)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <Avatar src={recipient.avatar_url} alt={recipient.name} size="md" />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500" style={{ border: '2px solid #080C18' }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white truncate">{recipient.name}</h3>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold shrink-0"
                  style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}
                >
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{recipient.company || 'Tech Network'}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={(() => {
                let url = recipient.linkedin_url?.trim() || '';
                if (url && !url.startsWith('http')) url = `https://${url}`;
                if (url && /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/i.test(url)) return url;
                return `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(recipient.name)}`;
              })()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-xl text-white flex items-center gap-1 text-xs font-bold shadow-md no-underline"
              style={{ background: '#0A66C2' }}
              title="View LinkedIn Profile"
            >
              <Linkedin className="h-3.5 w-3.5 fill-white" />
              LinkedIn ↗
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors hover:bg-white/[0.06]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-center py-1">
            <span
              className="text-[10px] px-3 py-1 rounded-full font-medium"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: '#64748b',
              }}
            >
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
                    'px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-md',
                    isMe
                      ? 'text-white rounded-br-xs'
                      : 'text-slate-200 rounded-bl-xs'
                  )}
                  style={isMe ? {
                    background: 'linear-gradient(135deg, #4263EB, #3451D1)',
                  } : {
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1 flex items-center gap-1">
                  {msg.timestamp}
                  {isMe && <CheckCheck className="h-3 w-3 text-blue-400" />}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reply Chips */}
        <div className="p-2.5 overflow-x-auto scrollbar-none" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div className="flex gap-1.5">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSendMessage(reply)}
                className="text-xs px-3 py-1.5 rounded-full text-slate-400 font-medium whitespace-nowrap transition-colors hover:text-white"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
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
          className="p-3 flex items-center gap-2"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${recipient.name.split(' ')[0]}...`}
            className="flex-1 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 font-medium focus:outline-none transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(66, 99, 235, 0.4)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl text-white disabled:opacity-40 transition-all shrink-0 shadow-md active:scale-95"
            style={{ background: 'linear-gradient(135deg, #4263EB, #3451D1)' }}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
