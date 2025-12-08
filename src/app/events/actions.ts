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

    redirect(`/events/${event.slug}`);
}

export async function registerForEvent(eventId: string, email: string) {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        user = await prisma.user.create({
            data: { email, name: email.split('@')[0] },
        });
    }

    // Create a default ticket for now if none exists
    // Actually schema requires ticketId.
    // Implementation plan said "simple", but schema is strict.
    // I need to fetch tickets for event.

    // For MVP, create a default "General Admission" ticket on event creation, or find first ticket here.
    // Let's create a ticket on the fly if needed in this action (Not ideal but works for MVP).

    let ticket = await prisma.ticket.findFirst({
        where: { eventId },
    });

    if (!ticket) {
        ticket = await prisma.ticket.create({
            data: {
                name: 'General Admission',
                quantity: 100,
                eventId,
            },
        });
    }

    await prisma.registration.create({
        data: {
            userId: user.id,
            eventId,
            ticketId: ticket.id,
        },
    });

    return { success: true };
}
