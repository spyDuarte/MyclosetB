import { categoryOptions } from '../../lib/utils';

export const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <div className="mx-auto mt-6 max-w-6xl">
      <div className="rounded-2xl bg-white/80 p-4 shadow-lg">
        <h2 className="mb-3 text-sm font-semibold text-slate-500">Filtrar por categoria</h2>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setSelectedCategory(category.value)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === category.value
                  ? 'bg-primary-600 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:-translate-y-0.5 hover:bg-slate-200'
              }`}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
