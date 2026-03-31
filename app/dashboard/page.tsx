import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import {
  getUserProgressData,
  getUserBlocsProgress,
  getUserRecentActivities,
} from "@/actions/progress";

export default async function DashboardPage() {
  const session = await getServerSession();

  const user = {
    firstName:
      session?.user.firstName ||
      session?.user.name?.split(" ")[0] ||
      "Utilisateur",
  };

  // Récupération des données de progression depuis la base de données
  const [progressData, blocs, recentActivities] = await Promise.all([
    getUserProgressData(session!.user.id),
    getUserBlocsProgress(session!.user.id),
    getUserRecentActivities(session!.user.id, 5),
  ]);

  // Trouver le bloc en cours
  const currentBloc =
    blocs.find((b) => b.status === "in_progress") || blocs[0];

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bonjour, {user.firstName} !</h1>
        <p className="text-[var(--gris-tech)]">
          Bienvenue sur votre espace OenoClass. Continuez votre apprentissage de
          l&apos;œnologie.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--bordeaux)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">Blocs complétés</p>
              <p className="text-2xl font-bold text-[var(--bordeaux)] font-cormorant">
                {progressData.completedBlocks}/{progressData.totalBlocks}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--vert)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">
                Activités terminées
              </p>
              <p className="text-2xl font-bold text-[var(--vert)] font-cormorant">
                {progressData.completedActivities}/
                {progressData.totalActivities}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--or)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">Score moyen</p>
              <p className="text-2xl font-bold text-[var(--or)] font-cormorant">
                {progressData.averageScore}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--info)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">{currentBloc?.icon || "🎯"}</span>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">Bloc en cours</p>
              <p className="text-2xl font-bold text-[var(--info)] font-cormorant">
                {currentBloc ? `Bloc ${currentBloc.num}` : "Aucun"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Progress */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Progression actuelle</h2>
          <Link
            href="/dashboard/progression"
            className="text-[var(--bordeaux)] text-sm hover:underline"
          >
            Voir tout
          </Link>
        </div>
        {currentBloc ? (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--gris-tech)]">
                  Bloc {currentBloc.num} - {currentBloc.title}
                </span>
                <span className="text-sm font-medium text-[var(--bordeaux)]">
                  {currentBloc.progress}%
                </span>
              </div>
              <div className="h-3 bg-[var(--beige)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--bordeaux)] to-[var(--or)] rounded-full transition-all"
                  style={{ width: `${currentBloc.progress}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-[var(--gris-light)]">
              {currentBloc.progress === 0
                ? "Commencez ce bloc pour progresser dans votre apprentissage !"
                : currentBloc.progress === 100
                ? "Bloc terminé ! Passez au suivant."
                : "Continuez comme ça, vous progressez bien !"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-[var(--gris-light)]">
            Aucune progression pour le moment. Commencez votre apprentissage !
          </p>
        )}
      </div>

      {/* Blocs Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Les 8 blocs de compétences</h2>
          <Link
            href="/dashboard/blocs"
            className="text-[var(--bordeaux)] text-sm hover:underline"
          >
            Voir tout
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {blocs.map((bloc) => (
            <Link
              key={bloc.num}
              href={
                bloc.status !== "locked" ? `/dashboard/blocs/${bloc.num}` : "#"
              }
              className={`card relative overflow-hidden ${
                bloc.status === "locked"
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:shadow-lg"
              }`}
            >
              {bloc.status === "completed" && (
                <div className="absolute top-3 right-3">
                  <span className="w-6 h-6 bg-[var(--success)] rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                </div>
              )}
              {bloc.status === "locked" && (
                <div className="absolute top-3 right-3">
                  <svg
                    className="w-5 h-5 text-[var(--gris-light)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{bloc.icon}</span>
                <span className="text-xs font-medium text-[var(--bordeaux)] bg-[var(--bordeaux)] bg-opacity-10 px-2 py-1 rounded-full">
                  Bloc {bloc.num}
                </span>
              </div>
              <h3 className="font-medium text-[var(--gris-dark)] mb-3">
                {bloc.title}
              </h3>

              {bloc.status !== "locked" && (
                <div className="h-2 bg-[var(--beige)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      bloc.status === "completed"
                        ? "bg-[var(--success)]"
                        : "bg-gradient-to-r from-[var(--bordeaux)] to-[var(--or)]"
                    }`}
                    style={{ width: `${bloc.progress}%` }}
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Activité récente</h2>
          </div>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-[var(--beige)] rounded-xl"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === "quiz"
                        ? "bg-[var(--bordeaux)] bg-opacity-10"
                        : activity.type === "tasting"
                        ? "bg-[var(--or)] bg-opacity-10"
                        : "bg-[var(--vert)] bg-opacity-10"
                    }`}
                  >
                    {activity.type === "quiz" ? (
                      <span className="text-lg">🎯</span>
                    ) : activity.type === "tasting" ? (
                      <span className="text-lg">🍷</span>
                    ) : (
                      <span className="text-lg">📝</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--gris-dark)] truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-[var(--gris-light)]">
                      {activity.bloc > 0 ? `Bloc ${activity.bloc} • ` : ""}
                      {activity.date}
                    </p>
                  </div>
                  {activity.score !== undefined && (
                    <span className="text-sm font-medium text-[var(--success)]">
                      {activity.score}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--gris-light)] text-center py-4">
              Aucune activité récente. Commencez votre apprentissage !
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/dashboard/degustations/nouvelle"
              className="flex flex-col items-center gap-2 p-4 bg-[var(--beige)] rounded-xl hover:bg-[var(--beige-dark)] transition-colors"
            >
              <span className="text-3xl">🍷</span>
              <span className="text-sm font-medium text-[var(--gris-dark)] text-center">
                Nouvelle dégustation
              </span>
            </Link>
            <Link
              href="/dashboard/aromes"
              className="flex flex-col items-center gap-2 p-4 bg-[var(--beige)] rounded-xl hover:bg-[var(--beige-dark)] transition-colors"
            >
              <span className="text-3xl">👃</span>
              <span className="text-sm font-medium text-[var(--gris-dark)] text-center">
                Roue des arômes
              </span>
            </Link>
            <Link
              href={
                currentBloc
                  ? `/dashboard/blocs/${currentBloc.num}`
                  : "/dashboard/blocs"
              }
              className="flex flex-col items-center gap-2 p-4 bg-[var(--beige)] rounded-xl hover:bg-[var(--beige-dark)] transition-colors"
            >
              <span className="text-3xl">▶️</span>
              <span className="text-sm font-medium text-[var(--gris-dark)] text-center">
                {currentBloc ? `Continuer Bloc ${currentBloc.num}` : "Voir les blocs"}
              </span>
            </Link>
            <Link
              href="/dashboard/glossaire"
              className="flex flex-col items-center gap-2 p-4 bg-[var(--beige)] rounded-xl hover:bg-[var(--beige-dark)] transition-colors"
            >
              <span className="text-3xl">📖</span>
              <span className="text-sm font-medium text-[var(--gris-dark)] text-center">
                Glossaire
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
