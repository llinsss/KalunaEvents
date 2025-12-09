import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    const events = await prisma.event.findMany({
        where: { hostId: session.user.id },
        include: {
            _count: { select: { registrations: true } }
        },
        orderBy: { startDate: 'desc' }
    })

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border)'
            }}>
                <div>
                    <h1 className="title-gradient">Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {session.user.name || session.user.email}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/events/create">
                        <Button>+ Create Event</Button>
                    </Link>
                    <form
                        action={async () => {
                            "use server"
                            await signOut()
                        }}
                    >
                        <button
                            type="submit"
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                            }}
                        >
                            Sign Out
                        </button>
                    </form>
                </div>
            </header>

            <div className="glass-panel">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Your Events</h2>

                {events.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                        <p>You haven't hosted any events yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {events.map(event => (
                            <Link
                                href={`/dashboard/events/${event.id}`}
                                key={event.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1.5rem',
                                    borderRadius: '0.5rem',
                                    background: 'var(--background)',
                                    border: '1px solid var(--border)',
                                    textDecoration: 'none',
                                    color: 'inherit'
                                }}
                            >
                                <div>
                                    <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{event.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        {new Date(event.startDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '2rem', textAlign: 'right' }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{event._count.registrations}</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Guests</div>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '1.25rem', color: event.published ? 'var(--success)' : 'var(--text-secondary)' }}>
                                            {event.published ? 'Live' : 'Draft'}
                                        </div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Status</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
