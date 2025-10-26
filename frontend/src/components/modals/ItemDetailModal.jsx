import { Heart, Trash2, X } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const ItemDetailModal = ({
  open,
  item,
  onClose,
  onDelete,
  onIncrementUsage,
  onToggleFavorite
}) => {
  if (!open || !item) return null;

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja remover esta peça?')) {
      onDelete(item.id, item.image_url);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="relative grid w-full max-w-3xl gap-6 rounded-3xl bg-white p-6 shadow-2xl md:grid-cols-2">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:scale-110 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="aspect-square overflow-hidden rounded-3xl bg-slate-100">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">Sem foto</div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{item.name}</h2>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                {item.category} • {item.season}
              </p>
            </div>
            <button
              onClick={() => onToggleFavorite(item.id, item.favorite)}
              className={`rounded-full bg-white p-3 text-red-500 shadow transition hover:-translate-y-0.5 ${
                item.favorite ? 'bg-red-50' : ''
              }`}
            >
              <Heart className={`h-5 w-5 ${item.favorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <p>
              Criado em <span className="font-semibold">{formatDate(item.created_at)}</span> e usado{' '}
              <span className="font-semibold">{item.usage_count ?? 0}x</span> até agora.
            </p>
            <p className="mt-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Tags:
              {item.tags?.length ? (
                item.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-primary-600/10 px-2 py-1 text-primary-600">
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="text-slate-400">Sem tags</span>
              )}
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => onIncrementUsage(item.id, item.usage_count ?? 0)}
              className="flex-1 rounded-2xl bg-secondary-600 px-4 py-3 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-secondary-600/90"
            >
              Usei hoje
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 shadow transition hover:-translate-y-0.5 hover:bg-red-500/20"
            >
              <span className="flex items-center justify-center gap-2">
                <Trash2 className="h-4 w-4" /> Remover peça
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
