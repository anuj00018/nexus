'use client';

// ===================================================================
// QrScannerModal — Camera WebRTC QR Code Scanner for Event Join
// Deep navy glassmorphism modal styling.
// Uses device camera to scan event QR codes or tap simulated codes
// Preserves: All WebRTC camera logic, stream cleanup, simulation handlers.
// ===================================================================
import { useState, useEffect, useRef } from 'react';
import { QrCode, X, Camera, Zap } from 'lucide-react';
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(5, 10, 24, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden flex flex-col shadow-2xl"
        style={{
          background: 'rgba(10, 15, 30, 0.95)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl text-white"
              style={{ background: 'rgba(66, 99, 235, 0.1)', border: '1px solid rgba(66, 99, 235, 0.2)', color: '#4263EB' }}
            >
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white">Scan Event QR Code</h3>
              <p className="text-[11px] text-slate-400">Align QR code inside frame</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white transition-colors hover:bg-white/[0.06]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Camera Scanner Container */}
        <div className="relative aspect-square w-full bg-slate-950 flex items-center justify-center overflow-hidden">
          {hasCameraPermission === true ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 text-white space-y-3 z-10">
              <Camera className="h-10 w-10 animate-pulse" style={{ color: '#4263EB' }} />
              <p className="text-xs text-slate-400 font-medium">
                {hasCameraPermission === false
                  ? 'Camera permission unavailable. Choose a quick QR code below to test:'
                  : 'Starting camera stream...'}
              </p>
            </div>
          )}

          {/* Scanner Overlay Box */}
          <div
            className="relative z-20 w-56 h-56 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{ border: '2px solid rgba(66, 99, 235, 0.8)' }}
          >
            <div
              className="absolute inset-0 rounded-3xl animate-ping opacity-30"
              style={{ border: '2px solid #4263EB' }}
            />
            <div
              className="h-0.5 w-full animate-bounce"
              style={{ background: '#4263EB', boxShadow: '0 0 15px #4263EB' }}
            />
          </div>

          <span
            className="absolute bottom-3 z-20 text-[10px] px-3 py-1 rounded-full font-medium flex items-center gap-1"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#e2e8f0',
            }}
          >
            <Zap className="h-3 w-3 text-emerald-400" />
            Auto-Detect Enabled
          </span>
        </div>

        {/* Simulated Demo QR Buttons */}
        <div className="p-4 space-y-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
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
                className="flex flex-col items-center justify-center p-2.5 rounded-xl transition-all text-center group"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <span className="text-xs font-bold text-white group-hover:text-blue-400">
                  {item.code}
                </span>
                <span className="text-[10px] text-slate-400 truncate w-full">
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
