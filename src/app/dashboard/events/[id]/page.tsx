import { auth } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

interface Props {
    params: Promise<{ id: string }>
}

export default async function EventDashboardPage(props: Props) {
    const params = await props.params;
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    const event = await prisma.event.findUnique({
        where: {
            id: params.id,
            hostId: session.user.id
        },
        include: {
            registrations: {
                include: {
                    user: true,
                    ticket: true
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!event) {
        notFound()
    }

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div>
                    <Link href="/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                        ← Back to Dashboard
                    </Link>
                    <h1 className="title-gradient">{event.title}</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href={`/events/${event.slug}`} target="_blank">
                        <Button variant="secondary">View Public Page</Button>
                    </Link>
                </div>
            </header>

            <div className="glass-panel">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Guest List ({event.registrations.length})</h2>

                {event.registrations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                        <p>No registrations yet.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Email</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Ticket</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {event.registrations.map(reg => (
                                    <tr key={reg.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}>{reg.user.name || '-'}</td>
                                        <td style={{ padding: '1rem' }}>{reg.user.email}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                background: 'var(--background-soft)',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.85rem'
                                            }}>
                                                {reg.ticket.name}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            {new Date(reg.createdAt).toLocaleDateString()} {new Date(reg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
