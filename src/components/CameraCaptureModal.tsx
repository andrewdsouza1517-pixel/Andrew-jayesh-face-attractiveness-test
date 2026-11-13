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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171311]/70 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-[#1E1815] rounded-xl max-w-lg w-full overflow-hidden shadow-xl dark:shadow-2xl border border-[#E8E2D8] dark:border-[#3D332C] transition-colors">
        <div className="bg-[#FAF7F2] dark:bg-[#221C18] text-[#211813] dark:text-[#F5EFEB] px-5 py-4 flex items-center justify-between border-b border-[#E8E2D8] dark:border-[#3D332C]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white dark:bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C] text-[#8C5E3C] dark:text-[#C99765] rounded-md">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="font-editorial font-medium text-sm">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#8C7D70] hover:text-[#211813] dark:hover:text-[#F5EFEB] rounded-md cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col items-center font-sans">
          {error ? (
            <div className="p-4 bg-red-500/10 text-red-700 dark:text-red-400 text-xs rounded-lg border border-red-500/20 w-full text-center font-mono">
              {error}
            </div>
          ) : capturedPreview ? (
            <div className="w-full aspect-square max-w-xs rounded-lg overflow-hidden border border-[#E8E2D8] dark:border-[#3D332C] relative shadow-inner">
              <img src={capturedPreview} alt="Captured preview" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full aspect-square max-w-xs rounded-lg overflow-hidden bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C] relative shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border border-white/20 pointer-events-none rounded-lg flex items-center justify-center">
                <div className="w-48 h-60 border border-dashed border-white/40 rounded-full" />
              </div>
            </div>
          )}

          <p className="text-[11px] text-[#8C7D70] dark:text-[#A69688] mt-3 text-center">
            Position head within the frame. Ensure balanced lighting and neutral background.
          </p>

          <div className="mt-5 flex items-center gap-3 w-full justify-center">
            {capturedPreview ? (
              <>
                <button
                  onClick={handleRetake}
                  className="px-4 py-2 rounded-lg text-xs font-medium border border-[#E8E2D8] dark:border-[#3D332C] bg-[#FAF7F2] hover:bg-[#EAE4DC] dark:bg-[#2B231F] dark:hover:bg-[#382F2A] text-[#5C4E43] dark:text-[#D4C7BC] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retake
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#211813] hover:bg-[#3D2C21] dark:bg-[#C99765] dark:hover:bg-[#DDB082] text-[#FAF7F2] dark:text-[#171311] flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  Use Photo
                </button>
              </>
            ) : (
              <button
                onClick={handleSnap}
                disabled={Boolean(error)}
                className="px-6 py-2.5 rounded-lg text-xs font-semibold bg-[#211813] hover:bg-[#3D2C21] dark:bg-[#C99765] dark:hover:bg-[#DDB082] text-[#FAF7F2] dark:text-[#171311] flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
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
