import styles from './page.module.css';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { createEvent } from '../actions';
import { redirect } from 'next/navigation';

export default function CreateEventPage() {
    return (
        <div className={styles.container}>
            <h1 className={`${styles.title} title-gradient`}>Create Event</h1>

            <div className="glass-panel">
                <form action={createEvent} className={styles.form}>
                    <Input
                        name="title"
                        label="Event Title"
                        placeholder="e.g. Crypto & Coffee"
                        required
                    />

                    <Input
                        name="hostEmail"
                        type="email"
                        label="Host Email"
                        placeholder="you@example.com"
                        required
                    />

                    <div className={styles.row}>
                        <Input
                            name="startDate"
                            type="datetime-local"
                            label="Start Date"
                            required
                        />
                        <Input
                            name="endDate"
                            type="datetime-local"
                            label="End Date"
                            required
                        />
                    </div>

                    <Input
                        name="location"
                        label="Location"
                        placeholder="e.g. 123 Main St, San Francisco"
                        required
                    />

                    <Textarea
                        name="description"
                        label="Description"
                        placeholder="Tell people what your event is about..."
                        required
                    />

                    <Button type="submit" block style={{ marginTop: '1rem' }}>
                        Create Event
                    </Button>
                </form>
            </div>
        </div>
    );
}
