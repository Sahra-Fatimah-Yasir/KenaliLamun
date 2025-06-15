import { useEffect, useState } from "react";
import { fetchGetAllJenisLamun } from "./api";
;
// Generic useFetch hook
const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setLoading(false);
    setError(null);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch]);

  return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;


// useFetchJenisLamunDetail Hook
export const useFetchJenisLamunDetail = (id: string | number | undefined) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getDetail = async () => {
      try {
        const allData = await fetchGetAllJenisLamun();
        const filtered = allData.find((item: any) => item.id.toString() === id?.toString());
        setData(filtered);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    if (id) getDetail(); // Only fetch if id is provided
  }, [id]); // Dependency array now correctly includes `id`

  return { data, loading, error };
};
