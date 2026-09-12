'use client';

// ===================================================================
// QrCodeDisplay — High-Resolution Responsive QR Code Generator
// Generates scannable QR codes locally on client using `qrcode`.
// Works flawlessly on laptop presentation screens and mobile phone displays.
// ===================================================================
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, Download, Share2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface QrCodeDisplayProps {
  value: string;
  codeText?: string;
  size?: number;
  title?: string;
  subtitle?: string;
  shareUrl?: string;
  showActions?: boolean;
  className?: string;
}

export function QrCodeDisplay({
  value,
  codeText,
  size = 220,
  title,
  subtitle,
  shareUrl,
  showActions = true,
  className = '',
}: QrCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const displayCode = codeText || value;

  useEffect(() => {
    let isMounted = true;
    if (!value) return;

    QRCode.toDataURL(value, {
      width: size * 2, // High resolution for crisp retina display
      margin: 1.5,
      color: {
        dark: '#030712', // Obsidian dark modules
        light: '#FFFFFF', // Bright white background for max camera contrast
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        if (isMounted) setDataUrl(url);
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(displayCode);
    setCopiedCode(true);
    toast.success(`Copied code: ${displayCode}`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const link = shareUrl || (typeof window !== 'undefined' ? `${window.location.origin}/events/join?code=${encodeURIComponent(displayCode)}` : value);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    toast.success('Join link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `nexus-${displayCode.toLowerCase().replace(/[^a-z0-9]/g, '-')}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('QR Code saved as image');
  };

  const handleNativeShare = async () => {
    const link = shareUrl || (typeof window !== 'undefined' ? `${window.location.origin}/events/join?code=${encodeURIComponent(displayCode)}` : value);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join Nexus: ${displayCode}`,
          text: `Join me on Nexus with code [${displayCode}] or scan my QR!`,
          url: link,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className={`flex flex-col items-center text-center space-y-4 ${className}`}>
      {/* QR Code Frame with Neon Cyber Glow */}
      <div className="relative p-4 rounded-3xl bg-white shadow-[0_12px_40px_rgba(6,182,212,0.25)] border-4 border-cyan-400/40 transition-transform duration-300 hover:scale-[1.02]">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt={`QR Code for ${displayCode}`}
            width={size}
            height={size}
            className="rounded-2xl block select-none"
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        ) : (
          <div
            style={{ width: `${size}px`, height: `${size}px` }}
            className="flex items-center justify-center rounded-2xl bg-slate-100 animate-pulse text-slate-400 text-xs font-mono"
          >
            Generating QR…
          </div>
        )}

        {/* Pulsing Corner Tech Accents */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl pointer-events-none" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl pointer-events-none" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl pointer-events-none" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400 rounded-br-xl pointer-events-none" />
      </div>

      {/* Code Text Label */}
      <div className="space-y-1">
        {title && <h4 className="text-sm font-bold text-white tracking-tight">{title}</h4>}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-[#030712]/90 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
          <span className="font-mono text-xl sm:text-2xl font-extrabold tracking-[0.25em] text-white">
            {displayCode}
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/[0.06] transition-colors"
            title="Copy Code"
          >
            {copiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        {subtitle && <p className="text-[11px] text-slate-400 max-w-xs">{subtitle}</p>}
      </div>

      {/* Action Buttons: Copy Link, Download, Share */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 w-full max-w-xs">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 min-w-[120px] h-10 px-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 bg-white/[0.06] border border-white/[0.1] hover:bg-cyan-500/15 hover:border-cyan-400/40 hover:text-cyan-300 active:scale-95 transition-all"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-cyan-400" />}
            {copiedLink ? 'Link Copied' : 'Copy Link'}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="h-10 px-3 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white active:scale-95 transition-all"
            title="Download QR image"
          >
            <Download className="h-3.5 w-3.5" />
            Save QR
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className="h-10 px-3 rounded-xl text-xs font-semibold text-cyan-400 flex items-center justify-center gap-1.5 bg-cyan-500/10 border border-cyan-500/25 hover:bg-cyan-500/20 active:scale-95 transition-all"
            title="Share via device menu"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
        </div>
      )}
    </div>
  );
}
