import { getAvailableWines } from "@/actions/tastings";
import NouvelleDegustationForm from "./NouvelleDegustationForm";

export default async function NouvelleDegustationPage() {
  const wines = await getAvailableWines();

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Nouvelle dégustation</h1>
        <p className="text-[var(--gris-tech)]">
          Créez une nouvelle fiche de dégustation pour analyser un vin.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <NouvelleDegustationForm wines={wines} />
      </div>
    </>
  );
}
