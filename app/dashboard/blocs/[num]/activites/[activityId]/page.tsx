import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import ActivityContent from "@/components/activities/ActivityContent";

interface PageProps {
  params: Promise<{ num: string; activityId: string }>;
}

async function getActivityWithProgress(activityId: string, userId: string) {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    include: {
      block: true,
    },
  });

  if (!activity) return null;

  // Get user's progress on this activity
  const progress = await prisma.userProgress.findUnique({
    where: {
      userId_activityId: {
        userId,
        activityId,
      },
    },
  });

  return {
    ...activity,
    progress: progress || null,
  };
}

const activityTypeLabels: Record<string, string> = {
  LESSON: "Leçon",
  QUIZ: "Quiz",
  FRISE: "Frise chronologique",
  SCHEMA: "Schéma interactif",
  ROUE_AROMES: "Roue des arômes",
  FICHE_ANALYSE: "Fiche d'analyse",
  ETUDE_CAS: "Étude de cas",
  ARBRE_DIAGNOSTIC: "Arbre de diagnostic",
  APPARIEMENT: "Appariement",
  INTERACTIVE: "Activité interactive",
};

const activityTypeIcons: Record<string, string> = {
  LESSON: "📖",
  QUIZ: "❓",
  FRISE: "📅",
  SCHEMA: "🔀",
  ROUE_AROMES: "👃",
  FICHE_ANALYSE: "📋",
  ETUDE_CAS: "🔍",
  ARBRE_DIAGNOSTIC: "🌳",
  APPARIEMENT: "🔗",
  INTERACTIVE: "🎮",
};

export default async function ActivityPage({ params }: PageProps) {
  const session = await getServerSession();
  const { num, activityId } = await params;
  const blockNumber = parseInt(num);

  if (isNaN(blockNumber) || blockNumber < 1 || blockNumber > 8) {
    notFound();
  }

  const activity = await getActivityWithProgress(activityId, session!.user.id);

  if (!activity || activity.block.number !== blockNumber) {
    notFound();
  }

  const isCompleted = activity.progress?.status === "COMPLETED";

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-[var(--gris-tech)]">
          <li>
            <Link href="/dashboard" className="hover:text-[var(--bordeaux)]">
              Tableau de bord
            </Link>
          </li>
          <li>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li>
            <Link href="/dashboard/blocs" className="hover:text-[var(--bordeaux)]">
              Les 8 blocs
            </Link>
          </li>
          <li>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li>
            <Link href={`/dashboard/blocs/${blockNumber}`} className="hover:text-[var(--bordeaux)]">
              Bloc {blockNumber}
            </Link>
          </li>
          <li>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="text-[var(--bordeaux)] font-medium truncate max-w-[200px]">
            {activity.title}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="card mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--bordeaux)] to-[var(--or)] flex items-center justify-center text-3xl shrink-0">
            {activityTypeIcons[activity.type] || "📝"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-[var(--bordeaux)] bg-[var(--bordeaux)] bg-opacity-10 px-2 py-1 rounded-full">
                Bloc {blockNumber}
              </span>
              <span className="text-xs text-[var(--gris-light)] bg-[var(--beige)] px-2 py-1 rounded-full">
                {activityTypeLabels[activity.type] || activity.type}
              </span>
              {isCompleted && (
                <span className="text-xs font-medium text-[var(--success)] bg-[var(--success)] bg-opacity-10 px-2 py-1 rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Complétée
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-[var(--gris-dark)] mb-2">
              {activity.title}
            </h1>
            <p className="text-[var(--gris-tech)]">{activity.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-[var(--gris-light)]">
              {activity.duration && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {activity.duration} min
                </span>
              )}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                {activity.points} points
              </span>
              {activity.progress?.score !== null && activity.progress?.score !== undefined && (
                <span className="flex items-center gap-1 text-[var(--success)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Score: {activity.progress.score}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Content */}
      <ActivityContent
        activity={activity}
        userId={session!.user.id}
        isCompleted={isCompleted}
      />

      {/* Navigation */}
      <div className="mt-8">
        <Link
          href={`/dashboard/blocs/${blockNumber}`}
          className="btn btn-secondary inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour au Bloc {blockNumber}
        </Link>
      </div>
    </>
  );
}
