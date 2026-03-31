import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getResources() {
  const [blocks, activities, quizzes] = await Promise.all([
    prisma.competencyBlock.findMany({
      where: { isActive: true },
      include: {
        activities: {
          where: { isActive: true },
        },
        quizzes: {
          where: { isActive: true },
        },
      },
      orderBy: { number: "asc" },
    }),
    prisma.activity.findMany({
      where: { isActive: true },
      include: { block: true },
      orderBy: { title: "asc" },
    }),
    prisma.quiz.findMany({
      where: { isActive: true },
      include: {
        block: true,
        questions: true,
      },
      orderBy: { title: "asc" },
    }),
  ]);

  return { blocks, activities, quizzes };
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

export default async function TeacherResourcesPage() {
  const { blocks, activities, quizzes } = await getResources();

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ressources pédagogiques</h1>
        <p className="text-[var(--gris-tech)]">
          Explorez les activités et quiz disponibles pour créer vos séquences.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--bordeaux)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">Blocs</p>
              <p className="text-2xl font-bold text-[var(--bordeaux)] font-cormorant">
                {blocks.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--vert)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">Activités</p>
              <p className="text-2xl font-bold text-[var(--vert)] font-cormorant">
                {activities.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--or)] bg-opacity-10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">❓</span>
            </div>
            <div>
              <p className="text-sm text-[var(--gris-light)]">Quiz</p>
              <p className="text-2xl font-bold text-[var(--or)] font-cormorant">
                {quizzes.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blocks Overview */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Les 8 blocs de compétences</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="p-4 bg-[var(--beige)] rounded-xl hover:bg-[var(--beige-dark)] transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{block.icon}</span>
                <div>
                  <p className="text-xs text-[var(--gris-light)]">
                    Bloc {block.number}
                  </p>
                  <p className="font-medium text-[var(--gris-dark)]">
                    {block.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-[var(--gris-tech)]">
                <span>{block.activities.length} activités</span>
                <span>{block.quizzes.length} quiz</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activities by Type */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Activités par type</h2>
        <div className="space-y-3">
          {Object.entries(
            activities.reduce((acc, activity) => {
              const type = activity.type;
              if (!acc[type]) acc[type] = [];
              acc[type].push(activity);
              return acc;
            }, {} as Record<string, typeof activities>)
          ).map(([type, typeActivities]) => (
            <div
              key={type}
              className="p-4 bg-[var(--beige)] rounded-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {activityTypeIcons[type] || "📝"}
                  </span>
                  <div>
                    <p className="font-medium text-[var(--gris-dark)]">
                      {activityTypeLabels[type] || type}
                    </p>
                    <p className="text-xs text-[var(--gris-light)]">
                      {typeActivities.length} activité
                      {typeActivities.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {typeActivities.slice(0, 5).map((activity) => (
                  <span
                    key={activity.id}
                    className="text-xs bg-white px-3 py-1.5 rounded-lg text-[var(--gris-dark)]"
                    title={activity.description || undefined}
                  >
                    {activity.title}
                    {activity.block && (
                      <span className="text-[var(--gris-light)] ml-1">
                        (Bloc {activity.block.number})
                      </span>
                    )}
                  </span>
                ))}
                {typeActivities.length > 5 && (
                  <span className="text-xs text-[var(--gris-light)] px-2 py-1">
                    +{typeActivities.length - 5} autres
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quiz disponibles</h2>
        {quizzes.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-4 bg-[var(--beige)] rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[var(--or)] bg-opacity-10 rounded-lg flex items-center justify-center shrink-0">
                    ❓
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[var(--gris-dark)]">
                      {quiz.title}
                    </p>
                    {quiz.description && (
                      <p className="text-sm text-[var(--gris-tech)] line-clamp-2 mb-2">
                        {quiz.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-[var(--gris-light)]">
                      {quiz.block && <span>Bloc {quiz.block.number}</span>}
                      <span>{quiz.questions.length} questions</span>
                      <span>Score min: {quiz.passingScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--gris-light)] py-8">
            Aucun quiz disponible
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="card mt-8 bg-gradient-to-br from-[var(--vert)] to-[var(--bordeaux)] text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">
              Créez votre séquence personnalisée
            </h3>
            <p className="text-white/80">
              Combinez ces ressources pour créer des parcours adaptés à vos
              élèves.
            </p>
          </div>
          <Link
            href="/enseignant/sequences/nouvelle"
            className="btn bg-white text-[var(--vert)] hover:bg-white/90 shrink-0"
          >
            Nouvelle séquence
          </Link>
        </div>
      </div>
    </>
  );
}
