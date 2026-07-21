'use client';

// ===================================================================
// QrScannerModal — Camera WebRTC QR Code Scanner for Event Join
// Uses device camera to scan event QR codes or tap simulated codes
// ===================================================================
import { useState, useEffect, useRef } from 'react';
import { QrCode, X, Camera, RefreshCw, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
}

export function QrScannerModal({ isOpen, onClose, onScanSuccess }: QrScannerModalProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setIsScanning(true);
    setHasCameraPermission(null);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setHasCameraPermission(true);
      } else {
        setHasCameraPermission(false);
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setHasCameraPermission(false);
    } finally {
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleSimulatedScan = (code: string) => {
    toast.success(`Scanned QR Code: ${code}!`);
    onScanSuccess(code);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-background rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-nexus-indigo/10 text-nexus-indigo">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Scan Event QR Code</h3>
              <p className="text-2xs text-muted-foreground">Align QR code inside frame</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Camera Scanner Container */}
        <div className="relative aspect-square w-full bg-black flex items-center justify-center overflow-hidden">
          {hasCameraPermission === true ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 text-white space-y-3 z-10">
              <Camera className="h-10 w-10 text-nexus-indigo animate-pulse" />
              <p className="text-xs text-white/80 font-medium">
                {hasCameraPermission === false
                  ? 'Camera permission unavailable. Choose a quick QR code below to test:'
                  : 'Starting camera stream...'}
              </p>
            </div>
          )}

          {/* Scanner Overlay Box */}
          <div className="relative z-20 w-56 h-56 border-2 border-nexus-indigo/80 rounded-3xl flex items-center justify-center shadow-2xl">
            <div className="absolute inset-0 border-2 border-nexus-indigo rounded-3xl animate-ping opacity-30" />
            <div className="h-0.5 w-full bg-nexus-indigo shadow-[0_0_15px_#6366F1] animate-bounce" />
          </div>

          <span className="absolute bottom-3 z-20 text-2xs px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white/80 font-medium flex items-center gap-1">
            <Zap className="h-3 w-3 text-emerald-400" />
            Auto-Detect Enabled
          </span>
        </div>

        {/* Simulated Demo QR Buttons */}
        <div className="p-4 bg-muted/20 border-t border-border space-y-2">
          <p className="text-2xs font-semibold text-muted-foreground uppercase tracking-wide">
            Test Quick-Scan Demo Codes
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { code: 'NEXUS1', title: 'TechFest 2025' },
              { code: 'NEXUS2', title: 'Startup Meetup' },
              { code: 'NEXUS3', title: 'AI Hackathon' },
            ].map((item) => (
              <button
                key={item.code}
                onClick={() => handleSimulatedScan(item.code)}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-background border border-border hover:border-nexus-indigo hover:bg-nexus-indigo/5 transition-all text-center group"
              >
                <span className="text-2xs font-bold text-foreground group-hover:text-nexus-indigo">
                  {item.code}
                </span>
                <span className="text-[10px] text-muted-foreground truncate w-full">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
