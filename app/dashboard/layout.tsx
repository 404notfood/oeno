import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import DashboardShell from "@/components/student/DashboardShell";
import { getUserNotifications, getUnreadCount } from "@/actions/notifications";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [notifications, unreadCount] = await Promise.all([
    getUserNotifications(userId),
    getUnreadCount(userId),
  ]);

  const user = {
    id: userId,
    firstName:
      session.user.firstName || session.user.name?.split(" ")[0] || "Utilisateur",
    lastName: session.user.lastName || session.user.name?.split(" ")[1] || "",
    role: session.user.role || "STUDENT",
  };

  return (
    <DashboardShell user={user} notifications={notifications} unreadCount={unreadCount}>
      {children}
    </DashboardShell>
  );
}
