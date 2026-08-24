import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, Check } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  title: string;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setCapturedPreview(null);
      navigator.mediaDevices
        ?.getUserMedia({ video: { width: { ideal: 1080 }, height: { ideal: 1080 } } })
        .then((s) => {
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          setError('Camera permission was denied or device is not available: ' + err.message);
        });
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const handleSnap = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPreview(dataUrl);
    }
  };

  const handleConfirm = () => {
    if (capturedPreview) {
      onCapture(capturedPreview);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedPreview(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-800 backdrop-blur-lg">
        <div className="bg-slate-950/90 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-md cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col items-center">
          {error ? (
            <div className="p-4 bg-red-500/10 text-red-400 text-xs rounded-xl border border-red-500/20 w-full text-center font-mono">
              {error}
            </div>
          ) : capturedPreview ? (
            <div className="w-full aspect-square max-w-xs rounded-xl overflow-hidden border border-slate-700 relative shadow-inner">
              <img src={capturedPreview} alt="Captured preview" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full aspect-square max-w-xs rounded-xl overflow-hidden bg-slate-950 border border-slate-700 relative shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-white/20 pointer-events-none rounded-xl flex items-center justify-center">
                <div className="w-48 h-60 border border-dashed border-white/40 rounded-full" />
              </div>
            </div>
          )}

          <p className="text-[11px] text-slate-400 mt-3 text-center">
            Position head within the frame. Ensure even lighting and neutral background.
          </p>

          <div className="mt-5 flex items-center gap-3 w-full justify-center">
            {capturedPreview ? (
              <>
                <button
                  onClick={handleRetake}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retake
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-900/30"
                >
                  <Check className="w-3.5 h-3.5" />
                  Use Photo
                </button>
              </>
            ) : (
              <button
                onClick={handleSnap}
                disabled={Boolean(error)}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 cursor-pointer shadow-md shadow-blue-900/30 disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                Capture Snapshot
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
