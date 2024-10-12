import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation"
import Dashboard from "@/components/Dashboard"

export default async function DashboardPage() {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    
    if (!user || !user.id) redirect('/auth-callback?origin=dashboard')

    try {
        const dbUser = await db.user.findFirst({
            where: {
                id: user.id
            }
        })

        if (!dbUser) {
            redirect('/auth-callback?origin=dashboard')
        }

        // Pass the user data to the Dashboard component
        return <Dashboard />
    } catch (error) {
        console.error("Error fetching user data:", error)
        // Handle the error appropriately, maybe show an error page
        return <div>Error loading dashboard. Please try again later.</div>
    }
}