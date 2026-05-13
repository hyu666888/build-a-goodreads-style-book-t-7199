import { useEffect } from 'react';
import type { Book, BookState, ShelfId } from '../types';
import { BookCover } from './BookCover';
import { StarRating } from './StarRating';

interface ShelfButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  colorClass: string;
}

function ShelfButton({ label, active, onClick, colorClass }: ShelfButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-medium font-sans transition-all duration-150 border ${
        active
          ? `${colorClass} border-transparent shadow-sm`
          : 'bg-white text-warm-700 border-warm-200 hover:border-warm-400'
      }`}
    >
      {label}
    </button>
  );
}

interface BookModalProps {
  book: Book;
  state: BookState;
  onShelfChange: (shelf: ShelfId | null) => void;
  onRatingChange: (rating: number) => void;
  onNotesChange: (notes: string) => void;
  onClose: () => void;
}

export function BookModal({
  book,
  state,
  onShelfChange,
  onRatingChange,
  onNotesChange,
  onClose,
}: BookModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${book.title}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-warm-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal panel — flex column so inner div can scroll while close btn stays put */}
      <div className="relative w-full sm:max-w-lg bg-cream rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90svh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-warm-100 text-warm-600 hover:bg-warm-200 transition-colors text-lg font-light"
          aria-label="Close"
        >
          ×
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto">
          {/* Cover + details */}
          <div className="flex gap-4 p-5 pb-4">
            <div className="flex-shrink-0 w-24 sm:w-32 rounded-lg overflow-hidden shadow-md">
              <BookCover book={book} className="w-full aspect-[2/3] object-cover" />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h2 className="font-display text-lg sm:text-xl font-bold text-warm-900 leading-tight">
                {book.title}
              </h2>
              <p className="font-sans text-sm text-warm-600 mt-0.5">
                {book.author} · {book.year}
              </p>
              <p className="font-sans text-sm text-warm-700 mt-3 leading-relaxed line-clamp-4 sm:line-clamp-none">
                {book.description}
              </p>
            </div>
          </div>

          {/* Shelf selector */}
          <div className="px-5 pb-4 border-t border-warm-100 pt-4">
            <p className="font-sans text-xs font-semibold uppercase tracking-wider text-warm-400 mb-2">
              Add to shelf
            </p>
            <div className="flex flex-wrap gap-2">
              <ShelfButton
                label="🔖 Want to Read"
                active={state.shelf === 'want-to-read'}
                onClick={() => onShelfChange(state.shelf === 'want-to-read' ? null : 'want-to-read')}
                colorClass="bg-sage text-cream"
              />
              <ShelfButton
                label="📖 Currently Reading"
                active={state.shelf === 'currently-reading'}
                onClick={() =>
                  onShelfChange(state.shelf === 'currently-reading' ? null : 'currently-reading')
                }
                colorClass="bg-burgundy text-cream"
              />
              <ShelfButton
                label="✓ Read"
                active={state.shelf === 'read'}
                onClick={() => onShelfChange(state.shelf === 'read' ? null : 'read')}
                colorClass="bg-warm-700 text-cream"
              />
            </div>
          </div>

          {/* Star rating — only for "read" books */}
          {state.shelf === 'read' && (
            <div className="px-5 pb-4 border-t border-warm-100 pt-4">
              <p className="font-sans text-xs font-semibold uppercase tracking-wider text-warm-400 mb-2">
                Your rating
              </p>
              <div className="flex items-center gap-3">
                <StarRating rating={state.rating} onChange={onRatingChange} size="lg" />
                {state.rating > 0 && (
                  <span className="font-sans text-sm text-warm-600">{state.rating} / 5</span>
                )}
                {state.rating === 0 && (
                  <span className="font-sans text-sm text-warm-400 italic">Tap to rate</span>
                )}
              </div>
            </div>
          )}

          {/* My Notes */}
          <div className="px-5 pb-6 border-t border-warm-100 pt-4">
            <label
              htmlFor="book-notes"
              className="font-sans text-xs font-semibold uppercase tracking-wider text-warm-400 mb-2 flex items-center gap-1.5"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              My Notes
            </label>
            <textarea
              id="book-notes"
              rows={3}
              placeholder="Jot down your thoughts…"
              value={state.notes ?? ''}
              onChange={(e) => onNotesChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-warm-200 rounded-lg text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy font-sans resize-none leading-relaxed transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
