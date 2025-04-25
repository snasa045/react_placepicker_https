import { useEffect, useState } from "react";

export function useFetch(fetchFn, inititalState) {
  const [fetchedData, setFetchedData] = useState(inititalState);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFn();

        setFetchedData(() => [...data]);
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch data, please try again later!",
        });
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return {
    fetchedData,
    setFetchedData,
    error,
    setError,
    isLoading,
  }
}
