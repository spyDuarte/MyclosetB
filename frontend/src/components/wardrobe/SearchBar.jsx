import { Search } from 'lucide-react';

export function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-500" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Busque por nome ou tags..."
        className="w-full rounded-2xl border border-purple-200 bg-white/90 pl-12 pr-4 py-3 text-sm text-slate-700 shadow focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
      />
    </div>
  );
}
