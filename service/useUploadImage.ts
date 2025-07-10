import { BACKEND } from '@/service/api';
import * as ImageManipulator from 'expo-image-manipulator';
import { useState } from 'react';

// ✅ Fungsi terpisah: untuk hanya melakukan enhancement
export const enhanceImage = async (imageUri: string) => {
  const manipResult = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 640, height: 640 } }],
    {
      compress: 0.7,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  );

  const fileUri = manipResult.uri;
  const fileName = fileUri.split('/').pop() ?? 'photo.jpg';

  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: fileName,
    type: 'image/jpeg',
  } as any);

  const response = await fetch(`${BACKEND.BASE_URL}/lamun/enhance`, {
    method: 'POST',
    body: formData,
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.message || 'Enhancement gagal');

  return {
    enhancedBase64: json.enhanced_base64,
    fileUri,
  };
};

// 🔄 Fungsi utama upload & prediksi
export const useUploadImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadImage = async (imageUri: string) => {
    setLoading(true);
    setError(null);
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 640, height: 640 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      const fileUri = manipResult.uri;
      const fileName = fileUri.split('/').pop() ?? 'photo.jpg';

      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: 'image/jpeg',
      } as any);

      const enhanceResponse = await fetch(`${BACKEND.BASE_URL}/lamun/enhance`, {
        method: 'POST',
        body: formData,
      });

      const enhanceJson = await enhanceResponse.json();
      if (!enhanceResponse.ok) throw new Error('Enhancement gagal');

      const enhancedBase64 = enhanceJson.enhanced_base64;

      const detectResponse = await fetch(`${BACKEND.BASE_URL}/lamun/detect`, {
        method: 'POST',
        body: formData,
      });

      const detectJson = await detectResponse.json();
      if (!detectResponse.ok) throw new Error(detectJson.message || 'Prediksi gagal');

      return {
        result: {
          detections: detectJson.detections,
          enhancedBase64: enhancedBase64,
        },
        fileUri,
      };
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

   return { loading, error, uploadImage, enhanceImage };
};
