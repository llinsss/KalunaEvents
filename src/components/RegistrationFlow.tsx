'use client';

import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { registerForEvent } from '@/app/events/actions';
import { QRCodeSVG } from 'qrcode.react';

interface Ticket {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export function RegistrationFlow({ eventId, tickets }: { eventId: string; tickets: Ticket[] }) {
    const [step, setStep] = useState<'idle' | 'ticket' | 'email' | 'success'>('idle');
    const [email, setEmail] = useState('');
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [registrationId, setRegistrationId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // If only one ticket, skip selection
    const startRegistration = () => {
        if (tickets.length === 1) {
            setSelectedTicketId(tickets[0].id);
            setStep('email');
        } else {
            setStep('ticket');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicketId) return;

        setLoading(true);
        try {
            const result = await registerForEvent(eventId, email, selectedTicketId);
            setRegistrationId(result.registrationId);
            setStep('success');
        } catch (err) {
            console.error(err);
            alert('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (step === 'success') {
        return (
            <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>You're in! 🎉</h3>
                <p style={{ marginBottom: '1.5rem' }}>Your ticket has been sent to {email}</p>

                {registrationId && (
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '1rem', display: 'inline-block' }}>
                        <QRCodeSVG value={registrationId} size={150} />
                    </div>
                )}
                <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Scan at entry
                </p>
            </div>
        );
    }

    if (step === 'ticket') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {tickets.map(t => (
                    <button
                        key={t.id}
                        onClick={() => {
                            setSelectedTicketId(t.id);
                            setStep('email');
                        }}
                        style={{
                            background: 'var(--background)',
                            border: '1px solid var(--border)',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'border-color 0.2s',
                        }}
                    >
                        <div>
                            <div style={{ fontWeight: 600 }}>{t.name}</div>
                            {t.quantity < 10 && <div style={{ fontSize: '0.8rem', color: 'var(--error)' }}>Only {t.quantity} left</div>}
                        </div>
                        <div style={{ fontWeight: 600 }}>
                            {t.price === 0 ? 'Free' : `$${t.price}`}
                        </div>
                    </button>
                ))}
            </div>
        );
    }

    if (step === 'email') {
        const ticket = tickets.find(t => t.id === selectedTicketId);

        return (
            <form onSubmit={handleRegister}>
                {ticket && (
                    <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Registering for: <span style={{ color: 'var(--foreground)' }}>{ticket.name}</span>
                    </div>
                )}
                <Input
                    autoFocus
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ marginBottom: '1rem' }}
                />
                <Button block disabled={loading}>
                    {loading ? 'Registering...' : 'Confirm Registration'}
                </Button>
            </form>
        );
    }

    return (
        <Button block onClick={startRegistration}>
            Register for Event
        </Button>
    );
}
