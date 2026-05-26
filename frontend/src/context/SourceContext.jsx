import { createContext, useContext, useState, useCallback } from 'react';
import { getSources as fetchSources, deleteSource as apiDelete } from '../services/api';

const SourceContext = createContext(null);

/**
 * Global provider for source state (indexed knowledge bases).
 * Wraps the entire app so any component can access sources.
 */
export function SourceProvider({ children }) {
  const [sources, setSources] = useState([]);
  const [isLoadingSources, setIsLoadingSources] = useState(false);

  /** Fetch sources from the backend and update state */
  const loadSources = useCallback(async () => {
    setIsLoadingSources(true);
    try {
      const data = await fetchSources();
      setSources(data);
    } catch (err) {
      console.error('Failed to load sources:', err);
    } finally {
      setIsLoadingSources(false);
    }
  }, []);

  /** Optimistically add a newly ingested source to the list */
  const addSource = useCallback((source) => {
    setSources((prev) => [source, ...prev]);
  }, []);

  /** Delete a source from backend and remove from state */
  const removeSource = useCallback(async (id) => {
    await apiDelete(id);
    setSources((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return (
    <SourceContext.Provider value={{ sources, isLoadingSources, loadSources, addSource, removeSource }}>
      {children}
    </SourceContext.Provider>
  );
}

/** Hook to access source context */
export function useSources() {
  const ctx = useContext(SourceContext);
  if (!ctx) throw new Error('useSources must be used within SourceProvider');
  return ctx;
}
