export interface PhotoAttachment {
  id: string;
  activityId: string;
  filename: string;
  dataUrl: string; // Base64 encoded image
  uploadedAt: string;
  size: number; // in bytes
  type: string; // MIME type
}

export const photoAttachmentService = {
  /**
   * Get all photos for an activity
   */
  getPhotos: (activityId: string): PhotoAttachment[] => {
    const key = `photos_${activityId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  },

  /**
   * Add photo attachment
   */
  addPhoto: (activityId: string, file: File, dataUrl: string): PhotoAttachment => {
    const photos = photoAttachmentService.getPhotos(activityId);

    const photo: PhotoAttachment = {
      id: `${activityId}_${Date.now()}`,
      activityId,
      filename: file.name,
      dataUrl,
      uploadedAt: new Date().toISOString(),
      size: file.size,
      type: file.type,
    };

    photos.push(photo);

    // Keep only last 10 photos per activity
    if (photos.length > 10) {
      photos.shift();
    }

    const key = `photos_${activityId}`;
    localStorage.setItem(key, JSON.stringify(photos));

    return photo;
  },

  /**
   * Delete photo
   */
  deletePhoto: (activityId: string, photoId: string): void => {
    const key = `photos_${activityId}`;
    const photos = photoAttachmentService.getPhotos(activityId);
    const filtered = photos.filter((p) => p.id !== photoId);
    localStorage.setItem(key, JSON.stringify(filtered));
  },

  /**
   * Get photo by ID
   */
  getPhoto: (activityId: string, photoId: string): PhotoAttachment | null => {
    const photos = photoAttachmentService.getPhotos(activityId);
    return photos.find((p) => p.id === photoId) || null;
  },

  /**
   * Convert file to base64
   */
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * Validate image file
   */
  validateImageFile: (file: File): { valid: boolean; error?: string } => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Only JPEG, PNG, GIF, and WebP images are allowed',
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Image size must be less than 5MB',
      };
    }

    return { valid: true };
  },

  /**
   * Format file size for display
   */
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Get total storage used by photos
   */
  getTotalStorageUsed: (activityId: string): number => {
    const photos = photoAttachmentService.getPhotos(activityId);
    return photos.reduce((total, photo) => total + photo.size, 0);
  },

  /**
   * Clear all photos for an activity
   */
  clearPhotos: (activityId: string): void => {
    const key = `photos_${activityId}`;
    localStorage.removeItem(key);
  },

  /**
   * Export photos as ZIP (returns download links)
   */
  exportPhotosAsLinks: (activityId: string): PhotoAttachment[] => {
    return photoAttachmentService.getPhotos(activityId);
  },

  /**
   * Get photo metadata
   */
  getPhotoMetadata: (activityId: string, photoId: string) => {
    const photo = photoAttachmentService.getPhoto(activityId, photoId);
    if (!photo) return null;

    return {
      filename: photo.filename,
      size: photoAttachmentService.formatFileSize(photo.size),
      type: photo.type,
      uploadedAt: new Date(photo.uploadedAt).toLocaleString(),
    };
  },
};
