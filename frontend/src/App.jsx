import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  Download,
  LogOut,
  Plus,
  Shirt,
  Upload,
  Wand2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from './lib/supabase.js';
import { AuthForm } from './components/auth/AuthForm.jsx';
import { SearchBar } from './components/wardrobe/SearchBar.jsx';
import { CategoryFilter } from './components/wardrobe/CategoryFilter.jsx';
import { ItemCard } from './components/wardrobe/ItemCard.jsx';
import { AddItemModal } from './components/modals/AddItemModal.jsx';
import { ItemDetailModal } from './components/modals/ItemDetailModal.jsx';
import { CreateLookModal } from './components/modals/CreateLookModal.jsx';
import { StatsModal } from './components/modals/StatsModal.jsx';
import { LookCard } from './components/looks/LookCard.jsx';

const STORAGE_BUCKET = 'wardrobe-images';

export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [items, setItems] = useState([]);
  const [looks, setLooks] = useState([]);
  const [mode, setMode] = useState('wardrobe');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showCreateLookModal, setShowCreateLookModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const [loadingItems, setLoadingItems] = useState(false);
  const [mutationLoading, setMutationLoading] = useState(false);

  const importInputRef = useRef(null);

  useEffect(() => {
    const initialize = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await Promise.all([loadItems(session.user), loadLooks(session.user)]);
      }
    };

    initialize();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await Promise.all([loadItems(session.user), loadLooks(session.user)]);
      } else {
        setItems([]);
        setLooks([]);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadItems = async (currentUser = user) => {
    if (!currentUser) return;
    setLoadingItems(true);
    const { data, error } = await supabase
      .from('wardrobe_items')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      toast.error('Não foi possível carregar suas peças.');
    } else {
      setItems((data || []).map((item) => ({ ...item, tags: item.tags || [] })));
    }
    setLoadingItems(false);
  };

  const loadLooks = async (currentUser = user) => {
    if (!currentUser) return;
    const { data, error } = await supabase
      .from('looks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      toast.error('Não foi possível carregar seus looks.');
    } else {
      setLooks((data || []).map((look) => ({ ...look, item_ids: look.item_ids || [] })));
    }
  };

  const handleEmailAuth = async ({ email, password, mode: submissionMode }) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      if (!email || !password) {
        throw new Error('Informe email e senha válidos.');
      }
      if (submissionMode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Conta criada! Faça login para continuar.');
        setAuthMode('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      console.error(error);
      setAuthError(error.message || 'Falha na autenticação.');
      toast.error('Não foi possível autenticar.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSocialAuth = async (provider, credentials) => {
    if (provider === 'email') {
      return handleEmailAuth(credentials);
    }

    try {
      setAuthLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
    } catch (error) {
      console.error(error);
      toast.error('Falha ao conectar com o provedor social.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Sessão encerrada. Até logo!');
  };

  const uploadImage = async (file) => {
    if (!file || !user) return null;
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '-');
    const filePath = `${user.id}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    return { publicUrl: data.publicUrl, path: filePath };
  };

  const deleteImage = async (imageUrl) => {
    if (!imageUrl) return;
    const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
    const index = imageUrl.indexOf(marker);
    if (index === -1) return;
    const path = imageUrl.substring(index + marker.length);
    if (!path) return;
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
    if (error) {
      console.error('Erro ao remover imagem do storage', error);
    }
  };

  const handleAddItem = async ({ name, category, color, season, tags, file }) => {
    if (!user) return;
    setMutationLoading(true);
    try {
      let imageUrl = null;
      let uploadedUrl = null;
      if (file) {
        const uploadResult = await uploadImage(file);
        imageUrl = uploadResult?.publicUrl;
        uploadedUrl = imageUrl;
      }
      const { data, error } = await supabase
        .from('wardrobe_items')
        .insert([
          {
            user_id: user.id,
            name,
            category,
            color,
            season,
            tags,
            image_url: imageUrl
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setItems((previous) => [{ ...data, tags: data.tags || [] }, ...previous]);
      toast.success('Peça adicionada com sucesso!');
      setShowAddModal(false);
    } catch (error) {
      console.error(error);
      if (uploadedUrl) {
        await deleteImage(uploadedUrl);
      }
      toast.error('Não foi possível adicionar a peça.');
    } finally {
      setMutationLoading(false);
    }
  };

  const handleToggleFavorite = async (item) => {
    const updated = { ...item, favorite: !item.favorite };
    setItems((previous) => previous.map((current) => (current.id === item.id ? updated : current)));
    const { error } = await supabase
      .from('wardrobe_items')
      .update({ favorite: !item.favorite })
      .eq('id', item.id);
    if (error) {
      console.error(error);
      toast.error('Não foi possível atualizar o favorito.');
      setItems((previous) => previous.map((current) => (current.id === item.id ? item : current)));
    }
  };

  const handleIncrementUsage = async (item) => {
    const updated = { ...item, usage_count: (item.usage_count || 0) + 1 };
    setItems((previous) => previous.map((current) => (current.id === item.id ? updated : current)));
    const { error } = await supabase
      .from('wardrobe_items')
      .update({ usage_count: updated.usage_count })
      .eq('id', item.id);
    if (error) {
      console.error(error);
      toast.error('Não foi possível registrar o uso.');
      setItems((previous) => previous.map((current) => (current.id === item.id ? item : current)));
    } else {
      toast.success('Uso registrado!');
    }
  };

  const handleDeleteItem = async (item) => {
    setMutationLoading(true);
    try {
      const { error } = await supabase.from('wardrobe_items').delete().eq('id', item.id);
      if (error) throw error;
      await deleteImage(item.image_url);
      setItems((previous) => previous.filter((current) => current.id !== item.id));
      setSelectedItem(null);
      toast.success('Peça removida com sucesso.');
    } catch (error) {
      console.error(error);
      toast.error('Não foi possível remover a peça.');
    } finally {
      setMutationLoading(false);
    }
  };

  const handleCreateLook = async ({ name, occasion, itemIds }) => {
    if (!user) return;
    setMutationLoading(true);
    try {
      const { data, error } = await supabase
        .from('looks')
        .insert([
          {
            user_id: user.id,
            name,
            occasion,
            item_ids: itemIds
          }
        ])
        .select()
        .single();
      if (error) throw error;
      setLooks((previous) => [{ ...data, item_ids: data.item_ids || [] }, ...previous]);
      setShowCreateLookModal(false);
      setSelectedItems([]);
      toast.success('Look criado com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Não foi possível criar o look.');
    } finally {
      setMutationLoading(false);
    }
  };

  const handleDeleteLook = async (look) => {
    if (!window.confirm('Deseja realmente excluir este look?')) {
      return;
    }
    const { error } = await supabase.from('looks').delete().eq('id', look.id);
    if (error) {
      console.error(error);
      toast.error('Não foi possível remover o look.');
      return;
    }
    setLooks((previous) => previous.filter((current) => current.id !== look.id));
    toast.success('Look excluído.');
  };

  const handleExportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      items,
      looks
    };
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const date = new Date().toISOString().split('T')[0];
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `guarda-roupa-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Exportação concluída!');
  };

  const handleImportData = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data.items) || !Array.isArray(data.looks)) {
        throw new Error('Estrutura inválida.');
      }

      const confirmation = window.confirm(
        'A importação substituirá os dados atuais do seu guarda-roupa. Deseja continuar?'
      );
      if (!confirmation) {
        return;
      }

      await supabase.from('looks').delete().eq('user_id', user.id);
      await Promise.all(items.map((item) => deleteImage(item.image_url)));
      await supabase.from('wardrobe_items').delete().eq('user_id', user.id);

      if (data.items.length) {
        const sanitizedItems = data.items.map(({ id, user_id, created_at, ...rest }) => ({
          ...rest,
          tags: Array.isArray(rest.tags) ? rest.tags : [],
          created_at: created_at ?? new Date().toISOString(),
          user_id: user.id
        }));
        const { error: itemsError } = await supabase.from('wardrobe_items').insert(sanitizedItems);
        if (itemsError) throw itemsError;
      }

      if (data.looks.length) {
        const sanitizedLooks = data.looks.map(({ id, user_id, created_at, ...rest }) => ({
          ...rest,
          item_ids: Array.isArray(rest.item_ids) ? rest.item_ids : [],
          created_at: created_at ?? new Date().toISOString(),
          user_id: user.id
        }));
        const { error: looksError } = await supabase.from('looks').insert(sanitizedLooks);
        if (looksError) throw looksError;
      }

      await Promise.all([loadItems(user), loadLooks(user)]);
      toast.success('Dados importados com sucesso.');
    } catch (error) {
      console.error(error);
      toast.error('Não foi possível importar o arquivo.');
    } finally {
      if (importInputRef.current) {
        importInputRef.current.value = '';
      }
    }
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItems((previous) =>
      previous.includes(itemId) ? previous.filter((id) => id !== itemId) : [...previous, itemId]
    );
  };

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => (selectedCategory === 'all' ? true : item.category === selectedCategory))
      .filter((item) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        const tags = (item.tags || []).join(' ').toLowerCase();
        return item.name.toLowerCase().includes(term) || tags.includes(term);
      });
  }, [items, selectedCategory, searchTerm]);

  const itemsById = useMemo(() => {
    const map = {};
    items.forEach((item) => {
      map[item.id] = item;
    });
    return map;
  }, [items]);

  if (!user) {
    return (
      <AuthForm
        mode={authMode}
        onModeChange={setAuthMode}
        onSubmit={handleEmailAuth}
        onSocial={handleSocialAuth}
        loading={authLoading}
        error={authError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-slate-50 pb-12">
      <header className="sticky top-0 z-40 bg-gradient-to-r from-purple-100/80 via-white/80 to-pink-100/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 text-white shadow-lg">
              <Shirt className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Meu guarda-roupa digital</h1>
              <p className="text-sm text-slate-500">Olá, {user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('wardrobe')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === 'wardrobe'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/80 text-slate-600 shadow hover:bg-purple-50'
              }`}
            >
              Peças
            </button>
            <button
              type="button"
              onClick={() => setMode('looks')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === 'looks'
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-white/80 text-slate-600 shadow hover:bg-pink-50'
              }`}
            >
              Looks
            </button>
            <button
              type="button"
              onClick={() => setShowStatsModal(true)}
              className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-purple-600 shadow hover:-translate-y-0.5 hover:bg-purple-50"
            >
              <BarChart3 className="h-4 w-4" />
              Estatísticas
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>

        <div className="border-t border-white/60">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center">
            <div className="flex-1">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700"
              >
                <Plus className="h-4 w-4" />
                Adicionar peça
              </button>
              <button
                type="button"
                onClick={() => setShowCreateLookModal(true)}
                className="flex items-center gap-2 rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-pink-700"
              >
                <Wand2 className="h-4 w-4" />
                Criar look
              </button>
              <button
                type="button"
                onClick={handleExportData}
                className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Exportar
              </button>
              <button
                type="button"
                onClick={() => importInputRef.current?.click()}
                className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-green-700"
              >
                <Upload className="h-4 w-4" />
                Importar
              </button>
              <input ref={importInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportData} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-6xl space-y-6 px-4">
        {mode === 'wardrobe' ? (
          <>
            <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
            {loadingItems ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="h-72 animate-pulse rounded-3xl bg-white/60 shadow-inner" />
                ))}
              </div>
            ) : filteredItems.length ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onSelect={setSelectedItem}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhuma peça encontrada"
                description="Use o botão acima para adicionar suas primeiras peças."
              />
            )}
          </>
        ) : (
          <>
            {looks.length ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {looks.map((look) => (
                  <LookCard key={look.id} look={look} itemsById={itemsById} onDelete={handleDeleteLook} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Sem looks cadastrados"
                description="Selecione algumas peças e crie looks incríveis!"
              />
            )}
          </>
        )}
      </main>

      <AddItemModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddItem}
        loading={mutationLoading}
      />

      <ItemDetailModal
        open={Boolean(selectedItem)}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onDelete={handleDeleteItem}
        onUsage={handleIncrementUsage}
        loading={mutationLoading}
      />

      <CreateLookModal
        open={showCreateLookModal}
        onClose={() => {
          setShowCreateLookModal(false);
          setSelectedItems([]);
        }}
        onCreate={handleCreateLook}
        items={items}
        selectedItems={selectedItems}
        onToggleSelect={toggleSelectItem}
        loading={mutationLoading}
      />

      <StatsModal open={showStatsModal} onClose={() => setShowStatsModal(false)} items={items} looks={looks} />
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-white/80 p-10 text-center shadow-inner">
      <div className="rounded-full bg-gradient-to-br from-purple-200 to-pink-200 p-6 text-4xl">✨</div>
      <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}
