import { useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  const removeValue = () => {
    setStoredValue(initialValue);
    localStorage.removeItem(key);
  };

  return [storedValue, setValue, removeValue];
}

export function useLoggedIn() {
  const [isLoggedIn, setLoggedIn, removeLoggedIn] = useLocalStorage(
    "logged_in",
    false,
  );
  return { isLoggedIn, setLoggedIn, removeLoggedIn };
}
