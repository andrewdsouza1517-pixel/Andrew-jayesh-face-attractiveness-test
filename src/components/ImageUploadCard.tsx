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
    ? 'text-[#8C5E3C] dark:text-[#C99765]'
    : 'text-[#4A6B53] dark:text-[#6B9071]';

  const subjectTitle = isA ? 'Subject Alpha' : 'Subject Bravo';

  return (
    <div className="space-y-4">
      <div
        id={`upload-card-${badge.toLowerCase().replace(' ', '-')}`}
        className={`bg-white dark:bg-[#1E1815] rounded-xl border transition-all duration-200 overflow-hidden flex flex-col ${
          image
            ? 'border-[#E8E2D8] dark:border-[#3D332C] shadow-xs dark:shadow-md'
            : isDragging
            ? 'border-[#8C5E3C] ring-2 ring-[#8C5E3C]/30 bg-[#FAF7F2] dark:bg-[#2B231F]'
            : 'border-[#E8E2D8] dark:border-[#3D332C] hover:border-[#D8CEBF] dark:hover:border-[#5E5046]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-[#FAF7F2] dark:bg-[#221C18] border-b border-[#E8E2D8] dark:border-[#3D332C] flex items-center justify-between gap-2 transition-colors">
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className={`font-mono font-bold uppercase tracking-wider ${badgeStyle}`}>
                {isA ? 'Image A' : 'Image B'}
              </span>
              <span aria-hidden="true" className="text-[#D8CEBF] dark:text-[#3D332C]">·</span>
              <span className="font-medium text-[#5C4E43] dark:text-[#D4C7BC] font-sans">{label}</span>
            </div>
            <p className="text-[11px] text-[#8C7D70] dark:text-[#A69688] font-sans mt-0.5">
              {isA ? 'Image A: Upload the first image' : 'Image B: Upload the second image'}
            </p>
          </div>
          {image && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#4A6B53] dark:text-[#6B9071] font-mono font-medium shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>LOADED</span>
            </div>
          )}
        </div>

        {/* Main Upload / Preview Area */}
        <div className="p-5 flex-1 flex flex-col justify-center">
          {image ? (
            <div className="relative group rounded-lg overflow-hidden bg-[#F4EFEA] dark:bg-[#171311] aspect-4/3 flex items-center justify-center border border-[#E8E2D8] dark:border-[#3D332C] shadow-inner">
              <img
                src={image.dataUrl}
                alt={label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#171311]/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  className="px-4 py-2.5 bg-[#FAF7F2] text-[#211813] hover:bg-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm font-sans"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={() => onImageChange(null)}
                  disabled={disabled}
                  className="p-2.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition cursor-pointer shadow-sm"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 bg-[#FAF7F2]/95 dark:bg-[#1E1815]/95 backdrop-blur-md rounded-md text-xs text-[#5C4E43] dark:text-[#D4C7BC] border border-[#E8E2D8] dark:border-[#3D332C] truncate flex items-center justify-between font-mono">
                <span className="truncate">{image.name}</span>
                <span className="text-[10px] text-[#8C7D70] dark:text-[#A69688] shrink-0 ml-2">18+ CONSENT</span>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border border-dashed rounded-lg p-8 text-center flex flex-col items-center justify-center min-h-[240px] transition-all relative overflow-hidden group ${
                isDragging
                  ? 'border-[#8C5E3C] bg-[#FAF7F2] dark:bg-[#2B231F]'
                  : 'border-[#D8CEBF] dark:border-[#3D332C] hover:border-[#8C5E3C] dark:hover:border-[#C99765] bg-[#FAF7F2]/50 hover:bg-[#FAF7F2] dark:bg-[#171311]/40 dark:hover:bg-[#2B231F]/30'
              }`}
            >
              <div className="w-14 h-14 bg-white dark:bg-[#221C18] rounded-full flex items-center justify-center mb-3 group-hover:border-[#8C5E3C]/40 transition-colors border border-[#E8E2D8] dark:border-[#3D332C] shadow-2xs">
                <Plus className="w-5 h-5 text-[#8C7D70] dark:text-[#A69688] group-hover:text-[#8C5E3C] dark:group-hover:text-[#C99765] transition-colors" />
              </div>

              <p className="text-sm font-editorial font-medium text-[#211813] dark:text-[#F5EFEB]">
                {subjectTitle}
              </p>
              <p className="text-xs text-[#8C7D70] dark:text-[#A69688] mt-1 max-w-[230px] font-sans">
                {isA ? 'Upload the first image or use webcam' : 'Upload the second image or use webcam'}
              </p>

              {/* Selection Buttons */}
              <div className="flex items-center gap-2.5 mt-5 z-10">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  className="px-4 py-2 rounded-lg bg-[#211813] hover:bg-[#3D2C21] dark:bg-[#C99765] dark:hover:bg-[#DDB082] text-[#FAF7F2] dark:text-[#171311] text-xs font-semibold transition cursor-pointer shadow-xs flex items-center gap-1.5 font-sans"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Browse File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  disabled={disabled}
                  className="px-4 py-2 rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] hover:border-[#D8CEBF] dark:hover:border-[#5E5046] bg-white dark:bg-[#221C18] hover:bg-[#F4EFEA] dark:hover:bg-[#2B231F] text-[#5C4E43] dark:text-[#D4C7BC] text-xs font-medium transition flex items-center gap-1.5 cursor-pointer shadow-2xs font-sans"
                >
                  <Camera className="w-3.5 h-3.5 text-[#8C7D70] dark:text-[#A69688]" />
                  <span>Webcam</span>
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mt-3 p-3 bg-red-500/10 text-red-700 dark:text-red-400 rounded-lg text-xs flex items-center gap-2 border border-red-500/20 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
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
      <div className="flex flex-col space-y-1.5 px-0.5">
        <label htmlFor={`name-${badge}`} className="text-[11px] uppercase font-mono text-[#8C7D70] dark:text-[#A69688] flex items-center gap-2">
          <span>Identifier / Name</span>
          <span className="text-[10px] text-[#A89B8F] dark:text-[#7A6C60] font-normal font-sans">(Optional)</span>
        </label>
        <input
          id={`name-${badge}`}
          type="text"
          maxLength={30}
          value={personName}
          onChange={handleNameChange}
          placeholder={`Enter name for ${badge}`}
          disabled={disabled}
          className="w-full bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg px-4 py-2.5 text-sm text-[#211813] dark:text-[#F5EFEB] placeholder-[#A89B8F] dark:placeholder-[#7A6C60] focus:outline-none focus:border-[#8C5E3C] dark:focus:border-[#C99765] focus:ring-1 focus:ring-[#8C5E3C]/30 transition-all disabled:opacity-50 shadow-2xs font-sans"
        />
      </div>
    </div>
  );
};
