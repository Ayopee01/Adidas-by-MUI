import { useState, useMemo } from 'react';

export default function usePatternPagination(products, pattern) {
  const categories = Object.keys(pattern);
  const [page, setPage] = useState(0);

  // สองแบบ: แบบ group (All) กับ flat (Promotion/หมวดเดียว)
  const grouped = useMemo(() => {
    if (categories.length === 1) return null;
    const res = {};
    categories.forEach(cat => {
      res[cat] = products.filter(p => p.category === cat);
    });
    return res;
  }, [products, pattern, categories]);

  const maxPage = useMemo(() => {
    if (categories.length === 1) {
      const perPage = pattern[categories[0]];
      return Math.ceil(products.length / perPage);
    }
    return Math.max(
      ...categories.map(cat => Math.ceil((grouped?.[cat]?.length || 0) / pattern[cat]))
    );
  }, [grouped, pattern, categories, products.length]);

  const pagedItems = useMemo(() => {
    if (categories.length === 1) {
      const perPage = pattern[categories[0]];
      const start = page * perPage;
      return products.slice(start, start + perPage);
    }
    // All แบบเดิม
    let result = [];
    categories.forEach(cat => {
      const start = page * pattern[cat];
      const end = start + pattern[cat];
      result = result.concat(grouped?.[cat]?.slice(start, end) || []);
    });
    result.sort((a, b) => categories.indexOf(a.category) - categories.indexOf(b.category));
    return result;
  }, [page, grouped, pattern, categories, products]);

  const next = () => setPage(p => Math.min(maxPage - 1, p + 1));
  const prev = () => setPage(p => Math.max(0, p - 1));

  return {
    page,
    setPage,
    maxPage,
    pagedItems,
    next,
    prev,
  };
}
