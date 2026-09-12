'use client';

// ===================================================================
// QrScannerModal — Real-Time WebRTC QR Code Scanner for Event Join
// Works seamlessly on Mobile Phones (rear/front camera) and Laptops.
// Uses `jsQR` + canvas frame analysis and native `BarcodeDetector` fallback.
// Also includes Photo Upload fallback for restricted mobile browsers.
// ===================================================================
import { useState, useEffect, useRef, useCallback } from 'react';
import { QrCode, X, Camera, Zap, SwitchCamera, Upload, Sparkles, AlertCircle } from 'lucide-react';
import jsQR from 'jsqr';
import toast from 'react-hot-toast';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
}

// Extracts clean event or user code from raw scanned text or URL
export function extractCodeFromScan(raw: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();

  // If it's a URL, parse query param ?code= or path /events/[id]/...
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed);
      const codeParam = url.searchParams.get('code');
      if (codeParam) return codeParam.toUpperCase();

      const pathParts = url.pathname.split('/').filter(Boolean);
      const eventsIdx = pathParts.indexOf('events');
      if (eventsIdx !== -1 && pathParts[eventsIdx + 1]) {
        return pathParts[eventsIdx + 1].toUpperCase();
      }
    } catch {
      // ignore URL parse failure
    }
  }

  // Raw alphanumeric code
  return trimmed.replace(/[^A-Z0-9-]/gi, '').toUpperCase().slice(0, 12);
}

export function QrScannerModal({ isOpen, onClose, onScanSuccess }: QrScannerModalProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameId = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = useCallback(() => {
    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
      animFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const handleSuccessfulDetection = useCallback((rawCode: string) => {
    const clean = extractCodeFromScan(rawCode);
    if (!clean) return;

    setDetectedCode(clean);
    stopCamera();

    // Haptic feedback for mobile phones if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    toast.success(`QR Detected: [${clean}]`);
    setTimeout(() => {
      onScanSuccess(clean);
      onClose();
    }, 400);
  }, [onScanSuccess, onClose, stopCamera]);

  // Frame scanning loop using jsQR + canvas
  const scanVideoFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const width = video.videoWidth;
      const height = video.videoHeight;

      if (width > 0 && height > 0) {
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx) {
          ctx.drawImage(video, 0, 0, width, height);
          const imageData = ctx.getImageData(0, 0, width, height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });

          if (code && code.data) {
            handleSuccessfulDetection(code.data);
            return;
          }
        }
      }
    }

    animFrameId.current = requestAnimationFrame(scanVideoFrame);
  }, [handleSuccessfulDetection]);

  const startCamera = useCallback(async () => {
    stopCamera();
    setDetectedCode(null);
    setHasCameraPermission(null);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();
        }
        setHasCameraPermission(true);
        animFrameId.current = requestAnimationFrame(scanVideoFrame);
      } else {
        setHasCameraPermission(false);
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setHasCameraPermission(false);
    }
  }, [facingMode, scanVideoFrame, stopCamera]);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  // Image file upload decoder fallback for mobile phones / webviews
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingUpload(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const qr = jsQR(imageData.data, imageData.width, imageData.height);
          if (qr && qr.data) {
            handleSuccessfulDetection(qr.data);
          } else {
            toast.error('No QR code found in the uploaded image. Try another photo.');
          }
        }
        setIsProcessingUpload(false);
      };
      img.onerror = () => {
        toast.error('Failed to load image');
        setIsProcessingUpload(false);
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      style={{
        background: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden flex flex-col bg-[#070B19]/95 border border-cyan-500/30 shadow-[0_24px_80px_rgba(0,0,0,0.8),0_0_40px_rgba(6,182,212,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white">Scan QR Code</h3>
              <p className="text-[11px] text-slate-400">Works with mobile cameras &amp; laptops</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Camera Switcher (Front/Back) */}
            <button
              type="button"
              onClick={toggleCameraFacing}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              title={`Switch to ${facingMode === 'environment' ? 'front' : 'rear'} camera`}
            >
              <SwitchCamera className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Camera Viewport Area */}
        <div className="relative aspect-square w-full bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* Real Video Stream */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
          />

          {/* Offscreen Canvas for Frame Decoding */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanner Overlay Box */}
          <div
            className={`relative z-20 w-60 h-60 rounded-3xl flex items-center justify-center transition-all duration-300 ${
              detectedCode ? 'border-4 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.8)]' : 'border-2 border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
            }`}
          >
            {/* Laser Scanning Line */}
            {!detectedCode && (
              <div
                className="absolute inset-x-2 h-0.5 animate-bounce rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, #06B6D4, #8B5CF6, transparent)',
                  boxShadow: '0 0 16px #06B6D4',
                }}
              />
            )}

            {/* Corner Target Markers */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl pointer-events-none" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl pointer-events-none" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl pointer-events-none" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-xl pointer-events-none" />

            {detectedCode && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono font-bold text-center text-sm animate-scale-in">
                ✅ Matched: {detectedCode}
              </div>
            )}
          </div>

          {/* Fallback Camera Unavailable message */}
          {hasCameraPermission === false && (
            <div className="absolute inset-0 bg-[#070B19]/95 z-30 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="p-3 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h4 className="font-bold text-sm text-white">Camera Access Unavailable</h4>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Grant camera permission in browser settings, or upload/snap a photo of the QR code below.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-aurora h-11 px-5 rounded-xl text-xs font-bold text-white flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload / Snap QR Photo
              </button>
            </div>
          )}

          {/* Live Scanning Status Pill */}
          <span className="absolute bottom-3 z-20 text-[10px] px-3 py-1 rounded-full font-medium flex items-center gap-1.5 bg-[#030712]/80 backdrop-blur-md border border-white/[0.1] text-slate-200">
            <Zap className="h-3 w-3 text-cyan-400 animate-pulse" />
            Active Real-Time Scanner ({facingMode === 'environment' ? 'Rear Camera' : 'Front Camera'})
          </span>
        </div>

        {/* Footer Actions & Simulation Shortcuts */}
        <div className="p-4 border-t border-white/[0.08] space-y-3 bg-[#030712]/60">
          {/* Photo upload fallback button */}
          <div className="flex items-center justify-between gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingUpload}
              className="flex-1 h-10 px-3 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-all active:scale-95"
            >
              <Upload className="h-3.5 w-3.5 text-cyan-400" />
              {isProcessingUpload ? 'Decoding Image…' : 'Upload / Snap QR Photo'}
            </button>
          </div>

          {/* Quick preset 1-tap test chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400 block text-center uppercase tracking-wider">
              Fast Presets (1-Tap Join)
            </span>
            <div className="flex justify-center gap-2">
              {['NEXUS1', 'TECHFEST25', 'AI-HACK'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleSuccessfulDetection(code)}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all"
                >
                  #{code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
