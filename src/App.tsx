import { useState, useCallback } from 'react';
import { BOOKS } from './data/books';
import type { BookshelfState, ShelfId } from './types';
import { ShelfSection } from './components/ShelfSection';
import { BookCard } from './components/BookCard';
import { BookModal } from './components/BookModal';

const STORAGE_KEY = 'my-bookshelf-v1';

function loadState(): BookshelfState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state: BookshelfState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const DEFAULT_STATE: { shelf: ShelfId | null; rating: number } = { shelf: null, rating: 0 };

export default function App() {
  const [bookshelf, setBookshelf] = useState<BookshelfState>(loadState);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedBook = selectedBookId ? BOOKS.find((b) => b.id === selectedBookId) ?? null : null;
  const selectedState = selectedBookId ? (bookshelf[selectedBookId] ?? DEFAULT_STATE) : DEFAULT_STATE;

  const unshelfed = BOOKS.filter((b) => !bookshelf[b.id]?.shelf);

  const q = searchQuery.trim().toLowerCase();
  const filteredUnshelfed = q
    ? unshelfed.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      )
    : unshelfed;

  const updateBook = useCallback(
    (bookId: string, patch: Partial<typeof DEFAULT_STATE>) => {
      setBookshelf((prev) => {
        const next = {
          ...prev,
          [bookId]: { ...(prev[bookId] ?? DEFAULT_STATE), ...patch },
        };
        saveState(next);
        return next;
      });
    },
    []
  );

  const handleShelfChange = useCallback(
    (shelf: ShelfId | null) => {
      if (!selectedBookId) return;
      updateBook(selectedBookId, {
        shelf,
        rating: shelf !== 'read' ? 0 : (bookshelf[selectedBookId]?.rating ?? 0),
      });
    },
    [selectedBookId, bookshelf, updateBook]
  );

  const handleRatingChange = useCallback(
    (rating: number) => {
      if (!selectedBookId) return;
      updateBook(selectedBookId, { rating });
    },
    [selectedBookId, updateBook]
  );

  const totalRead = BOOKS.filter((b) => bookshelf[b.id]?.shelf === 'read').length;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-cream-dark border-b border-warm-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">📚</span>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-warm-900 leading-none">
              My Bookshelf
            </h1>
            <p className="font-sans text-xs text-warm-600 mt-0.5">
              {totalRead} book{totalRead !== 1 ? 's' : ''} read · {BOOKS.length} in library
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        {/* Three shelves */}
        <ShelfSection
          shelfId="want-to-read"
          books={BOOKS}
          states={bookshelf}
          onBookClick={setSelectedBookId}
        />
        <ShelfSection
          shelfId="currently-reading"
          books={BOOKS}
          states={bookshelf}
          onBookClick={setSelectedBookId}
        />
        <ShelfSection
          shelfId="read"
          books={BOOKS}
          states={bookshelf}
          onBookClick={setSelectedBookId}
        />

        {/* Library — unshelfed books */}
        {unshelfed.length > 0 && (
          <section className="mt-2">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-3 pb-2 border-b-2 border-parchment text-warm-600">
              <span className="text-lg" aria-hidden="true">🏛</span>
              <h2 className="font-display text-xl font-semibold text-warm-600">Library</h2>
              <span className="ml-auto text-xs font-semibold font-sans px-2.5 py-1 rounded-full bg-parchment text-warm-700">
                {filteredUnshelfed.length}{q ? ` of ${unshelfed.length}` : ''}
              </span>
            </div>

            {/* Sticky search bar */}
            <div className="sticky top-[68px] z-30 bg-cream pb-3 pt-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="search"
                  placeholder="Search by title or author…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-white border border-warm-200 rounded-xl text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy font-sans transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-700 text-lg leading-none"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {filteredUnshelfed.length === 0 ? (
              <p className="font-sans text-sm text-warm-500 italic py-8 text-center">
                No books match &ldquo;{searchQuery}&rdquo;
              </p>
            ) : (
              <>
                {!q && (
                  <p className="font-sans text-xs text-warm-500 italic mb-4">
                    Tap any book to add it to a shelf.
                  </p>
                )}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
                  {filteredUnshelfed.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      state={bookshelf[book.id] ?? DEFAULT_STATE}
                      onClick={() => setSelectedBookId(book.id)}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {BOOKS.every((b) => bookshelf[b.id]?.shelf) && (
          <div className="text-center py-12">
            <p className="font-display text-4xl mb-3">🎉</p>
            <p className="font-display text-xl text-warm-700 italic">
              Every book is on a shelf — well organised!
            </p>
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          state={selectedState}
          onShelfChange={handleShelfChange}
          onRatingChange={handleRatingChange}
          onClose={() => setSelectedBookId(null)}
        />
      )}
    </div>
  );
}
