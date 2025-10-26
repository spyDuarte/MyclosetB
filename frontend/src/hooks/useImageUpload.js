import { useState } from 'react';
import { supabase } from '../lib/supabase';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    if (!file) return false;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Formato inválido. Use JPG, PNG ou WEBP.');
      return false;
    }

    if (file.size > MAX_SIZE) {
      setError('Arquivo muito grande. Máximo 5MB.');
      return false;
    }

    setError('');
    return true;
  };

  const uploadImage = async (userId, file) => {
    if (!validateFile(file)) return null;
    setUploading(true);

    const ext = file.name.split('.').pop();
    const filePath = `${userId}/${Date.now()}.${ext}`;

    try {
      const { error } = await supabase.storage.from('wardrobe-images').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      if (error) throw error;

      const {
        data: { publicUrl }
      } = supabase.storage.from('wardrobe-images').getPublicUrl(filePath);
      return publicUrl;
    } catch (err) {
      console.error(err);
      setError('Falha no upload. Tente novamente.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (publicUrl) => {
    if (!publicUrl) return;
    try {
      const url = new URL(publicUrl);
      const path = decodeURIComponent(url.pathname.split('/storage/v1/object/public/')[1]);
      await supabase.storage.from('wardrobe-images').remove([path]);
    } catch (err) {
      console.error('Erro ao remover imagem', err);
    }
  };

  const clearError = () => setError('');

  return {
    uploading,
    error,
    uploadImage,
    deleteImage,
    validateFile,
    clearError
  };
};
