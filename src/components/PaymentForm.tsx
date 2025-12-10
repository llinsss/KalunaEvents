'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from './ui/Button'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  eventId: string
  ticketId: string
  amount: number
  onSuccess: () => void
}

export function PaymentForm({ eventId, ticketId, amount, onSuccess }: PaymentFormProps) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, ticketId, amount })
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise
      
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) throw error
      }
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel">
      <h3 style={{ marginBottom: '1rem' }}>Complete Payment</h3>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Total: ${amount.toFixed(2)}</strong>
      </div>
      <Button 
        onClick={handlePayment} 
        disabled={loading}
        style={{ width: '100%' }}
      >
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </Button>
    </div>
  )
}