import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { RegistrationFlow } from '@/components/RegistrationFlow';
import styles from './page.module.css';

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function EventPage(props: Props) {
    const params = await props.params;
    const event = await prisma.event.findUnique({
        where: { slug: params.slug },
        include: { host: true, tickets: true },
    });

    if (!event) {
        notFound();
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.cover}>
                {/* Placeholder for cover image */}
            </div>

            <div className={`container ${styles.content}`}>
                <div className={styles.main}>
                    <h1 className={styles.title}>{event.title}</h1>

                    <div className={styles.meta}>
                        <div>
                            <p>📅 {new Date(event.startDate).toLocaleDateString()} </p>
                            <p>⏰ {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div>
                            <p>📍 {event.location}</p>
                        </div>
                    </div>

                    <div className={styles.description}>
                        {event.description}
                    </div>

                    <div className={styles.host}>
                        <div style={{ width: 40, height: 40, background: '#333', borderRadius: '50%' }} />
                        <div>
                            <p className={styles.hostLabel}>Hosted by</p>
                            <p className={styles.hostName}>{event.host.name || event.host.email}</p>
                        </div>
                    </div>
                </div>

                <aside className={styles.sidebar}>
                    <div className={`glass-panel ${styles.registerCard}`}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Registration</h3>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                            Select a ticket to join.
                        </p>
                        <RegistrationFlow eventId={event.id} tickets={event.tickets} />
                    </div>
                </aside>
            </div>
        </div>
    );
}
