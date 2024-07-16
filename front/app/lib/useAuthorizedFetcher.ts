import { useCallback } from "react";
import useSWR from "swr";

export const useAuthorizedFetcher = () => {
  const { data: token } = useSWR<string>("/api/auth-token", (url: string) =>
    fetch(url).then((r) => r.json())
  );

  const Authorization = `Bearer ${token}`;
  const fetcher = useCallback(
    (url: string) =>
      fetch(url, { headers: { Authorization } }).then((r) => r.json()),
    [token]
  );

  return { fetcher, token, Authorization };
};
