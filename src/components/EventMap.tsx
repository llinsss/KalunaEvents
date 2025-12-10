'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

interface Event {
  id: string
  title: string
  location: string
  latitude?: number
  longitude?: number
  startDate: string
}

interface EventMapProps {
  events: Event[]
  center?: [number, number]
  zoom?: number
}

export function EventMap({ events, center = [37.7749, -122.4194], zoom = 12 }: EventMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{ 
        height: '400px', 
        background: 'var(--background-soft)', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Loading map...
      </div>
    )
  }

  return (
    <div style={{ height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {events.map(event => 
          event.latitude && event.longitude ? (
            <Marker key={event.id} position={[event.latitude, event.longitude]}>
              <Popup>
                <div>
                  <h4>{event.title}</h4>
                  <p>{event.location}</p>
                  <p>{new Date(event.startDate).toLocaleDateString()}</p>
                </div>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  )
}