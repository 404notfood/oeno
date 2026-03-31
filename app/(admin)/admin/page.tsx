import { AdminHeader } from "@/components/admin/layout";
import { StatsCard } from "@/components/admin/ui";
import { getGlobalStats, getRecentActivity } from "@/actions/admin";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [stats, activity] = await Promise.all([
    getGlobalStats(),
    getRecentActivity(),
  ]);

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Vue d'ensemble de la plateforme Enoclass"
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Utilisateurs"
            value={stats.users.total}
            description={`${stats.users.students} élèves, ${stats.users.teachers} enseignants`}
            icon="users"
            variant="bordeaux"
          />
          <StatsCard
            title="Établissements"
            value={stats.establishments}
            description="Établissements actifs"
            icon="establishments"
            variant="or"
          />
          <StatsCard
            title="Classes"
            value={stats.classes}
            description="Classes actives"
            icon="classes"
            variant="vert"
          />
          <StatsCard
            title="Activités"
            value={stats.activities}
            description={`${stats.quizzes} quiz disponibles`}
            icon="activities"
            variant="info"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Vins"
            value={stats.wines}
            description="Références de vins"
            icon="chart"
          />
          <StatsCard
            title="Cépages"
            value={stats.grapes}
            description="Variétés de raisins"
            icon="chart"
          />
          <StatsCard
            title="Appellations"
            value={stats.appellations}
            description="AOC, IGP, VDF"
            icon="chart"
          />
          <StatsCard
            title="Dégustations"
            value={stats.tastings}
            description={`${stats.quizAttempts} tentatives de quiz`}
            icon="quizzes"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-bordeaux font-cormorant">
                Derniers utilisateurs inscrits
              </h2>
              <Link
                href="/admin/utilisateurs"
                className="text-sm text-bordeaux hover:text-bordeaux-light transition-colors"
              >
                Voir tous
              </Link>
            </div>
            <div className="space-y-3">
              {activity.recentUsers.length === 0 ? (
                <p className="text-sm text-gris-tech py-4 text-center">
                  Aucun utilisateur récent
                </p>
              ) : (
                activity.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-2 border-b border-beige-dark last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-bordeaux/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-bordeaux">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gris-dark">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gris-tech">{user.email}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.role === "STUDENT"
                          ? "bg-info/10 text-info"
                          : user.role === "TEACHER"
                            ? "bg-or/10 text-or-dark"
                            : "bg-bordeaux/10 text-bordeaux"
                      }`}
                    >
                      {user.role === "STUDENT"
                        ? "Élève"
                        : user.role === "TEACHER"
                          ? "Enseignant"
                          : "Admin"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Quiz Attempts */}
          <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-bordeaux font-cormorant">
                Dernières tentatives de quiz
              </h2>
              <Link
                href="/admin/quiz"
                className="text-sm text-bordeaux hover:text-bordeaux-light transition-colors"
              >
                Voir tous
              </Link>
            </div>
            <div className="space-y-3">
              {activity.recentQuizAttempts.length === 0 ? (
                <p className="text-sm text-gris-tech py-4 text-center">
                  Aucune tentative récente
                </p>
              ) : (
                activity.recentQuizAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between py-2 border-b border-beige-dark last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gris-dark">
                        {attempt.user.firstName} {attempt.user.lastName}
                      </p>
                      <p className="text-xs text-gris-tech">
                        {attempt.quiz.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-sm font-medium ${
                          attempt.passed ? "text-success" : "text-danger"
                        }`}
                      >
                        {attempt.score}%
                      </span>
                      <p className="text-xs text-gris-tech">
                        {attempt.passed ? "Réussi" : "Échoué"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6">
          <h2 className="text-lg font-semibold text-bordeaux font-cormorant mb-4">
            Actions rapides
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/utilisateurs/nouveau"
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-beige-dark hover:border-bordeaux hover:bg-beige/50 transition-colors"
            >
              <svg
                className="w-6 h-6 text-bordeaux"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              <span className="text-sm text-gris-dark">Nouvel utilisateur</span>
            </Link>
            <Link
              href="/admin/etablissements/nouveau"
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-beige-dark hover:border-bordeaux hover:bg-beige/50 transition-colors"
            >
              <svg
                className="w-6 h-6 text-bordeaux"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="text-sm text-gris-dark">
                Nouvel établissement
              </span>
            </Link>
            <Link
              href="/admin/quiz/nouveau"
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-beige-dark hover:border-bordeaux hover:bg-beige/50 transition-colors"
            >
              <svg
                className="w-6 h-6 text-bordeaux"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <span className="text-sm text-gris-dark">Nouveau quiz</span>
            </Link>
            <Link
              href="/admin/vins/nouveau"
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-beige-dark hover:border-bordeaux hover:bg-beige/50 transition-colors"
            >
              <svg
                className="w-6 h-6 text-bordeaux"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm text-gris-dark">Nouveau vin</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
