import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import { toast } from 'react-hot-toast';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

interface UseProductsOptions {
  storeId: string;
  limit?: number;
  page?: number;
}

export function useProducts({ storeId, limit = 10, page = 1 }: UseProductsOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get total count
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', storeId);

      if (countError) throw countError;
      setTotalCount(count || 0);

      // Get paginated products
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [storeId, limit, page]);

  const createProduct = async (product: ProductInsert) => {
    try {
      const { error } = await supabase
        .from('products')
        .insert([product]);

      if (error) throw error;
      toast.success('Product created successfully');
      await fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: ProductUpdate) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success('Product updated successfully');
      await fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Product deleted successfully');
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    createProduct,
    updateProduct,
    deleteProduct,
  };
}