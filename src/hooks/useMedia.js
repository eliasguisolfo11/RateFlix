import { useEffect, useState } from 'react';

// Hook reutilizable para cargar listas de media (películas/series)
// recibe una función fetcher async que devuelve un array de items
const useMedia = (fetcher) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const list = await fetcher();
        if (mounted) setData(list);
      } catch (err) {
        if (mounted) setError(err?.message || 'Error al cargar datos');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [fetcher]);

  return { data, loading, error };
};

export default useMedia;
