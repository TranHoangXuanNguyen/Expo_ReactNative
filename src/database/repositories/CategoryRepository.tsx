import { supabase } from '../../lib/supabaseClient'; 

export interface Category {
  id: number;
  name: string;
}

export const CategoryRepository = {
  // ... (Giữ nguyên hàm create và getAll cũ của bạn ở đây) ...

  create: async (name: string): Promise<number> => {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: name })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  },

  getAll: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true }); // Sắp xếp cho đẹp

    if (error) throw error;
    return data || [];
  },

  // --- THÊM MỚI ---
  
  /**
   * Cập nhật tên category
   */
  update: async (id: number, name: string): Promise<void> => {
    const { error } = await supabase
      .from('categories')
      .update({ name: name })
      .eq('id', id);

    if (error) {
      console.error('Lỗi khi update category:', error);
      throw error;
    }
  },

  /**
   * Xóa category
   */
  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Lỗi khi xóa category:', error);
      throw error;
    }
  }
};
