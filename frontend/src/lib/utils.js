export const categoryOptions = [
  { value: 'all', label: 'Todas as peças', icon: '🧾' },
  { value: 'Camisetas', label: 'Camisetas', icon: '👕' },
  { value: 'Calças', label: 'Calças', icon: '👖' },
  { value: 'Vestidos', label: 'Vestidos', icon: '👗' },
  { value: 'Casacos', label: 'Casacos', icon: '🧥' },
  { value: 'Sapatos', label: 'Sapatos', icon: '👟' },
  { value: 'Acessórios', label: 'Acessórios', icon: '🕶️' }
];

export const seasonOptions = ['Todas', 'Verão', 'Inverno', 'Primavera', 'Outono'];

export const parseTags = (tagsString) =>
  tagsString
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

export const downloadBlob = (content, fileName) => {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const filterItems = (items, { selectedCategory, searchTerm }) => {
  return items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch = normalizedSearch
      ? item.name.toLowerCase().includes(normalizedSearch) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(normalizedSearch))
      : true;
    return matchesCategory && matchesSearch;
  });
};

export const calcStats = (items, looks) => {
  const totalPieces = items.length;
  const favorites = items.filter((item) => item.favorite).length;
  const totalLooks = looks.length;
  const totalUsage = items.reduce((acc, item) => acc + (item.usage_count ?? 0), 0);

  const byCategory = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const topUsed = [...items]
    .sort((a, b) => (b.usage_count ?? 0) - (a.usage_count ?? 0))
    .slice(0, 3);

  const recentItems = [...items]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return {
    totalPieces,
    favorites,
    totalLooks,
    totalUsage,
    byCategory,
    topUsed,
    recentItems
  };
};
