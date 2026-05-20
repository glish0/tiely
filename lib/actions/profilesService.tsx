
import { TProfile } from '@/types';
import { supabase } from '../config/supabase';

export const getProfile = async (userId: string): Promise<TProfile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};