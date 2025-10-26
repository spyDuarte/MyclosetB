import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { downloadBlob, filterItems, parseTags } from '../lib/utils';

export const useWardrobe = (user) => {
  const [items, setItems] = useState([]);
  const [looks, setLooks] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState('wardrobe');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLooks([]);
      return;
    }
    loadItems();
    loadLooks();
  }, [user]);

  const loadItems = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('wardrobe_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setError('Não foi possível carregar suas peças.');
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const loadLooks = async () => {
    if (!user) return;
    setError('');
    const { data, error } = await supabase
      .from('looks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setError('Não foi possível carregar seus looks.');
    } else {
      setLooks(data || []);
    }
  };

  const addItem = async (payload) => {
    if (!user) return null;
    setLoading(true);
    setError('');

    const { error, data } = await supabase
      .from('wardrobe_items')
      .insert([{ ...payload, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error(error);
      setError('Erro ao adicionar peça.');
      setLoading(false);
      return null;
    }

    setItems((prev) => [data, ...prev]);
    setLoading(false);
    setError('');
    return data;
  };

  const updateItem = async (id, updates) => {
    setError('');
    const { error, data } = await supabase
      .from('wardrobe_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(error);
      setError('Não foi possível atualizar a peça.');
      return null;
    }

    setItems((prev) => prev.map((item) => (item.id === id ? data : item)));
    return data;
  };

  const toggleFavorite = async (id, current) => {
    return updateItem(id, { favorite: !current });
  };

  const incrementUsage = async (id, current = 0) => {
    return updateItem(id, { usage_count: current + 1 });
  };

  const deleteItem = async (id) => {
    setError('');
    const { error } = await supabase.from('wardrobe_items').delete().eq('id', id);
    if (error) {
      console.error(error);
      setError('Não foi possível remover a peça.');
      return false;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
    return true;
  };

  const createLook = async (payload) => {
    if (!user) return null;
    setError('');
    const { data, error } = await supabase
      .from('looks')
      .insert([{ ...payload, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error(error);
      setError('Erro ao salvar look.');
      return null;
    }

    setLooks((prev) => [data, ...prev]);
    setError('');
    setSelectedItems([]);
    return data;
  };

  const deleteLook = async (id) => {
    setError('');
    const { error } = await supabase.from('looks').delete().eq('id', id);
    if (error) {
      console.error(error);
      setError('Não foi possível remover o look.');
      return false;
    }
    setLooks((prev) => prev.filter((look) => look.id !== id));
    return true;
  };

  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      items,
      looks
    };

    const date = new Date().toISOString().split('T')[0];
    downloadBlob(JSON.stringify(payload, null, 2), `guarda-roupa-${date}.json`);
  };

  const importData = async (file) => {
    if (!user) return;
    setError('');
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      if (!payload.items || !payload.looks) {
        setError('Arquivo inválido.');
        return;
      }

      if (payload.items.length) {
        const formattedItems = payload.items.map((item) => ({
          ...item,
          id: undefined,
          user_id: user.id,
          tags: Array.isArray(item.tags) ? item.tags : parseTags(item.tags?.join(',') ?? '')
        }));

        const { error } = await supabase.from('wardrobe_items').insert(formattedItems);
        if (error) throw error;
      }

      if (payload.looks.length) {
        const formattedLooks = payload.looks.map((look) => ({
          ...look,
          id: undefined,
          user_id: user.id
        }));
        const { error } = await supabase.from('looks').insert(formattedLooks);
        if (error) throw error;
      }

      await loadItems();
      await loadLooks();
    } catch (err) {
      console.error(err);
      setError('Não foi possível importar os dados.');
    }
  };

  const filteredItems = useMemo(
    () => filterItems(items, { selectedCategory, searchTerm }),
    [items, selectedCategory, searchTerm]
  );

  const toggleSelectedItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const resetSelection = () => setSelectedItems([]);

  return {
    items,
    looks,
    selectedItems,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    mode,
    setMode,
    loading,
    error,
    filteredItems,
    loadItems,
    addItem,
    deleteItem,
    toggleFavorite,
    incrementUsage,
    createLook,
    deleteLook,
    exportData,
    importData,
    toggleSelectedItem,
    resetSelection,
    setSelectedItems
  };
};
