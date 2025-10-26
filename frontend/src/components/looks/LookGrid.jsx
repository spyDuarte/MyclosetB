import { LookCard } from './LookCard';

export const LookGrid = ({ looks, items, onDelete }) => {
  if (!looks.length) {
    return (
      <div className="mx-auto mt-12 max-w-3xl rounded-3xl bg-white/70 p-8 text-center shadow-lg">
        <h3 className="text-xl font-semibold text-slate-900">Nenhum look criado</h3>
        <p className="mt-2 text-sm text-slate-500">
          Combine suas peças favoritas para montar looks incríveis para cada ocasião.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 grid w-full max-w-6xl gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {looks.map((look) => (
        <LookCard key={look.id} look={look} items={items} onDelete={onDelete} />
      ))}
    </div>
  );
};
