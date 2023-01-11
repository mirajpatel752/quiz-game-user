import { useEffect, useState, useRef } from "react";
export function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  const mountedRef = useRef(false);
  const timeRef = useRef(null);
  const cancel = () => window.clearTimeout(timeRef.current);
  useEffect(() => {
    cancel();
    timeRef.current = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
  }, [value]);
  useEffect(() => {
    mountedRef.current = true;
    return cancel();
  }, []);
  return [debouncedValue, cancel];
}
