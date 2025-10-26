import { Download, Plus, Search, Upload } from 'lucide-react';

export const ActionBar = ({
  searchTerm,
  setSearchTerm,
  onOpenAdd,
  onOpenLook,
  onExport,
  onImport
}) => {
  const onFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) onImport(file);
    event.target.value = '';
  };

  return (
    <div className="sticky top-[4.5rem] z-20 border-b border-white/40 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Busque por nome ou tags"
            className="w-full rounded-xl border border-transparent bg-white/80 py-3 pl-10 pr-4 text-sm shadow-inner transition focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-primary-600/90"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </button>
          <button
            onClick={onOpenLook}
            className="flex items-center gap-2 rounded-xl bg-secondary-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-secondary-600/90"
          >
            Criar Look
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-2 rounded-xl bg-blue-600/90 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-blue-600"
          >
            <Download className="h-4 w-4" />
            Exportar
          </button>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-green-600/90">
            <Upload className="h-4 w-4" />
            Importar
            <input type="file" accept="application/json" className="hidden" onChange={onFileChange} />
          </label>
        </div>
      </div>
    </div>
  );
};
