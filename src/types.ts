export type ShelfId = 'want-to-read' | 'currently-reading' | 'read';

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  year: number;
}

export interface BookState {
  shelf: ShelfId | null;
  rating: number;
}

export type BookshelfState = Record<string, BookState>;
