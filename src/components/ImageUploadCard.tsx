import React, { useRef, useState, useEffect } from 'react';
import { Upload, Camera, Trash2, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import type { ImageInputItem } from '../types/experiment';
import { fileToDataUrl } from '../utils/imageUtils';
import { CameraCaptureModal } from './CameraCaptureModal';

interface ImageUploadCardProps {
  label: string;
  badge: 'Person A' | 'Person B';
  image: ImageInputItem | null;
  onImageChange: (image: ImageInputItem | null) => void;
  accentColor?: 'indigo' | 'emerald';
  disabled?: boolean;
}

export const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  label,
  badge,
  image,
  onImageChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [personName, setPersonName] = useState<string>('');

  useEffect(() => {
    if (image && image.personName) {
      setPersonName(image.personName);
    } else if (!image && !personName) {
      // Intentionally leave empty
    }
  }, [image]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPersonName(val);
    if (image) {
      onImageChange({ ...image, personName: val.trim() });
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    try {
      setErrorMsg(null);
      const dataUrl = await fileToDataUrl(file, 1200);
      onImageChange({
        id: 'img_' + Math.random().toString(36).substring(2, 8),
        name: file.name,
        personName: personName.trim() || badge,
        dataUrl,
        mimeType: file.type,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing image.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleCameraCapture = (dataUrl: string) => {
    onImageChange({
      id: 'cam_' + Math.random().toString(36).substring(2, 8),
      name: `${badge}_Camera_Capture.jpg`,
      personName: personName.trim() || badge,
      dataUrl,
      mimeType: 'image/jpeg',
    });
  };

  const isA = badge === 'Person A';
  const badgeStyle = isA
    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  const subjectTitle = isA ? 'Subject Alpha' : 'Subject Bravo';

  return (
    <div className="space-y-4">
      <div
        id={`upload-card-${badge.toLowerCase().replace(' ', '-')}`}
        className={`bg-slate-900/80 rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col backdrop-blur-sm ${
          image
            ? 'border-slate-700 shadow-lg shadow-black/30'
            : isDragging
            ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-950/20'
            : 'border-slate-800 hover:border-slate-700'
        }`}
      >
      {/* Top Header Bar */}
      <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${badgeStyle}`}>
            {badge}
          </span>
          <span className="text-xs font-medium text-slate-300">{label}</span>
        </div>
        {image && (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>LOADED</span>
          </div>
        )}
      </div>

      {/* Main Upload / Preview Area */}
      <div className="p-5 flex-1 flex flex-col justify-center">
        {image ? (
          <div className="relative group rounded-xl overflow-hidden bg-slate-950 aspect-4/3 flex items-center justify-center border border-slate-700/60 shadow-inner">
            <img
              src={image.dataUrl}
              alt={label}
              className="w-full h-full object-cover"
            />
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-500 transition cursor-pointer shadow-lg shadow-blue-900/30"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={() => onImageChange(null)}
                disabled={disabled}
                className="p-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition cursor-pointer shadow-md"
                title="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md rounded-lg text-xs text-slate-300 border border-slate-700/60 truncate flex items-center justify-between font-mono">
              <span className="truncate">{image.name}</span>
              <span className="text-[10px] text-slate-500 shrink-0 ml-2">18+ CONSENT</span>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[240px] transition-all relative overflow-hidden group ${
              isDragging
                ? 'border-blue-500 bg-blue-950/30'
                : 'border-slate-700 hover:border-slate-600 bg-slate-900/40 hover:bg-slate-800/30'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>

            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors shadow-inner border border-slate-700/60">
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
            </div>

            <p className="text-sm font-medium text-slate-200">
              {subjectTitle}
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
              Drop portrait image or click to upload
            </p>

            {/* Selection Buttons */}
            <div className="flex items-center gap-2.5 mt-5 z-10">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer shadow-md shadow-blue-900/30 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Browse File</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                disabled={disabled}
                className="px-3.5 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-slate-400" />
                <span>Webcam</span>
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mt-3 p-3 bg-red-500/10 text-red-400 rounded-xl text-xs flex items-center gap-2 border border-red-500/20 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        title={`Capture Portrait for ${badge}`}
      />
      </div>

      {/* Name Input Field */}
      <div className="flex flex-col space-y-1.5 px-1">
        <label htmlFor={`name-${badge}`} className="text-[11px] uppercase font-mono font-bold text-slate-400 flex items-center gap-2">
          Name <span className="text-[9px] text-slate-500 font-normal">(Optional)</span>
        </label>
        <input
          id={`name-${badge}`}
          type="text"
          maxLength={30}
          value={personName}
          onChange={handleNameChange}
          placeholder={`Enter name for ${badge}`}
          disabled={disabled}
          className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 transition-all disabled:opacity-50 shadow-inner"
        />
      </div>
    </div>
  );
};
