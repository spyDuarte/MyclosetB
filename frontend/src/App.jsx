import { useMemo, useState } from 'react';
import { AuthCard } from './components/auth/AuthCard';
import { Header } from './components/layout/Header';
import { ActionBar } from './components/layout/ActionBar';
import { CategoryFilter } from './components/wardrobe/CategoryFilter';
import { ItemGrid } from './components/wardrobe/ItemGrid';
import { LookGrid } from './components/looks/LookGrid';
import { AddItemModal } from './components/modals/AddItemModal';
import { ItemDetailModal } from './components/modals/ItemDetailModal';
import { CreateLookModal } from './components/modals/CreateLookModal';
import { StatsModal } from './components/modals/StatsModal';
import { useAuth } from './hooks/useAuth';
import { useWardrobe } from './hooks/useWardrobe';
import { useImageUpload } from './hooks/useImageUpload';
import { calcStats } from './lib/utils';

const Loader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-white border-t-primary-600"></div>
  </div>
);

function App() {
  const {
    authMode,
    setAuthMode,
    user,
    loading: authLoading,
    errors: authErrors,
    message: authMessage,
    handleEmailAuth,
    signOut,
    signInWithProvider,
    resetErrors
  } = useAuth();

  const wardrobe = useWardrobe(user);
  const imageUpload = useImageUpload();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateLookModal, setShowCreateLookModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const stats = useMemo(() => calcStats(wardrobe.items, wardrobe.looks), [wardrobe.items, wardrobe.looks]);

  const handleAddItem = async (payload, file) => {
    if (!user) return;
    let imageUrl = null;
    if (file) {
      const uploaded = await imageUpload.uploadImage(user.id, file);
      if (!uploaded) return;
      imageUrl = uploaded;
    }

    const created = await wardrobe.addItem({ ...payload, image_url: imageUrl });
    if (created) {
      setShowAddModal(false);
    }
  };

  const handleDeleteItem = async (id, imageUrl) => {
    const success = await wardrobe.deleteItem(id);
    if (success && imageUrl) {
      await imageUpload.deleteImage(imageUrl);
    }
    setShowDetailModal(false);
    setSelectedItem(null);
  };

  const handleIncrementUsage = async (id, current) => {
    await wardrobe.incrementUsage(id, current);
  };

  const handleToggleFavorite = async (id, favorite) => {
    await wardrobe.toggleFavorite(id, favorite);
  };

  const handleCreateLook = async (payload) => {
    const saved = await wardrobe.createLook(payload);
    if (saved) {
      setShowCreateLookModal(false);
    }
  };

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleImport = (file) => {
    wardrobe.importData(file);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-gradient px-4 py-10">
        <AuthCard
          authMode={authMode}
          setAuthMode={setAuthMode}
          handleEmailAuth={handleEmailAuth}
          signInWithProvider={signInWithProvider}
          loading={authLoading}
          errors={authErrors}
          message={authMessage}
          resetErrors={resetErrors}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-gradient pb-10">
      <Header
        onOpenStats={() => setShowStatsModal(true)}
        onLogout={signOut}
        mode={wardrobe.mode}
        setMode={wardrobe.setMode}
      />

      <ActionBar
        searchTerm={wardrobe.searchTerm}
        setSearchTerm={wardrobe.setSearchTerm}
        onOpenAdd={() => setShowAddModal(true)}
        onOpenLook={() => setShowCreateLookModal(true)}
        onExport={wardrobe.exportData}
        onImport={handleImport}
      />

      {wardrobe.mode === 'wardrobe' && (
        <>
          <CategoryFilter
            selectedCategory={wardrobe.selectedCategory}
            setSelectedCategory={wardrobe.setSelectedCategory}
          />
          <ItemGrid
            items={wardrobe.filteredItems}
            onOpen={handleOpenDetail}
            onToggleFavorite={handleToggleFavorite}
            onSelect={wardrobe.toggleSelectedItem}
            selectedItems={wardrobe.selectedItems}
            selectionEnabled={showCreateLookModal}
          />
        </>
      )}

      {wardrobe.mode === 'looks' && (
        <LookGrid looks={wardrobe.looks} items={wardrobe.items} onDelete={wardrobe.deleteLook} />
      )}

      {wardrobe.error && (
        <div className="fixed bottom-6 right-6 rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {wardrobe.error}
        </div>
      )}

      {wardrobe.loading && <Loader />}

      <AddItemModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddItem}
        uploading={imageUpload.uploading || wardrobe.loading}
        uploadError={imageUpload.error}
        onResetUpload={imageUpload.clearError}
      />

      <ItemDetailModal
        open={showDetailModal}
        item={selectedItem}
        onClose={() => setShowDetailModal(false)}
        onDelete={handleDeleteItem}
        onIncrementUsage={handleIncrementUsage}
        onToggleFavorite={handleToggleFavorite}
      />

      <CreateLookModal
        open={showCreateLookModal}
        onClose={() => {
          setShowCreateLookModal(false);
          wardrobe.resetSelection();
        }}
        items={wardrobe.items}
        selectedItems={wardrobe.selectedItems}
        toggleSelectedItem={wardrobe.toggleSelectedItem}
        onSubmit={handleCreateLook}
      />

      <StatsModal open={showStatsModal} onClose={() => setShowStatsModal(false)} stats={stats} />
    </div>
  );
}

export default App;
