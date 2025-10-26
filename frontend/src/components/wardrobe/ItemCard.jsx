import { Heart } from 'lucide-react';

export function ItemCard({ item, onSelect, onToggleFavorite }) {
  const { name, category, color, image_url: imageUrl, favorite, tags = [], usage_count: usageCount } = item;

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white/95 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative aspect-square overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 text-4xl text-purple-400">
            👗
          </div>
        )}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow">
            <span className="text-sm font-semibold text-purple-500">{category.charAt(0)}</span>
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(item);
            }}
            className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-500 transition hover:scale-110 hover:text-red-500 ${
              favorite ? 'text-red-500' : ''
            }`}
            aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>
        <span
          className="absolute right-3 top-3 h-8 w-8 rounded-full border-2 border-white shadow-lg"
          style={{ backgroundColor: color || '#fff' }}
        />
      </div>

      <div className="space-y-2 p-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{name}</h3>
          <p className="text-xs font-medium uppercase tracking-wide text-purple-500">{category}</p>
        </div>
        <p className="text-sm text-slate-500">{usageCount}x usado</p>
        <div className="flex flex-wrap gap-2">
          {tags.length === 0 ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">Sem tags</span>
          ) : (
            tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                #{tag}
              </span>
            ))
          )}
          {tags.length > 3 ? (
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-600">+{tags.length - 3}</span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
