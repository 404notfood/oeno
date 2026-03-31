import { prisma } from "@/lib/prisma";
import AromesClient from "./AromesClient";

async function getAromesData() {
  const categories = await prisma.aromaCategory.findMany({
    orderBy: { name: "asc" },
    include: {
      subCategories: {
        orderBy: { name: "asc" },
        include: {
          aromas: {
            orderBy: { name: "asc" },
          },
        },
      },
    },
  });

  return categories;
}

export default async function AromesPage() {
  const categories = await getAromesData();

  // Count total aromas
  const totalAromas = categories.reduce(
    (acc, cat) =>
      acc +
      cat.subCategories.reduce(
        (subAcc, subCat) => subAcc + subCat.aromas.length,
        0
      ),
    0
  );

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Roue des arômes</h1>
        <p className="text-[var(--gris-tech)]">
          Explorez les {totalAromas} arômes classés en {categories.length}{" "}
          familles pour affiner votre palais.
        </p>
      </div>

      <AromesClient categories={categories} />
    </>
  );
}
