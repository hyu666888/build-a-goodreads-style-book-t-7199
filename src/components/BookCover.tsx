import { useState } from 'react';
import type { Book } from '../types';

const COVER_BG = [
  'bg-burgundy',
  'bg-sage-dark',
  'bg-warm-700',
  'bg-warm-800',
  'bg-sage',
];

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

interface BookCoverProps {
  book: Book;
  className?: string;
}

export function BookCover({ book, className = '' }: BookCoverProps) {
  const [error, setError] = useState(false);

  if (error) {
    const bg = COVER_BG[hashId(book.id) % COVER_BG.length];
    return (
      <div className={`${className} ${bg} flex flex-col justify-between p-2`}>
        <div className="flex-1 flex flex-col justify-center text-center">
          <p className="font-display text-cream font-bold leading-tight line-clamp-5 text-[clamp(0.6rem,2.5vw,0.85rem)]">
            {book.title}
          </p>
        </div>
        <p className="font-sans text-cream/70 text-[clamp(0.5rem,1.8vw,0.7rem)] text-center leading-tight">
          {book.author}
        </p>
      </div>
    );
  }

  return (
    <img
      src={book.cover}
      alt={`${book.title} cover`}
      onError={() => setError(true)}
      className={className}
      loading="lazy"
    />
  );
}
