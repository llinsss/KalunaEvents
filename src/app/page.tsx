import Link from 'next/link';
import styles from './page.module.css';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={`${styles.title} title-gradient`}>
            Events worth <br /> remembering.
          </h1>
          <p className={styles.subtitle}>
            Discover and host exclusive events in your area.
            The simplest way to bring people together.
          </p>
          <div className={styles.actions}>
            <Link href="/events/create">
              <Button style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Create Event
              </Button>
            </Link>
            <Button variant="secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Explore
            </Button>
          </div>
        </div>
      </section>

      <section className={`${styles.section} container`}>
        <h2 className={styles.sectionTitle}>Trending Now</h2>
        <div className={styles.grid}>
          {/* Mock Events (Replace with DB fetch later) */}
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardImage} />
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Crypto & Coffee Meetup</h3>
                <p className={styles.cardMeta}>Dec 12 • San Francisco, CA</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
