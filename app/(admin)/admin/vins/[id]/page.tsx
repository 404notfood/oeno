import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/layout";
import { getWineById, getAllAppellations, getAllGrapeVarieties } from "@/actions/admin";
import WineForm from "../WineForm";

interface EditWinePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWinePage({ params }: EditWinePageProps) {
  const { id } = await params;
  const [wine, appellations, grapeVarieties] = await Promise.all([
    getWineById(id),
    getAllAppellations(),
    getAllGrapeVarieties(),
  ]);

  if (!wine) {
    notFound();
  }

  // Map wine data to match the expected interface
  const wineData = {
    id: wine.id,
    name: wine.name,
    type: wine.type,
    color: wine.color,
    vintage: wine.vintage,
    isAlcoholic: wine.isAlcoholic,
    alcoholLevel: wine.alcoholLevel,
    producer: wine.producer,
    region: wine.region,
    country: wine.country,
    imageUrl: wine.imageUrl,
    description: wine.description,
    climate: wine.climate,
    appellationId: wine.appellationId,
    isActive: wine.isActive,
    grapeVarieties: wine.grapeVarieties.map((g) => ({
      grapeVarietyId: g.grapeVarietyId,
      percentage: g.percentage,
    })),
  };

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
        title="Modifier le vin"
        description={`Edition de "${wine.name}"`}
      />

      <div className="p-6">
        <div className="max-w-2xl">
          <WineForm wine={wineData} appellations={appellationsList} grapeVarieties={grapesList} />
        </div>
      </div>
    </>
  );
}
