import { Calendar, Trash2 } from 'lucide-react';

export function LookCard({ look, itemsById, onDelete }) {
  const { name, occasion, created_at: createdAt, item_ids: itemIds = [] } = look;
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('pt-BR') : '';

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-white/90 p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">{name}</h3>
          <p className="text-sm text-slate-500">{occasion || 'Ocasião livre'}</p>
          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-purple-500">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(look)}
          className="rounded-full bg-red-50 p-2 text-red-500 transition hover:bg-red-100 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {itemIds.map((itemId) => {
          const item = itemsById[itemId];
          if (!item) {
            return (
              <div
                key={itemId}
                className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-purple-200 bg-purple-50 text-xs text-purple-400"
              >
                Item removido
              </div>
            );
          }

          return (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 text-lg text-purple-400">
                  👗
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
