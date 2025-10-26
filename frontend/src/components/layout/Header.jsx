import { BarChart3, LogOut, Shirt } from 'lucide-react';

export const Header = ({ onOpenStats, onLogout, mode, setMode }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg">
            <Shirt className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-slate-900">
              Closet Inteligente
            </h1>
            <p className="text-xs text-slate-500">Organize seus looks com estilo</p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 rounded-full bg-white/60 p-1 text-sm font-semibold text-slate-500 shadow-inner sm:flex">
          <button
            type="button"
            className={`rounded-full px-4 py-1.5 transition ${
              mode === 'wardrobe'
                ? 'bg-primary-600 text-white shadow'
                : 'hover:bg-slate-100'
            }`}
            onClick={() => setMode('wardrobe')}
          >
            Peças
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-1.5 transition ${
              mode === 'looks' ? 'bg-secondary-600 text-white shadow' : 'hover:bg-slate-100'
            }`}
            onClick={() => setMode('looks')}
          >
            Looks
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenStats}
            className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600 shadow transition hover:-translate-y-0.5 hover:bg-white"
          >
            <BarChart3 className="h-4 w-4" />
            Estatísticas
          </button>
          <button
            onClick={onLogout}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 shadow transition hover:-translate-y-0.5 hover:bg-red-100"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
