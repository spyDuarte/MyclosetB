import { useMemo } from 'react';
import { BarChart3, Heart, Shirt, Sparkles, TrendingUp, X } from 'lucide-react';

export function StatsModal({ open, onClose, items, looks }) {
  const stats = useMemo(() => {
    const totalItems = items.length;
    const favorites = items.filter((item) => item.favorite).length;
    const totalLooks = looks.length;
    const totalUsage = items.reduce((sum, item) => sum + (item.usage_count || 0), 0);

    const categoryCounts = items.reduce((accumulator, item) => {
      const category = item.category || 'Outros';
      accumulator[category] = (accumulator[category] || 0) + 1;
      return accumulator;
    }, {});

    const topUsed = [...items]
      .sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))
      .slice(0, 3);

    const recentItems = [...items]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    return { totalItems, favorites, totalLooks, totalUsage, categoryCounts, topUsed, recentItems };
  }, [items, looks]);

  if (!open) {
    return null;
  }

  const maxCategory = Math.max(...Object.values(stats.categoryCounts || { outros: 1 }), 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-400">Insights</p>
            <h2 className="text-3xl font-bold text-slate-900">Estatísticas do seu guarda-roupa</h2>
            <p className="text-sm text-slate-500">Acompanhe o desempenho das suas peças favoritas e descubra novas combinações.</p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 p-4 text-white shadow-xl">
            <BarChart3 className="h-8 w-8" />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <StatCard icon={Shirt} label="Total de peças" value={stats.totalItems} color="from-purple-500 to-purple-700" />
          <StatCard icon={Heart} label="Favoritos" value={stats.favorites} color="from-pink-500 to-pink-600" />
          <StatCard icon={Sparkles} label="Looks criados" value={stats.totalLooks} color="from-blue-500 to-blue-600" />
          <StatCard icon={TrendingUp} label="Usos totais" value={stats.totalUsage} color="from-green-500 to-green-600" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-purple-50/60 p-5 shadow-inner">
            <h3 className="mb-4 text-lg font-semibold text-purple-700">Peças por categoria</h3>
            <div className="space-y-3">
              {Object.entries(stats.categoryCounts).map(([category, count]) => (
                <div key={category}>
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                    <span>{category}</span>
                    <span>{count}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${Math.max((count / maxCategory) * 100, 10)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">Top 3 mais usadas</h3>
            <div className="space-y-4">
              {stats.topUsed.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-2xl bg-purple-50/60 p-3">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl bg-white shadow">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 text-2xl text-purple-400">
                        👗
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.category}</p>
                  </div>
                  <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">{item.usage_count || 0} usos</span>
                </div>
              ))}
              {stats.topUsed.length === 0 ? <p className="text-sm text-slate-500">Nenhuma peça registrada ainda.</p> : null}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Adicionadas recentemente</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {stats.recentItems.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 rounded-2xl bg-purple-50/60 p-3 text-center">
                <div className="h-24 overflow-hidden rounded-2xl bg-white shadow">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 text-2xl text-purple-400">
                      👗
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{item.name}</p>
                  <p className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))}
            {stats.recentItems.length === 0 ? <p className="text-sm text-slate-500">Sem peças cadastradas.</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-lg">
      <div className={`rounded-2xl bg-gradient-to-br ${color} p-4 text-white shadow-lg`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
