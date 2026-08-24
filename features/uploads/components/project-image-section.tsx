'use client';

import { ImageUpload } from './image-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectImageSectionProps {
  project: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
}

export function ProjectImageSection({ project }: ProjectImageSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Image</CardTitle>
        <CardDescription>
          Upload a cover image for your project. Recommended size: 1200x630px. Max size: 5MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ImageUpload
          type="project"
          currentImageUrl={project.imageUrl}
          entityId={project.id}
          shape="square"
          size="lg"
          onUploadComplete={(url) => {
            console.log('Project image updated:', url);
          }}
        />
        <p className="text-sm text-muted-foreground mt-4 text-center">
          This image will be displayed on the project dashboard and in project listings.
        </p>
      </CardContent>
    </Card>
  );
}
