import { BarChart3, Heart, Layers, Shirt, TrendingUp, X } from 'lucide-react';
import { formatDate } from '../../lib/utils';

const summaryCards = (stats) => [
  {
    label: 'Total de peças',
    value: stats.totalPieces,
    icon: <Shirt className="h-6 w-6" />,
    color: 'bg-purple-500/10 text-purple-600'
  },
  {
    label: 'Favoritos',
    value: stats.favorites,
    icon: <Heart className="h-6 w-6" />,
    color: 'bg-pink-500/10 text-pink-600'
  },
  {
    label: 'Looks criados',
    value: stats.totalLooks,
    icon: <Layers className="h-6 w-6" />,
    color: 'bg-blue-500/10 text-blue-600'
  },
  {
    label: 'Usos totais',
    value: stats.totalUsage,
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'bg-green-500/10 text-green-600'
  }
];

export const StatsModal = ({ open, onClose, stats }) => {
  if (!open) return null;

  const cards = summaryCards(stats);
  const categories = Object.entries(stats.byCategory);
  const maxCategory = categories.reduce((max, [, value]) => Math.max(max, value), 0) || 1;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:scale-110 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Estatísticas avançadas</h2>
            <p className="text-sm text-slate-500">
              Acompanhe o desempenho do seu guarda-roupa e descubra suas peças mais amadas.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className={`rounded-3xl border border-white/60 bg-gradient-to-br from-white to-slate-50 p-4 shadow-inner ${card.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  {card.label}
                </span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-current shadow`}>
                  {card.icon}
                </div>
              </div>
              <p className="mt-3 text-3xl font-display font-bold text-slate-900">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white/80 p-5 shadow-inner">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              Peças por categoria
            </h3>
            <div className="mt-4 space-y-3">
              {categories.length ? (
                categories.map(([category, value]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                      <span>{category}</span>
                      <span>{value}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                        style={{ width: `${(value / maxCategory) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Sem dados suficientes.</p>
              )}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl bg-white/80 p-5 shadow-inner">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Top 3 peças mais usadas
              </h3>
              <div className="mt-4 space-y-3">
                {stats.topUsed.length ? (
                  stats.topUsed.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-white/60 p-3 shadow">
                      <div className="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-slate-400">
                            {item.name}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.category}</p>
                      </div>
                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600">
                        {item.usage_count ?? 0} usos
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Ainda não há peças com uso registrado.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white/80 p-5 shadow-inner">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Adições recentes
              </h3>
              <div className="mt-4 space-y-3">
                {stats.recentItems.length ? (
                  stats.recentItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white/60 p-3 shadow">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-400">{formatDate(item.created_at)}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600">
                        {item.category}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Nenhuma peça adicionada recentemente.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
