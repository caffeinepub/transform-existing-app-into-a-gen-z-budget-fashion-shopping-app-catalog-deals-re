import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetProductReviews, useGetAverageRating, useAddReview } from '../../hooks/useShopQueries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import type { Review } from '../../backend';

interface ReviewsSectionProps {
  productId: bigint;
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const { identity } = useInternetIdentity();
  const { data: reviews = [], isLoading } = useGetProductReviews(productId);
  const { data: avgRating = 0 } = useGetAverageRating(productId);
  const { mutateAsync: addReview, isPending } = useAddReview();

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = async () => {
    if (!identity) {
      toast.error('Please log in to submit a review');
      return;
    }

    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    try {
      const review: Review = {
        id: BigInt(Date.now()),
        productId,
        user: identity.getPrincipal(),
        rating: BigInt(rating),
        text: reviewText.trim(),
        isInfluencerPick: false,
        influencerQuote: undefined,
      };
      await addReview(review);
      setReviewText('');
      setRating(5);
      toast.success('Review submitted!');
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Reviews</h2>
        <div className="flex items-center gap-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {avgRating.toFixed(1)} ({reviews.length} reviews)
          </span>
        </div>
      </div>

      {identity && (
        <div className="space-y-3 p-4 border rounded-xl bg-muted/30">
          <h3 className="font-semibold">Write a Review</h3>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 cursor-pointer transition-colors ${
                  i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'
                }`}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
          <Textarea
            placeholder="Share your thoughts about this product..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={3}
          />
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id.toString()} className="p-4 border rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Number(review.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                {review.isInfluencerPick && (
                  <span className="text-xs font-semibold text-purple-600">Influencer Pick</span>
                )}
              </div>
              <p className="text-sm">{review.text}</p>
              {review.influencerQuote && (
                <p className="text-xs italic text-muted-foreground">"{review.influencerQuote}"</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
