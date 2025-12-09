
import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export default function LoginPage() {
    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Sign in to Kaluna
                </h1>

                <form
                    action={async (formData) => {
                        "use server"
                        await signIn("resend", formData)
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <Input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        autoFocus
                    />
                    <Button type="submit" block>
                        Continue with Email
                    </Button>
                </form>
            </div>
        </div>
    )
}
