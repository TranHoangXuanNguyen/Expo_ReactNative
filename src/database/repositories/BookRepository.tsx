import { supabase } from '../../lib/supabaseClient';

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;   
  category: string; 
  description: string;  
  imageUrl: string;   
 }

export const BookRepository = {
  /**
   * Tạo một book mới
   */
  create: async (title: string, author: string, price: number, categoryId: number, description: string, img: string): Promise<number> => {
    const { data, error } = await supabase
      .from('books')
      .insert({
        title,
        author,
        price,
        category_id: categoryId,
        description: description, // [MỚI]
        img: img,                 // [MỚI]
      })
      .select('id')
      .single();

    if (error) {
      console.error('Lỗi khi tạo book:', error);
      throw error;
    }
    return data.id;
  },

  /**
   * Lấy tất cả books
   */
  getAll: async (): Promise<Book[]> => {
    const { data, error } = await supabase
      .from('books')
      .select(`
        id,
        title,
        author,
        price,
        category_id,
        description,    
        img,            
        categories ( name ) 
      `); // Lưu ý: Không để dấu phẩy cuối cùng

    if (error) {
      console.error('❌ LỖI SUPABASE:', error.message); 
      throw error;
    }

    // console.log('✅ Dữ liệu lấy về:', data); 

    const mappedBooks: Book[] = (data || []).map((book: any) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,      
      category: book.categories?.name || 'Chưa phân loại',
      description: book.description || 'Chưa có mô tả cho sách này.', // [MỚI] Fallback nếu null
      imageUrl: book.img || null, // [MỚI] Lấy link ảnh từ cột img
    }));

    return mappedBooks;
  },
};
