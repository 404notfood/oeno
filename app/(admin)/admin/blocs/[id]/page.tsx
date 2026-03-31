import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/layout";
import { getBlocById } from "@/actions/admin";
import { Badge } from "@/components/admin/ui";
import BlocActivitiesTable from "./BlocActivitiesTable";

interface BlocDetailPageProps {
  params: Promise<{ id: string }>;
}

const activityTypeLabels: Record<string, string> = {
  QUIZ: "Quiz",
  FRISE: "Frise chronologique",
  SCHEMA: "Schema interactif",
  ROUE_AROMES: "Roue des aromes",
  FICHE_ANALYSE: "Fiche d'analyse",
  ETUDE_CAS: "Etude de cas",
  ARBRE_DIAGNOSTIC: "Arbre de diagnostic",
  APPARIEMENT: "Appariement",
};

export default async function BlocDetailPage({ params }: BlocDetailPageProps) {
  const { id } = await params;
  const bloc = await getBlocById(id);

  if (!bloc) {
    notFound();
  }

  return (
    <>
      <AdminHeader
        title={`Bloc ${bloc.number} - ${bloc.title}`}
        description={bloc.description || "Gestion des activites du bloc"}
      />

      <div className="p-6 space-y-6">
        {/* Bloc Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{bloc.icon}</span>
                <div>
                  <h2 className="text-xl font-semibold text-bordeaux font-cormorant">
                    {bloc.title}
                  </h2>
                  <p className="text-sm text-gris-tech">Bloc {bloc.number}</p>
                </div>
              </div>
              {bloc.description && (
                <p className="text-gris-tech mt-3">{bloc.description}</p>
              )}
            </div>
            <Badge variant={bloc.isActive ? "success" : "default"}>
              {bloc.isActive ? "Actif" : "Inactif"}
            </Badge>
          </div>
        </div>

        {/* Activities Section */}
        <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-bordeaux font-cormorant">
                Activites
              </h3>
              <p className="text-sm text-gris-tech">
                {bloc.activities?.length || 0} activite(s) dans ce bloc
              </p>
            </div>
            <Link
              href={`/admin/blocs/${bloc.id}/activites/nouvelle`}
              className="btn btn-primary"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouvelle activite
            </Link>
          </div>

          <BlocActivitiesTable
            activities={bloc.activities || []}
            blocId={bloc.id}
            activityTypeLabels={activityTypeLabels}
          />
        </div>
      </div>
    </>
  );
}
