import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export const CreateLookModal = ({
  open,
  onClose,
  items,
  selectedItems,
  toggleSelectedItem,
  onSubmit
}) => {
  const [form, setForm] = useState({ name: '', occasion: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setForm({ name: '', occasion: '' });
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError('Nome do look é obrigatório.');
      return;
    }
    if (!selectedItems.length) {
      setError('Selecione pelo menos uma peça.');
      return;
    }

    onSubmit({ ...form, item_ids: selectedItems });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:scale-110 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-semibold text-slate-900">Criar novo look</h2>
        <p className="mt-1 text-sm text-slate-500">
          Escolha as peças que combinam entre si e salve para consultar sempre que quiser.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700">Nome*</label>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                placeholder="Look casual de sexta"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Ocasião</label>
              <input
                value={form.occasion}
                onChange={(event) => setForm((prev) => ({ ...prev, occasion: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                placeholder="Trabalho, festa, viagem..."
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700">Selecione as peças</h3>
            <p className="text-xs text-slate-400">Clique nas peças abaixo para adicioná-las ao look.</p>
            <div className="mt-4 grid max-h-72 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleSelectedItem(item.id)}
                  className={`group relative aspect-square overflow-hidden rounded-2xl border-2 transition ${
                    selectedItems.includes(item.id)
                      ? 'border-primary-600'
                      : 'border-transparent hover:border-primary-200'
                  }`}
                >
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-50 text-xs text-slate-400">
                      {item.name}
                    </div>
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-black/40 px-2 py-1 text-xs font-semibold text-white">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-secondary-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-secondary-600/90"
            >
              Salvar look
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
