import { AdminHeader } from "@/components/admin/layout";
import { getBlocs } from "@/actions/admin";
import Link from "next/link";

export default async function BlocsPage() {
  const blocs = await getBlocs();

  return (
    <>
      <AdminHeader
        title="Blocs de competences"
        description="Les 8 blocs de competences en oenologie"
      />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {blocs.map((bloc) => (
            <Link
              key={bloc.id}
              href={`/admin/blocs/${bloc.id}`}
              className="bg-white rounded-xl shadow-sm border border-beige-dark p-6 hover:shadow-md hover:border-bordeaux/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: bloc.color ? `${bloc.color}20` : "#6B1F3D20" }}
                >
                  {bloc.icon || bloc.number}
                </div>
                <div>
                  <p className="text-sm text-gris-tech">Bloc {bloc.number}</p>
                  <h3 className="font-semibold text-gris-dark font-cormorant">
                    {bloc.title}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-gris-tech line-clamp-2 mb-4">
                {bloc.description || "Aucune description"}
              </p>
              <div className="flex items-center justify-between text-xs text-gris-tech">
                <span>{bloc._count.activities} activites</span>
                <span>{bloc._count.quizzes} quiz</span>
                <span
                  className={`px-2 py-1 rounded-full ${
                    bloc.isActive
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  {bloc.isActive ? "Actif" : "Inactif"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
