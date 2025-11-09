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

    // Extrai extensão de forma mais robusta baseada no tipo MIME
    const mimeToExt = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp'
    };
    const ext = mimeToExt[file.type] || 'jpg';

    // Gera nome único e seguro para o arquivo
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filePath = `${userId}/${timestamp}_${randomStr}.${ext}`;

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
      const pathParts = url.pathname.split('/storage/v1/object/public/');

      // Valida se o path foi extraído corretamente
      if (pathParts.length < 2 || !pathParts[1]) {
        console.error('Formato de URL inválido:', publicUrl);
        return;
      }

      const path = decodeURIComponent(pathParts[1]);
      const { error } = await supabase.storage.from('wardrobe-images').remove([path]);

      if (error) {
        console.error('Erro ao remover imagem do storage:', error);
      }
    } catch (err) {
      console.error('Erro ao remover imagem:', err);
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
