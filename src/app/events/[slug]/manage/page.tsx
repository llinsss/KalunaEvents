import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ManageEventPage(props: Props) {
    const params = await props.params;

    const event = await prisma.event.findUnique({
        where: { slug: params.slug },
        include: {
            registrations: {
                include: {
                    user: true,
                    ticket: true,
                },
                orderBy: { createdAt: 'desc' },
            },
            tickets: true,
        },
    });

    if (!event) notFound();

    // Simple stats calculation
    const totalGuests = event.registrations.length;
    // const totalRevenue = event.registrations.reduce((acc: number, reg: any) => acc + reg.ticket.price, 0); // Need to fix type if I use this
    const ticketTypes = event.tickets.length;

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div style={{ marginBottom: '2rem', paddingLeft: '1rem' }}>
                    <Link href={`/events/${event.slug}`} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        ← Back to Event
                    </Link>
                </div>
                <nav>
                    <a href="#" className={styles.navItemActive}>Overview</a>
                    <a href="#" className={styles.navItem}>Guests</a>
                    <a href="#" className={styles.navItem}>Settings</a>
                </nav>
            </aside>

            <main className={styles.content}>
                <header className={styles.header}>
                    <h1 className={styles.title}>{event.title}</h1>
                    <p className={styles.subtitle}>Manage your event and view guests.</p>
                </header>

                <section className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{totalGuests}</div>
                        <div className={styles.statLabel}>Total Guests</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>0</div>
                        <div className={styles.statLabel}>Waitlist</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>${0}</div>
                        <div className={styles.statLabel}>Total Revenue</div>
                    </div>
                </section>

                <section className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Guest List</h3>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Ticket</th>
                                <th>Registered At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {event.registrations.map((reg) => (
                                <tr key={reg.id}>
                                    <td style={{ fontWeight: 500 }}>
                                        {reg.user.name || 'Anonymous'}
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{reg.user.email}</td>
                                    <td>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '4px',
                                            fontSize: '0.85rem'
                                        }}>
                                            {reg.ticket.name}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        {new Date(reg.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {event.registrations.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}>
                                        No guests yet. Share your event page!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
}
