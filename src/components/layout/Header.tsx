import Link from 'next/link';
import styles from './Header.module.css';
import { Button } from '../ui/Button';

export function Header() {
    return (
        <header className={styles.header}>
            <div className={`container ${styles.inner}`}>
                <Link href="/" className={styles.logo}>
                    Kaluna
                </Link>
                <nav className={styles.nav}>
                    <Link href="/events/create">
                        <Button variant="secondary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                            Create Event
                        </Button>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
