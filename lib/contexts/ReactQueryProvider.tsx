'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import React, { useState, useEffect } from 'react';

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60, // 1 min par défaut
          gcTime: 1000 * 60 * 60, // 1h dans le cache
          refetchOnWindowFocus: true,
          refetchOnMount: 'always',
          retry: 1,
        },
        mutations: {
          retry: 0, // Pas de retry pour les mutations
        },
      },
    })
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localStoragePersister = createSyncStoragePersister({
        storage: window.localStorage,
      });

      persistQueryClient({
        queryClient,
        persister: localStoragePersister,
        maxAge: 1000 * 60 * 60 * 2, // 2h de persistance
        dehydrateOptions: {
          shouldDehydrateQuery: query => query.state.status === 'success',
        },
      });
    }
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
