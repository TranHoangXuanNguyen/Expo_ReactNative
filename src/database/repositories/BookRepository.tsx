import { supabase } from '../../lib/supabaseClient'; // Import client Supabase

export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
}

export const BookRepository = {
  /**
   * Tạo một book mới và trả về ID của nó
   */
  create: async (title: string, author: string, categoryId: number): Promise<number> => {
    const { data, error } = await supabase
      .from('books')
      .insert({
        title: title,
        author: author,
        category_id: categoryId,     
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
   * Lấy tất cả books kèm theo tên category
   */
  getAll: async (): Promise<Book[]> => {
    const { data, error } = await supabase
      .from('books')
      .select(`
        id,
        title,
        author,
        categories ( name )  // <-- Phép thuật là ở đây!
      `);

    if (error) {
      console.error('Lỗi khi lấy books:', error);
      throw error;
    }

    // Supabase sẽ trả về data dạng:
    // [
    //   { id: 1, title: "...", author: "...", categories: { name: "Fiction" } },
    //   { id: 2, title: "...", author: "...", categories: null }
    // ]
    
    const mappedBooks: Book[] = (data || []).map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.categories ? book.categories.name : null, // "Làm phẳng" đối tượng
    }));

    return mappedBooks;
  },
};
