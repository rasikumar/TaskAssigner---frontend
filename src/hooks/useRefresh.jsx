import { useState } from "react";

const useRefresh = () => {
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleRefresh = () => setRefresh((prev) => !prev);

  return { refresh, toggleRefresh, loading, setLoading };
};

export default useRefresh;
