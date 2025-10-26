import { ItemCard } from './ItemCard';

export const ItemGrid = ({
  items,
  onOpen,
  onToggleFavorite,
  onSelect,
  selectedItems,
  selectionEnabled
}) => {
  if (!items.length) {
    return (
      <div className="mx-auto mt-12 max-w-3xl rounded-3xl bg-white/70 p-8 text-center shadow-lg">
        <h3 className="text-xl font-semibold text-slate-900">Nenhuma peça encontrada</h3>
        <p className="mt-2 text-sm text-slate-500">
          Adicione novas peças ou ajuste os filtros para visualizar seu guarda-roupa digital.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 grid w-full max-w-6xl gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onOpen={onOpen}
          onToggleFavorite={onToggleFavorite}
          onSelect={onSelect}
          isSelected={selectedItems.includes(item.id)}
          selectionEnabled={selectionEnabled}
        />
      ))}
    </div>
  );
};
