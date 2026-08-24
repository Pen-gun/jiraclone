# Uploads Feature - API Reference

Image uploads to AWS S3 for user profiles and project images.

## Quick Usage

```tsx
import { ImageUpload } from '@/features/uploads';

// Profile picture
<ImageUpload
  type="profile"
  currentImageUrl={user?.profileImageUrl}
  entityId={user?.id}
  shape="circle"
  size="lg"
/>

// Project image
<ImageUpload
  type="project"
  currentImageUrl={project?.imageUrl}
  entityId={project?.id}
  shape="square"
  size="md"
/>
```

## API Routes

### POST `/api/uploads/presigned-url`
Get presigned URL for upload

**Request:**
```json
{
  "type": "profile" | "project",
  "filename": "avatar.jpg",
  "contentType": "image/jpeg",
  "entityId": "optional-project-id"
}
```

### POST `/api/uploads/confirm`
Confirm upload and update database

**Request:**
```json
{
  "key": "profile/user-id/timestamp.jpg",
  "type": "profile" | "project",
  "entityId": "optional-project-id"
}
```

### DELETE `/api/uploads/:type/:id`
Delete uploaded image

## Hooks

```tsx
// Upload
const uploadMutation = useUploadImage();
uploadMutation.mutate({ file, type: 'profile' });

// Delete
const deleteMutation = useDeleteImage();
deleteMutation.mutate({ type: 'profile', entityId });
```

## Component Props

```typescript
interface ImageUploadProps {
  currentImageUrl?: string | null;
  type: 'profile' | 'project';
  entityId?: string;
  onUploadComplete?: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
}
```

## Validation

- File type: Images only
- Max size: 5MB
- Authentication required
- Presigned URLs expire in 15 minutes

---

**Setup instructions:** See `/AWS_INTEGRATION.md`
