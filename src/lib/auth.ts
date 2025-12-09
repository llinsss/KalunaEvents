import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        {
            id: "resend",
            type: "email",
            name: "Email",
            from: "onboarding@resend.dev",
            server: {},
            maxAge: 24 * 60 * 60,
            options: {},
            sendVerificationRequest: async ({ identifier: email, url }) => {
                // In development, log the URL to the console
                if (process.env.NODE_ENV === "development") {
                    console.log(`\n\nMAGIC LINK FOR ${email}: ${url}\n\n`)
                    return
                }
                // In production, you would use Resend/Nodemailer here
            },
        }
    ],
    callbacks: {
        session: ({ session, user }) => {
            // Add user ID to session
            if (session.user) {
                session.user.id = user.id
            }
            return session
        }
    }
})
