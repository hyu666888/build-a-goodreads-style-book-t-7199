import type { Book, BookState } from '../types';
import { StarRating } from './StarRating';

interface BookCardProps {
  book: Book;
  state: BookState;
  onClick: () => void;
}

const FALLBACK = (id: string) =>
  `https://placehold.co/200x300/7C2D3B/FAF7F0?text=${encodeURIComponent(id)}`;

export function BookCard({ book, state, onClick }: BookCardProps) {
  return (
    <button
      onClick={onClick}
      className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 rounded-lg"
    >
      <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all duration-200 group-hover:-translate-y-1 bg-warm-100">
        <img
          src={book.cover}
          alt={`${book.title} cover`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK(book.id);
          }}
          className="w-full aspect-[2/3] object-cover"
          loading="lazy"
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
      </div>
    </button>
  );
}
