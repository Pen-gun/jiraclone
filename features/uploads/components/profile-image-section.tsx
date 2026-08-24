'use client';

import { ImageUpload } from './image-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileImageSectionProps {
  user: {
    id: string;
    fullName?: string | null;
    email: string;
    profileImageUrl?: string | null;
  };
}

export function ProfileImageSection({ user }: ProfileImageSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>
          Upload a profile picture. Recommended size: 400x400px. Max size: 5MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ImageUpload
          type="profile"
          currentImageUrl={user.profileImageUrl}
          entityId={user.id}
          shape="circle"
          size="lg"
          onUploadComplete={(url) => {
            console.log('Profile picture updated:', url);
          }}
        />
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Your profile picture is visible to all members in your workspaces.
        </p>
      </CardContent>
    </Card>
  );
}
