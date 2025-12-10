'use client'

import { useState } from 'react'
import { Button } from './ui/Button'
import { Textarea } from './ui/Textarea'

interface Review {
  id: string
  rating: number
  comment?: string
  user: {
    name?: string
    image?: string
  }
  createdAt: string
}

interface ReviewSystemProps {
  eventId: string
  reviews: Review[]
  canReview: boolean
  onReviewSubmit: (rating: number, comment: string) => void
}

export function ReviewSystem({ eventId, reviews, canReview, onReviewSubmit }: ReviewSystemProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    setSubmitting(true)
    try {
      await onReviewSubmit(rating, comment)
      setRating(0)
      setComment('')
    } catch (error) {
      console.error('Failed to submit review:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  const StarRating = ({ rating: currentRating, interactive = false, onRate }: { 
    rating: number
    interactive?: boolean
    onRate?: (rating: number) => void 
  }) => (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate?.(star)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: star <= currentRating ? '#ffd700' : '#ddd',
            cursor: interactive ? 'pointer' : 'default'
          }}
        >
          ★
        </button>
      ))}
    </div>
  )

  return (
    <div className="glass-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>Reviews ({reviews.length})</h3>
        {reviews.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <StarRating rating={averageRating} />
            <span style={{ color: 'var(--text-secondary)' }}>
              {averageRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {canReview && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--background-soft)', borderRadius: '8px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Your Rating:</label>
            <StarRating rating={rating} interactive onRate={setRating} />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Textarea
              placeholder="Share your experience (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={rating === 0 || submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reviews.map(review => (
          <div key={review.id} style={{ 
            padding: '1rem', 
            background: 'var(--background-soft)', 
            borderRadius: '8px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {review.user.image && (
                  <img 
                    src={review.user.image} 
                    alt={review.user.name || 'User'} 
                    style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                  />
                )}
                <span style={{ fontWeight: 500 }}>{review.user.name || 'Anonymous'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <StarRating rating={review.rating} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {review.comment && (
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{review.comment}</p>
            )}
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          No reviews yet. Be the first to review this event!
        </div>
      )}
    </div>
  )
}