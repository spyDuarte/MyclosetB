import { useEffect, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { categoryOptions, parseTags, seasonOptions } from '../../lib/utils';

const defaultState = {
  name: '',
  category: 'Camisetas',
  color: '#9333ea',
  season: 'Todas',
  tags: '',
  image: null
};

export const AddItemModal = ({ open, onClose, onSubmit, uploading, uploadError, onResetUpload }) => {
  const [form, setForm] = useState(defaultState);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({ name: '', color: '' });

  useEffect(() => {
    if (!open) {
      setForm(defaultState);
      setPreview('');
      setErrors({ name: '', color: '' });
      onResetUpload?.();
    }
  }, [open, onResetUpload]);

  if (!open) return null;

  const validate = () => {
    const nextErrors = { name: '', color: '' };
    let valid = true;

    if (!form.name.trim()) {
      nextErrors.name = 'Informe o nome da peça.';
      valid = false;
    }

    if (!form.color) {
      nextErrors.color = 'Escolha uma cor.';
      valid = false;
    }

    setErrors(nextErrors);
    return valid;
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name,
      category: form.category,
      color: form.color,
      season: form.season,
      tags: parseTags(form.tags)
    };

    onSubmit(payload, form.image);
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

        <h2 className="text-2xl font-semibold text-slate-900">Adicionar nova peça</h2>
        <p className="mt-1 text-sm text-slate-500">
          Preencha as informações abaixo para cadastrar a peça no seu guarda-roupa digital.
        </p>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Nome*</label>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm shadow-inner focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20 ${
                errors.name ? 'border-red-400' : 'border-slate-200'
              }`}
              placeholder="Ex: Camiseta roxa favorita"
              required
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Categoria</label>
            <select
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
            >
              {categoryOptions
                .filter((option) => option.value !== 'all')
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Estação</label>
            <select
              value={form.season}
              onChange={(event) => setForm((prev) => ({ ...prev, season: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
            >
              {seasonOptions.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Cor*</label>
            <input
              type="color"
              value={form.color}
              onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))}
              className="mt-1 h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white shadow-inner"
              required
            />
            {errors.color && <p className="mt-1 text-xs text-red-500">{errors.color}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Tags</label>
            <input
              value={form.tags}
              onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
              placeholder="casual, trabalho, festa"
            />
            <p className="mt-1 text-xs text-slate-400">Separe as tags por vírgula.</p>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Foto</label>
            <label className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-6 text-center transition hover:border-primary-600 hover:bg-primary-50">
              <Camera className="h-8 w-8 text-primary-600" />
              <span className="mt-2 text-sm font-semibold text-primary-600">
                Clique para enviar uma imagem
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              {preview && (
                <img src={preview} alt="Pré-visualização" className="mt-4 h-40 w-40 rounded-2xl object-cover shadow-lg" />
              )}
            </label>
            {uploadError && <p className="mt-1 text-xs text-red-500">{uploadError}</p>}
          </div>

          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-primary-600/90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={uploading}
            >
              {uploading ? 'Salvando...' : 'Adicionar peça'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
