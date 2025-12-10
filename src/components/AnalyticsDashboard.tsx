'use client'

import { useEffect, useState } from 'react'

interface AnalyticsData {
  totalViews: number
  totalRegistrations: number
  totalRevenue: number
  conversionRate: number
  dailyStats: Array<{
    date: string
    views: number
    registrations: number
  }>
}

interface AnalyticsDashboardProps {
  eventId: string
}

export function AnalyticsDashboard({ eventId }: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics/${eventId}`)
        const analyticsData = await response.json()
        setData(analyticsData)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [eventId])

  if (loading) {
    return <div>Loading analytics...</div>
  }

  if (!data) {
    return <div>No analytics data available</div>
  }

  return (
    <div className="glass-panel">
      <h3 style={{ marginBottom: '2rem' }}>Event Analytics</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          background: 'var(--background-soft)', 
          padding: '1.5rem', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {data.totalViews}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Total Views</div>
        </div>

        <div style={{ 
          background: 'var(--background-soft)', 
          padding: '1.5rem', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
            {data.totalRegistrations}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Registrations</div>
        </div>

        <div style={{ 
          background: 'var(--background-soft)', 
          padding: '1.5rem', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
            ${data.totalRevenue.toFixed(2)}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Revenue</div>
        </div>

        <div style={{ 
          background: 'var(--background-soft)', 
          padding: '1.5rem', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--info)' }}>
            {data.conversionRate.toFixed(1)}%
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Conversion Rate</div>
        </div>
      </div>

      <div>
        <h4 style={{ marginBottom: '1rem' }}>Daily Performance</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '0.5rem', textAlign: 'right' }}>Views</th>
                <th style={{ padding: '0.5rem', textAlign: 'right' }}>Registrations</th>
              </tr>
            </thead>
            <tbody>
              {data.dailyStats.map(stat => (
                <tr key={stat.date} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.5rem' }}>
                    {new Date(stat.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>{stat.views}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>{stat.registrations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}