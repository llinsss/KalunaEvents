'use client';

import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { registerForEvent } from '@/app/events/actions';

export function RegistrationFlow({ eventId }: { eventId: string }) {
    const [step, setStep] = useState<'idle' | 'email' | 'success'>('idle');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerForEvent(eventId, email);
            setStep('success');
        } catch (err) {
            alert('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (step === 'success') {
        return (
            <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>You're in! 🎉</h3>
                <p>Your ticket has been sent to {email}</p>
            </div>
        );
    }

    if (step === 'email') {
        return (
            <form onSubmit={handleRegister}>
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
                    {loading ? 'Registering...' : 'Confirm'}
                </Button>
            </form>
        );
    }

    return (
        <Button block onClick={() => setStep('email')}>
            Register for Event
        </Button>
    );
}
