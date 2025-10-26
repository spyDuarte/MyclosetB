import { useEffect, useState } from 'react';
import { X, Check } from 'lucide-react';

export function CreateLookModal({
  open,
  onClose,
  onCreate,
  items,
  selectedItems,
  onToggleSelect,
  loading
}) {
  const [name, setName] = useState('');
  const [occasion, setOccasion] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setName('');
      setOccasion('');
      setError('');
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setError('Informe um nome para o look.');
      return;
    }

    if (!selectedItems.length) {
      setError('Selecione ao menos uma peça para o look.');
      return;
    }

    onCreate({ name: name.trim(), occasion: occasion.trim(), itemIds: selectedItems });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="mb-1 text-2xl font-semibold text-slate-900">Criar look</h2>
        <p className="mb-4 text-sm text-slate-500">Selecione as peças e nomeie seu look especial.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Nome *</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm shadow focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="Look casual de sexta"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Ocasião</label>
              <input
                type="text"
                value={occasion}
                onChange={(event) => setOccasion(event.target.value)}
                className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm shadow focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="Trabalho, festa, viagem..."
              />
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-700">Selecione as peças</p>
            <div className="grid max-h-80 grid-cols-2 gap-3 overflow-y-auto pr-2 md:grid-cols-3">
              {items.map((item) => {
                const isSelected = selectedItems.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onToggleSelect(item.id)}
                    className={`group relative overflow-hidden rounded-2xl border-2 transition hover:-translate-y-1 hover:shadow-xl ${
                      isSelected ? 'border-pink-500 shadow-xl' : 'border-transparent shadow'
                    }`}
                  >
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="h-36 w-full object-cover" />
                    ) : (
                      <div className="flex h-36 w-full items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 text-3xl text-purple-400">
                        👗
                      </div>
                    )}
                    <div className="absolute inset-0 bg-purple-600/0 transition group-hover:bg-purple-600/30" />
                    {isSelected ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-purple-600/50 text-white">
                        <Check className="h-8 w-8" />
                      </div>
                    ) : null}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-left text-sm font-semibold text-white">
                      {item.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-pink-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-pink-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-pink-300"
            >
              {loading ? 'Criando...' : 'Criar look'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
