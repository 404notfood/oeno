import { AdminHeader } from "@/components/admin/layout";
import {
  getUserRegistrationStats,
  getUserRoleDistribution,
  getActivityByBloc,
  getQuizCompletionStats,
  getLoginStats,
  getEstablishmentsByRegion,
  getClassesByLevel,
  getAnalyticsContentStats,
  getGlobalTrends,
} from "@/actions/admin";
import AnalyticsDashboard from "./AnalyticsDashboard";

export default async function AnalyticsPage() {
  const [
    userRegistrations,
    roleDistribution,
    activityByBloc,
    quizStats,
    loginStats,
    establishmentsByRegion,
    classesByLevel,
    contentStats,
    trends,
  ] = await Promise.all([
    getUserRegistrationStats("month"),
    getUserRoleDistribution(),
    getActivityByBloc(),
    getQuizCompletionStats("month"),
    getLoginStats("month"),
    getEstablishmentsByRegion(),
    getClassesByLevel(),
    getAnalyticsContentStats(),
    getGlobalTrends(),
  ]);

  return (
    <>
      <AdminHeader
        title="Analytics"
        description="Statistiques et analyses de la plateforme"
      />

      <div className="p-6">
        <AnalyticsDashboard
          userRegistrations={userRegistrations}
          roleDistribution={roleDistribution}
          activityByBloc={activityByBloc}
          quizStats={quizStats}
          loginStats={loginStats}
          establishmentsByRegion={establishmentsByRegion}
          classesByLevel={classesByLevel}
          contentStats={contentStats}
          trends={trends}
        />
      </div>
    </>
  );
}
