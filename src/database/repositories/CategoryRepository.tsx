// CategoryRepository.ts
import { supabase } from '../../lib/supabaseClient'; 

// Interface (giữ nguyên)
export interface Category {
  id: number;
  name: string;
}

export const CategoryRepository = {
  /**
   * Tạo một category mới và trả về ID của nó
   */
  create: async (name: string): Promise<number> => {
    // Thay thế "new Promise" và "db.transaction" bằng async/await
    const { data, error } = await supabase
      .from('categories') // Tên bảng
      .insert({ name: name }) // Dữ liệu cần chèn
      .select('id') // Yêu cầu trả về cột 'id'
      .single(); // Vì ta biết chỉ chèn 1 hàng

    if (error) {
      console.error('Lỗi khi tạo category:', error);
      throw error;
    }

    return data.id; // Trả về ID
  },

  /**
   * Lấy tất cả các categories
   */
  getAll: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*'); // Tương đương 'SELECT * FROM categories'

    if (error) {
      console.error('Lỗi khi lấy categories:', error);
      throw error;
    }

    return data || []; // Trả về mảng data, hoặc mảng rỗng nếu không có
  },
};
