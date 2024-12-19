import { useState, useEffect } from "react";

const useAutoRefresh = (fetchData) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const intervalTime = 100; // Set default interval time here

  useEffect(() => {
    setLoading(true);
    const interval = setInterval(async () => {
      try {
        const response = await fetchData();
        setData(response.data); // Adjust based on your data structure
      } catch (error) {
        console.error("Error refreshing data:", error);
      } finally {
        setLoading(false);
      }
    }, intervalTime);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [fetchData]); // No need for intervalTime in dependencies anymore

  return { data, loading };
};

export default useAutoRefresh;
