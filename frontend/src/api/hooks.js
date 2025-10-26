import { useCallback, useEffect, useState } from 'react';
import { fetchDashboard, fetchItems } from './client.js';

export function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchDashboard()
      .then((response) => {
        if (mounted) {
          setData(response);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}

export function useItems(params = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const stableParams = JSON.stringify(params);

  const load = useCallback(() => {
    setLoading(true);
    fetchItems(params)
      .then((response) => {
        setData(response.items || []);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [stableParams]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
