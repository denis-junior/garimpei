import { useState, useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions<T> {
  data: T[];
  hasMore: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export function useInfiniteScroll<T>({
  data,
  hasMore,
  setPage,
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>([]);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    if (data) {
      setItems((prev) => {
        return [...prev, ...data];
      });
    }
  }, [data]);

  return {
    items,
    lastElementRef,
  };
}
