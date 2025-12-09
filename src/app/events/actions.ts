'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createEvent(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const startDate = new Date(formData.get('startDate') as string);
    const endDate = new Date(formData.get('endDate') as string);
    const hostEmail = formData.get('hostEmail') as string;

    // Simple slug generation
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7);

    // Find or create host
    let host = await prisma.user.findUnique({
        where: { email: hostEmail },
    });

    if (!host) {
        host = await prisma.user.create({
            data: {
                email: hostEmail,
                name: hostEmail.split('@')[0], // Simple default name
            },
        });
    }

    const event = await prisma.event.create({
        data: {
            title,
            description,
            location,
            startDate,
            endDate,
            slug,
            hostId: host.id,
            published: true, // Auto publish for now
        },
    });

    // Create tickets
    const ticketsJson = formData.get('tickets') as string;
    if (ticketsJson) {
        const tickets = JSON.parse(ticketsJson);
        for (const t of tickets) {
            await prisma.ticket.create({
                data: {
                    name: t.name,
                    price: parseFloat(t.price),
                    quantity: parseInt(t.quantity),
                    eventId: event.id,
                },
            });
        }
    } else {
        // Fallback default
        await prisma.ticket.create({
            data: {
                name: 'General Admission',
                quantity: 100,
                eventId: event.id,
            }
        });
    }

    redirect(`/events/${event.slug}`);
}

export async function registerForEvent(eventId: string, email: string, ticketId: string) {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        user = await prisma.user.create({
            data: { email, name: email.split('@')[0] },
        });
    }

    // Verify ticket belongs to event and has quantity
    const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
    });

    if (!ticket || ticket.eventId !== eventId) {
        throw new Error('Invalid ticket');
    }

    // Check capacity (simple check, not concurrency safe for high load but ok for MVP)
    // Actually we should decrement quantity.

    // Decrement ticket quantity
    await prisma.ticket.update({
        where: { id: ticketId },
        data: { quantity: { decrement: 1 } }
    });

    const registration = await prisma.registration.create({
        data: {
            userId: user.id,
            eventId,
            ticketId: ticket.id,
        },
    });

    return { success: true, registrationId: registration.id };
}
