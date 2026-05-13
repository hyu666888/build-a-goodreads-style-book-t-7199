import type { Book, BookState, ShelfId } from '../types';
import { BookCard } from './BookCard';

interface ShelfConfig {
  label: string;
  icon: string;
  headerClass: string;
  badgeClass: string;
  emptyText: string;
}

const SHELF_CONFIG: Record<ShelfId, ShelfConfig> = {
  'want-to-read': {
    label: 'Want to Read',
    icon: '🔖',
    headerClass: 'text-sage-dark border-sage',
    badgeClass: 'bg-sage text-cream',
    emptyText: 'No books here yet — browse the library below to add some.',
  },
  'currently-reading': {
    label: 'Currently Reading',
    icon: '📖',
    headerClass: 'text-burgundy border-burgundy',
    badgeClass: 'bg-burgundy text-cream',
    emptyText: 'Nothing in progress — pick a book and dive in.',
  },
  read: {
    label: 'Read',
    icon: '✓',
    headerClass: 'text-warm-700 border-warm-400',
    badgeClass: 'bg-warm-700 text-cream',
    emptyText: "Mark a book as read and it'll appear here.",
  },
};

interface ShelfSectionProps {
  shelfId: ShelfId;
  books: Book[];
  states: Record<string, BookState>;
  onBookClick: (bookId: string) => void;
}

export function ShelfSection({ shelfId, books, states, onBookClick }: ShelfSectionProps) {
  const config = SHELF_CONFIG[shelfId];
  const shelfBooks = books.filter((b) => states[b.id]?.shelf === shelfId);

  return (
    <section className="mb-8">
      <div className={`flex items-center gap-3 mb-4 pb-2 border-b-2 ${config.headerClass}`}>
        <span className="text-lg">{config.icon}</span>
        <h2 className={`font-display text-xl font-semibold ${config.headerClass}`}>
          {config.label}
        </h2>
        <span
          className={`ml-auto text-xs font-semibold font-sans px-2.5 py-1 rounded-full ${config.badgeClass}`}
        >
          {shelfBooks.length}
        </span>
      </div>

      {shelfBooks.length === 0 ? (
        <p className="text-warm-400 text-sm font-sans italic py-4 text-center">{config.emptyText}</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
          {shelfBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              state={states[book.id] ?? { shelf: null, rating: 0 }}
              onClick={() => onBookClick(book.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
