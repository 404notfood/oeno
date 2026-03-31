import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import TeacherShell from "@/components/enseignant/TeacherShell";
import { getUserNotifications, getUnreadCount } from "@/actions/notifications";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  // Only teachers and admins can access this section
  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const userId = session.user.id;

  const [notifications, unreadCount] = await Promise.all([
    getUserNotifications(userId),
    getUnreadCount(userId),
  ]);

  return (
    <TeacherShell
      user={{
        id: userId,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        email: session.user.email,
      }}
      notifications={notifications}
      unreadCount={unreadCount}
    >
      {children}
    </TeacherShell>
  );
}
