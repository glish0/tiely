// hooks/useProfile.ts
import { getProfile } from '@/lib/actions/profilesService';
import { useAuth } from '@/lib/contexts/AuthContexte';
import { useQuery } from '@tanstack/react-query';


export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profiles', user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user, // 🔥 évite appel si pas connecté
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: 1,
  });
};