import { Trash2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const LookCard = ({ look, items, onDelete }) => {
  const pieces = look.item_ids
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-white/90 p-6 shadow transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{look.name}</h3>
          <p className="text-xs uppercase tracking-widest text-slate-400">
            {look.occasion || 'Ocasião livre'} • criado em {formatDate(look.created_at)}
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Deseja remover este look?')) {
              onDelete(look.id);
            }
          }}
          className="rounded-full bg-red-50 p-2 text-red-500 opacity-0 transition hover:-translate-y-0.5 hover:bg-red-100 group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {pieces.map((piece) => (
          <div
            key={piece.id}
            className="aspect-square overflow-hidden rounded-2xl border border-slate-100 bg-slate-50"
          >
            {piece.image_url ? (
              <img src={piece.image_url} alt={piece.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                {piece.name}
              </div>
            )}
          </div>
        ))}
        {pieces.length < 9 &&
          Array.from({ length: 9 - pieces.length }).map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="aspect-square rounded-2xl border border-dashed border-slate-200"
            />
          ))}
      </div>
    </div>
  );
};
