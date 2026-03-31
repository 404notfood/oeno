import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { getAvailableActivities } from "@/actions/sequences";
import NouvelleSequenceForm from "./NouvelleSequenceForm";

export default async function NouvelleSequencePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  if (
    session.user.role !== "TEACHER" &&
    session.user.role !== "ADMIN" &&
    session.user.role !== "SUPER_ADMIN"
  ) {
    redirect("/dashboard");
  }

  const blocks = await getAvailableActivities();

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Nouvelle sequence</h1>
        <p className="text-[var(--gris-tech)]">
          Creez une sequence pedagogique en selectionnant et ordonnant les
          activites de votre choix.
        </p>
      </div>

      {/* Form */}
      <NouvelleSequenceForm blocks={blocks} />
    </>
  );
}
