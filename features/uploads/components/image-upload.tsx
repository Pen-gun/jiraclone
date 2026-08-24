'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUploadImage } from '../api/use-upload-image';
import { useDeleteImage } from '../api/use-delete-image';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  currentImageUrl?: string | null;
  type: 'profile' | 'project';
  entityId?: string;
  onUploadComplete?: (url: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
}

const sizeClasses = {
  sm: 'w-20 h-20',
  md: 'w-32 h-32',
  lg: 'w-48 h-48',
};

export function ImageUpload({
  currentImageUrl,
  type,
  entityId,
  onUploadComplete,
  className,
  size = 'md',
  shape = 'circle',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadImage();
  const deleteMutation = useDeleteImage();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadMutation.mutate(
      { file, type, entityId },
      {
        onSuccess: (data) => {
          setPreview(data.url);
          onUploadComplete?.(data.url);
        },
        onError: () => {
          setPreview(currentImageUrl || null);
        },
      }
    );
  };

  const handleRemove = async () => {
    if (!entityId) return;

    deleteMutation.mutate(
      { type, entityId },
      {
        onSuccess: () => {
          setPreview(null);
          onUploadComplete?.('');
        },
      }
    );
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const isLoading = uploadMutation.isPending || deleteMutation.isPending;

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div
        className={cn(
          'relative group',
          sizeClasses[size],
          shape === 'circle' ? 'rounded-full' : 'rounded-lg'
        )}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Upload preview"
              className={cn(
                'w-full h-full object-cover',
                shape === 'circle' ? 'rounded-full' : 'rounded-lg'
              )}
            />
            {!isLoading && (
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <div
            className={cn(
              'w-full h-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50 cursor-pointer hover:bg-muted transition-colors',
              shape === 'circle' ? 'rounded-full' : 'rounded-lg'
            )}
            onClick={handleClick}
          >
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        {isLoading && (
          <div
            className={cn(
              'absolute inset-0 bg-background/80 flex items-center justify-center',
              shape === 'circle' ? 'rounded-full' : 'rounded-lg'
            )}
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isLoading}
        className="hidden"
      />

      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            {preview ? 'Change Image' : 'Upload Image'}
          </>
        )}
      </Button>
    </div>
  );
}
