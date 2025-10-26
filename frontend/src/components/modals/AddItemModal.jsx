import { useEffect, useState } from 'react';
import { Camera, Tag, X } from 'lucide-react';

const categories = ['Camisetas', 'Calças', 'Vestidos', 'Casacos', 'Sapatos', 'Acessórios'];
const seasons = ['Todas', 'Verão', 'Inverno', 'Primavera', 'Outono'];

export function AddItemModal({ open, onClose, onSave, loading }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [color, setColor] = useState('#9333ea');
  const [season, setSeason] = useState(seasons[0]);
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setName('');
      setCategory(categories[0]);
      setColor('#9333ea');
      setSeason(seasons[0]);
      setTags('');
      setFile(null);
      setPreviewUrl('');
      setError('');
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) {
      setFile(null);
      setPreviewUrl('');
      return;
    }

    if (!selected.type.startsWith('image/')) {
      setError('Envie apenas arquivos de imagem.');
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError('Selecione imagens de até 5MB.');
      return;
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setError('Informe o nome da peça.');
      return;
    }

    if (!color) {
      setError('Escolha uma cor.');
      return;
    }

    onSave({
      name: name.trim(),
      category,
      color,
      season,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      file
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="mb-1 text-2xl font-semibold text-slate-900">Adicionar peça</h2>
        <p className="mb-4 text-sm text-slate-500">Preencha os detalhes para cadastrar uma nova peça no seu guarda-roupa.</p>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Nome *</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm shadow focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="Ex.: Camisa social branca"
              required
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Categoria</label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm shadow focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Estação</label>
              <select
                value={season}
                onChange={(event) => setSeason(event.target.value)}
                className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm shadow focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
              >
                {seasons.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Cor *</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="h-12 w-20 cursor-pointer rounded-xl border border-purple-200"
              />
              <span className="rounded-full bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-600">
                {color.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Tags</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-500" />
              <input
                type="text"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                className="w-full rounded-xl border border-purple-200 bg-white py-3 pl-11 pr-4 text-sm shadow focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="casual, trabalho, festa"
              />
            </div>
            <p className="text-xs text-slate-400">Separe as tags por vírgula.</p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Foto</label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/60 px-6 py-10 text-center text-purple-500 transition hover:border-purple-400 hover:bg-purple-50">
              <Camera className="h-8 w-8" />
              <span className="text-sm font-semibold">Clique para fazer upload</span>
              <span className="text-xs text-purple-400">JPG, PNG ou WEBP até 5MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
            {previewUrl ? (
              <img src={previewUrl} alt="Pré-visualização" className="h-48 w-full rounded-2xl object-cover" />
            ) : null}
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
              className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-purple-400"
            >
              {loading ? 'Salvando...' : 'Adicionar peça'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
