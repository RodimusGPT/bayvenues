interface VenueReviewsProps {
  reviews: {
    summary: string;
    pros: string[];
    cons: string[];
  };
}

export function VenueReviews({ reviews }: VenueReviewsProps) {
  // Don't render if reviews are empty
  const hasContent = reviews.summary?.trim() ||
    (reviews.pros && reviews.pros.length > 0) ||
    (reviews.cons && reviews.cons.length > 0);

  if (!hasContent) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Reviews</h3>

      {/* Summary */}
      <p className="text-sm text-gray-600 mb-4 italic">"{reviews.summary}"</p>

      <div className="grid grid-cols-2 gap-4">
        {/* Pros */}
        <div>
          <h4 className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Pros
          </h4>
          <ul className="space-y-1.5">
            {reviews.pros.map((pro, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="text-green-500 mt-0.5">+</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div>
          <h4 className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Cons
          </h4>
          <ul className="space-y-1.5">
            {reviews.cons.map((con, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="text-red-500 mt-0.5">-</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
