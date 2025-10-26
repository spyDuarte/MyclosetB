import { Trash2, X, TrendingUp } from 'lucide-react';

export function ItemDetailModal({ open, item, onClose, onDelete, onUsage, loading }) {
  if (!open || !item) {
    return null;
  }

  const { name, category, color, season, image_url: imageUrl, tags = [], usage_count: usageCount, favorite } = item;

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja remover esta peça?')) {
      onDelete(item);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl md:flex-row">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="md:w-1/2">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full min-h-[18rem] w-full items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 text-5xl text-purple-400">
              👗
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-purple-500">{category}</span>
              <h3 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
                {name}
                {favorite ? (
                  <span className="rounded-full bg-pink-100 px-2 py-1 text-xs font-semibold text-pink-500">Favorito</span>
                ) : null}
              </h3>
            </div>
            <span className="h-10 w-10 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: color }} />
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-purple-50 px-4 py-3 text-sm text-purple-600">
            <TrendingUp className="h-4 w-4" />
            {usageCount}x usada • Estação: {season}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700">Tags</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.length ? (
                tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600">
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">Sem tags</span>
              )}
            </div>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onUsage(item)}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-pink-600 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-pink-300"
            >
              Usei hoje
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
              Remover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
