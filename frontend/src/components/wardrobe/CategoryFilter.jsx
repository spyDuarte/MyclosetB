const categories = [
  { id: 'all', label: 'Todas', icon: '✨' },
  { id: 'Camisetas', label: 'Camisetas', icon: '👕' },
  { id: 'Calças', label: 'Calças', icon: '👖' },
  { id: 'Vestidos', label: 'Vestidos', icon: '👗' },
  { id: 'Casacos', label: 'Casacos', icon: '🧥' },
  { id: 'Sapatos', label: 'Sapatos', icon: '👟' },
  { id: 'Acessórios', label: 'Acessórios', icon: '🕶️' }
];

export function CategoryFilter({ selected, onChange }) {
  return (
    <div className="rounded-3xl bg-white/90 p-4 shadow-lg">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const isActive = selected === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow ${
                isActive
                  ? 'border-purple-500 bg-purple-600 text-white shadow-lg'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-purple-200'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
