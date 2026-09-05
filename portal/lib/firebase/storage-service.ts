import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseStorageInstance } from './client';

export async function uploadListingImage(
  file: File,
  folder: 'jobs' | 'housing',
  listingId: string,
): Promise<string | null> {
  const storage = getFirebaseStorageInstance();
  if (!storage) {
    console.warn('Firebase Storage is not initialized');
    return null;
  }

  // Validate size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Die Datei ist zu groß. Maximale Dateigröße beträgt 5 MB.');
  }

  // Validate type
  if (!file.type.startsWith('image/')) {
    throw new Error('Nur Bilddateien (JPG, PNG, WebP) sind zulässig.');
  }

  const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const storagePath = `${folder}/${listingId}/${cleanFileName}`;
  const storageRef = ref(storage, storagePath);

  try {
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
    });
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (err: any) {
    console.error('Firebase storage upload failed:', err);
    throw new Error(`Upload fehlgeschlagen: ${err.message || 'Unbekannter Fehler'}`);
  }
}
