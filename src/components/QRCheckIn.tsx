'use client'

import { useState } from 'react'
import QRCode from 'qrcode.react'
import { Button } from './ui/Button'

interface QRCheckInProps {
  registrationId: string
  qrCode: string
  checkedIn: boolean
  onCheckIn?: () => void
}

export function QRCheckIn({ registrationId, qrCode, checkedIn, onCheckIn }: QRCheckInProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckIn = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode })
      })
      
      if (response.ok) {
        onCheckIn?.()
      }
    } catch (error) {
      console.error('Check-in error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel" style={{ textAlign: 'center' }}>
      <h3 style={{ marginBottom: '1rem' }}>Event Ticket</h3>
      
      <div style={{ 
        background: 'white', 
        padding: '1rem', 
        borderRadius: '8px', 
        display: 'inline-block',
        marginBottom: '1rem'
      }}>
        <QRCode value={qrCode} size={200} />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Show this QR code at the event entrance
        </p>
      </div>

      {checkedIn ? (
        <div style={{ 
          background: 'var(--success)', 
          color: 'white', 
          padding: '0.5rem 1rem', 
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          ✓ Checked In
        </div>
      ) : onCheckIn && (
        <Button onClick={handleCheckIn} disabled={loading}>
          {loading ? 'Checking in...' : 'Check In'}
        </Button>
      )}
    </div>
  )
}