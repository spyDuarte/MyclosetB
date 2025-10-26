import { Heart } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const ItemCard = ({
  item,
  onOpen,
  onToggleFavorite,
  onSelect,
  isSelected,
  selectionEnabled
}) => {
  return (
    <div
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-white/90 shadow transition duration-200 hover:-translate-y-1 hover:shadow-xl ${
        selectionEnabled && isSelected ? 'ring-4 ring-primary-600' : ''
      }`}
      onClick={() => (selectionEnabled ? onSelect(item.id) : onOpen(item))}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className={`h-full w-full object-cover transition duration-200 ${
              selectionEnabled && isSelected ? 'scale-105 opacity-90' : 'group-hover:scale-105'
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            Sem foto
          </div>
        )}
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(item.id, item.favorite);
          }}
          className={`absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-110 ${
            item.favorite ? 'text-red-500' : 'text-slate-400'
          }`}
        >
          <Heart className={`h-5 w-5 ${item.favorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
        <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-xs font-semibold text-slate-700 shadow">
          <span
            className="mr-1 h-3 w-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          {item.category.slice(0, 3)}
        </span>
        {selectionEnabled && (
          <div
            className={`absolute inset-0 bg-primary-600/40 backdrop-blur-sm transition ${
              isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <div className="flex h-full items-center justify-center text-lg font-semibold text-white">
              {isSelected ? 'Selecionada' : 'Selecionar'}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4 py-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
          <p className="text-xs uppercase tracking-widest text-slate-400">
            {item.season} • criado em {formatDate(item.created_at)}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="rounded-full bg-primary-600/10 px-2 py-1 text-primary-600">
            {item.usage_count ?? 0}x usado
          </span>
          {item.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary-600/10 px-2 py-1 text-primary-600"
            >
              #{tag}
            </span>
          ))}
          {item.tags && item.tags.length > 3 && (
            <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-500">
              +{item.tags.length - 3}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen(item);
          }}
          className="mt-auto w-full rounded-2xl bg-slate-900/90 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
        >
          Ver detalhes
        </button>
      </div>
    </div>
  );
};
