interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export function StarRating({ rating, onChange, size = 'md', readonly = false }: StarRatingProps) {
  const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' };

  return (
    <div className={`flex gap-0.5 ${sizes[size]}`} role={readonly ? undefined : 'group'}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star === rating ? 0 : star)}
          className={`leading-none transition-transform ${
            readonly
              ? 'cursor-default'
              : 'cursor-pointer hover:scale-110 focus:outline-none focus-visible:ring-1 focus-visible:ring-burgundy rounded'
          } ${star <= rating ? 'text-amber-500' : 'text-warm-200'}`}
          aria-label={readonly ? `${rating} of 5 stars` : `Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          {star <= rating ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
}
