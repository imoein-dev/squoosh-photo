import { useState, useCallback, useEffect } from 'react';

export function useObjectUrl() {
  const [url, setUrl] = useState<string | null>(null);

  const setNewUrl = useCallback((file: File | Blob | null) => {
    setUrl((prevUrl) => {
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
      }
      return file ? URL.createObjectURL(file) : null;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setUrl((prevUrl) => {
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }
        return null;
      });
    };
  }, []);

  return [url, setNewUrl] as const;
}
