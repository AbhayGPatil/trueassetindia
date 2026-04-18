import {
  ref,
  uploadBytes,
  getBytes,
  deleteObject,
  getDownloadURL,
} from 'firebase/storage';
import { storage } from '@/lib/firebase';

// Convert image to WebP format
async function convertToWebP(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/webp', 0.8);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Upload image
export async function uploadImage(file, userId, propertyId) {
  try {
    // Validate file size (max 500KB)
    const maxSize = 500 * 1024;
    if (file.size > maxSize) {
      throw new Error('Image must be less than 500KB');
    }

    // Convert to WebP if possible
    let uploadFile = file;
    if (file.type.startsWith('image/')) {
      try {
        uploadFile = await convertToWebP(file);
      } catch (error) {
        // Fall back to original if conversion fails
        console.warn('WebP conversion failed, using original:', error);
      }
    }

    const timestamp = Date.now();
    const fileName = `${file.name.split('.')[0]}-${timestamp}.webp`;
    const storagePath = `properties/${userId}/${propertyId}/images/${fileName}`;
    const storageRef = ref(storage, storagePath);

    const snapshot = await uploadBytes(storageRef, uploadFile);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      path: storagePath,
      name: fileName,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Upload video
export async function uploadVideo(file, userId, propertyId) {
  try {
    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('Video must be less than 50MB');
    }

    // Validate video duration (max 60 seconds for short videos)
    // This is done on client side before upload

    const timestamp = Date.now();
    const fileName = `${file.name.split('.')[0]}-${timestamp}.mp4`;
    const storagePath = `properties/${userId}/${propertyId}/videos/${fileName}`;
    const storageRef = ref(storage, storagePath);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      path: storagePath,
      name: fileName,
    };
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
}

// Delete image
export async function deleteImage(imagePath) {
  try {
    const storageRef = ref(storage, imagePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

// Delete video
export async function deleteVideo(videoPath) {
  try {
    const storageRef = ref(storage, videoPath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
}

// Validate video duration (helper function)
export function validateVideoDuration(file, maxSeconds = 60) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      video.src = URL.createObjectURL(new Blob([e.target.result], { type: file.type }));
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        if (video.duration > maxSeconds) {
          reject(new Error(`Video must be less than ${maxSeconds} seconds`));
        } else {
          resolve(true);
        }
      };
      video.onerror = () => {
        reject(new Error('Invalid video file'));
      };
    };
    fileReader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    fileReader.readAsArrayBuffer(file);
  });
}
