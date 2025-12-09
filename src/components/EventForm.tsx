'use client';

import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { createEvent } from '@/app/events/actions';

interface TicketDraft {
    name: string;
    price: string;
    quantity: string;
}

export function EventForm() {
    const [tickets, setTickets] = useState<TicketDraft[]>([
        { name: 'General Admission', price: '0', quantity: '100' }
    ]);
    const [loading, setLoading] = useState(false);

    const addTicket = () => {
        setTickets([...tickets, { name: '', price: '0', quantity: '50' }]);
    };

    const removeTicket = (index: number) => {
        setTickets(tickets.filter((_, i) => i !== index));
    };

    const updateTicket = (index: number, field: keyof TicketDraft, value: string) => {
        const newTickets = [...tickets];
        newTickets[index] = { ...newTickets[index], [field]: value };
        setTickets(newTickets);
    };

    return (
        <form
            action={async (formData) => {
                setLoading(true);
                // Append tickets as JSON
                formData.set('tickets', JSON.stringify(tickets));
                await createEvent(formData);
                setLoading(false);
            }}
            className="space-y-6"
        >
            <Input name="title" label="Event Title" placeholder="e.g. Crypto & Coffee" required />
            <Input name="hostEmail" type="email" label="Host Email" placeholder="you@example.com" required />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input name="startDate" type="datetime-local" label="Start Date" required />
                <Input name="endDate" type="datetime-local" label="End Date" required />
            </div>

            <Input name="location" label="Location" placeholder="e.g. 123 Main St, San Francisco" required />
            <Textarea name="description" label="Description" placeholder="Tell people what your event is about..." required />

            <div className="p-4 border border-[var(--border)] rounded-lg bg-[var(--background-soft)]">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Tickets</h3>
                    <Button type="button" onClick={addTicket} style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}>
                        + Add Ticket
                    </Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {tickets.map((ticket, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                            <div style={{ flex: 2 }}>
                                <Input
                                    label={i === 0 ? "Name" : ""}
                                    placeholder="Ticket Name"
                                    value={ticket.name}
                                    onChange={e => updateTicket(i, 'name', e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Input
                                    label={i === 0 ? "Price" : ""}
                                    type="number"
                                    placeholder="0"
                                    value={ticket.price}
                                    onChange={e => updateTicket(i, 'price', e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Input
                                    label={i === 0 ? "Qty" : ""}
                                    type="number"
                                    placeholder="100"
                                    value={ticket.quantity}
                                    onChange={e => updateTicket(i, 'quantity', e.target.value)}
                                    required
                                />
                            </div>
                            {tickets.length > 1 && (
                                <Button
                                    type="button"
                                    onClick={() => removeTicket(i)}
                                    style={{ background: 'var(--error)', padding: '0.5rem', height: '42px', marginTop: i === 0 ? '24px' : '0' }}
                                >
                                    ✕
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Button type="submit" block disabled={loading} style={{ marginTop: '1.5rem' }}>
                {loading ? 'Creating...' : 'Create Event'}
            </Button>
        </form>
    );
}
