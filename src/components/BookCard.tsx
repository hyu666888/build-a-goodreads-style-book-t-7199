import type { Book, BookState } from '../types';
import { BookCover } from './BookCover';
import { StarRating } from './StarRating';

interface BookCardProps {
  book: Book;
  state: BookState;
  onClick: () => void;
}

export function BookCard({ book, state, onClick }: BookCardProps) {
  return (
    <button
      onClick={onClick}
      className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 rounded-lg"
    >
      <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all duration-200 group-hover:-translate-y-1">
        <BookCover
          book={book}
          className="w-full aspect-[2/3] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
          <span className="text-cream text-xs font-medium font-sans">View details</span>
        </div>
      </div>
      <div className="mt-2 px-0.5">
        <p className="font-display text-sm font-semibold text-warm-900 leading-tight line-clamp-2">
          {book.title}
        </p>
        <p className="text-xs text-warm-600 mt-0.5 font-sans">{book.author}</p>
        {state.shelf === 'read' && state.rating > 0 && (
          <div className="mt-1">
            <StarRating rating={state.rating} size="sm" readonly />
          </div>
        )}
        {state.notes && (
          <div className="mt-1 flex items-start gap-0.5 text-warm-400 min-w-0">
            <svg
              className="w-2.5 h-2.5 shrink-0 mt-px"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span className="text-[10px] font-sans leading-tight line-clamp-1 min-w-0">
              {state.notes.length > 30 ? state.notes.slice(0, 30) + '…' : state.notes}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
