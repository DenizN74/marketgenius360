import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Store = Database['public']['Tables']['stores']['Row'];

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStores(data || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createStore = async (name: string, description?: string) => {
    const { error } = await supabase.from('stores').insert([
      {
        name,
        description,
      },
    ]);

    if (error) throw error;
    await fetchStores();
  };

  const updateStore = async (id: string, updates: Partial<Store>) => {
    const { error } = await supabase
      .from('stores')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await fetchStores();
  };

  const deleteStore = async (id: string) => {
    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchStores();
  };

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return {
    stores,
    loading,
    createStore,
    updateStore,
    deleteStore,
  };
}