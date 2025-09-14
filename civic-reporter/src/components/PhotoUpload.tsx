import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoUploadProps {
  photo: string | null;
  onPhotoChange: (photo: string | null) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ photo, onPhotoChange }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onPhotoChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onPhotoChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleRemove = () => {
    onPhotoChange(null);
  };

  if (photo) {
    return (
      <div className="relative">
        <img
          src={photo}
          alt="Uploaded"
          className="w-full h-48 object-cover rounded-lg border border-border"
        />
        <Button
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        glass-dark rounded-lg border-2 border-dashed transition-all-smooth cursor-pointer
        ${isDragActive ? 'border-primary bg-accent' : 'border-border hover:border-primary/50'}
        p-8 text-center
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {isDragActive ? (
          <Upload className="h-12 w-12 text-primary glow-primary" />
        ) : (
          <Camera className="h-12 w-12 text-muted-foreground" />
        )}
        <div>
          <p className="text-lg font-medium">
            {isDragActive ? 'Drop your photo here' : 'Upload a photo'}
          </p>
          <p className="text-sm text-muted-foreground">
            Drag & drop or click to select (max 5MB)
          </p>
        </div>
      </div>
    </div>
  );
};