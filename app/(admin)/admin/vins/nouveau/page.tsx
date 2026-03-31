import { AdminHeader } from "@/components/admin/layout";
import { getAllAppellations, getAllGrapeVarieties } from "@/actions/admin";
import WineForm from "../WineForm";

export default async function NewWinePage() {
  const [appellations, grapeVarieties] = await Promise.all([
    getAllAppellations(),
    getAllGrapeVarieties(),
  ]);

  // Map appellations to expected format
  const appellationsList = appellations.map((a) => ({
    id: a.id,
    name: a.name,
    region: a.region,
  }));

  // Map grape varieties to expected format
  const grapesList = grapeVarieties.map((g) => ({
    id: g.id,
    name: g.name,
  }));

  return (
    <>
      <AdminHeader
        title="Nouveau vin"
        description="Ajouter un vin au referentiel"
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <WineForm appellations={appellationsList} grapeVarieties={grapesList} />
        </div>
      </div>
    </>
  );
}
