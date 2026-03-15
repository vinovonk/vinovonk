"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, ImagePlus, X, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface FotoCaptureProps {
  fotoUrl?: string;
  onFotoChange: (file: File | null, previewUrl: string | null) => void;
}

export function FotoCapture({ fotoUrl, onFotoChange }: FotoCaptureProps) {
  const [preview, setPreview] = useState<string | null>(fotoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Valideer bestandsgrootte
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Afbeelding te groot (max 15MB)");
      e.target.value = "";
      return;
    }

    // Valideer MIME-type (laat ook lege type door voor camera capture)
    if (file.type && !ALLOWED_TYPES.includes(file.type)) {
      toast.error("Ongeldig bestandstype — gebruik JPEG, PNG of WebP");
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    onFotoChange(file, url);
  };

  const handleRemove = () => {
    setPreview(null);
    onFotoChange(null, null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Foto van de fles</label>

      {preview ? (
        // Preview met verwijder/opnieuw opties
        <div className="relative rounded-lg overflow-hidden border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Flesfoto"
            className="w-full max-h-64 object-contain"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => cameraInputRef.current?.click()}
              className="h-8 w-8 p-0 bg-background/80 backdrop-blur"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleRemove}
              className="h-8 w-8 p-0 bg-background/80 backdrop-blur"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        // Keuze: camera of bestaande foto
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="h-6 w-6" />
            <span className="text-xs">Foto maken</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs">Uit bibliotheek</span>
          </Button>
        </div>
      )}

      {/* Verborgen inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
