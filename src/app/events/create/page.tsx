import styles from './page.module.css';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { createEvent } from '../actions';
import { redirect } from 'next/navigation';
import { EventForm } from '@/components/EventForm';

export default function CreateEventPage() {
    return (
        <div className={styles.container}>
            <h1 className={`${styles.title} title-gradient`}>Create Event</h1>

            <div className="glass-panel">
                <EventForm />
            </div>
        </div>
    );
}
