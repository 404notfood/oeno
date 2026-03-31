"use server";

import { prisma } from "@/lib/prisma";
import {
  Prisma,
  AcidityLevel,
  AlcoholLevel,
  BodyLevel,
  StructureType,
  TanninLevel,
  FinishLength,
  VariabilityLevel,
} from "@prisma/client";
import { requireAdmin } from "@/lib/auth-server";
import { createAuditLog } from "./audit";
import {
  createWineSchema,
  updateWineSchema,
  wineFiltersSchema,
  type CreateWineInput,
  type UpdateWineInput,
  type WineFilters,
} from "@/lib/validations/admin";
import { importWinesSchema, type ImportWineInput } from "@/lib/validations/admin/wines";
import { revalidatePath } from "next/cache";

export async function getWines(filters: Partial<WineFilters> = {}) {
  await requireAdmin();

  const validatedFilters = wineFiltersSchema.parse(filters);
  const {
    search,
    type,
    color,
    appellationId,
    region,
    country,
    minVintage,
    maxVintage,
    page,
    limit,
    sortBy,
    sortOrder,
  } = validatedFilters;

  const where: Record<string, unknown> = {};

  if (type) where.type = type;
  if (color) where.color = color;
  if (appellationId) where.appellationId = appellationId;
  if (region) where.region = region;
  if (country) where.country = country;

  if (minVintage || maxVintage) {
    where.vintage = {
      ...(minVintage && { gte: minVintage }),
      ...(maxVintage && { lte: maxVintage }),
    };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { producer: { contains: search, mode: "insensitive" } },
      { region: { contains: search, mode: "insensitive" } },
    ];
  }

  const [wines, total] = await Promise.all([
    prisma.wine.findMany({
      where,
      include: {
        appellation: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        grapeVarieties: {
          include: {
            grapeVariety: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
        _count: {
          select: {
            tastings: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.wine.count({ where }),
  ]);

  return {
    data: wines,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getWineById(id: string) {
  await requireAdmin();

  const wine = await prisma.wine.findUnique({
    where: { id },
    include: {
      appellation: true,
      grapeVarieties: {
        include: {
          grapeVariety: true,
        },
      },
      _count: {
        select: {
          tastings: true,
        },
      },
    },
  });

  if (!wine) {
    throw new Error("Vin non trouve");
  }

  return wine;
}

export async function createWine(data: CreateWineInput) {
  await requireAdmin();

  const validatedData = createWineSchema.parse(data);
  const { grapeVarietyIds, sensoryProfile, appellationId, ...wineData } = validatedData;

  const wine = await prisma.wine.create({
    data: {
      ...wineData,
      appellationId: appellationId || undefined,
      grapeVarieties: grapeVarietyIds
        ? {
            create: grapeVarietyIds.map((g) => ({
              grapeVarietyId: g.grapeVarietyId,
              percentage: g.percentage,
            })),
          }
        : undefined,
      sensoryProfile: sensoryProfile
        ? {
            create: {
              ...sensoryProfile,
              tannins: sensoryProfile.tannins || undefined,
            },
          }
        : undefined,
    },
  });

  await createAuditLog({
    action: "CREATE",
    entityType: "Wine",
    entityId: wine.id,
    newValues: {
      name: wine.name,
      type: wine.type,
      color: wine.color,
    },
  });

  revalidatePath("/admin/vins");

  return wine;
}

export async function updateWine(id: string, data: UpdateWineInput) {
  await requireAdmin();

  const validatedData = updateWineSchema.parse(data);
  const { grapeVarietyIds, appellationId, ...wineData } = validatedData;

  const existingWine = await prisma.wine.findUnique({
    where: { id },
  });

  if (!existingWine) {
    throw new Error("Vin non trouve");
  }

  // Build update data with proper null handling
  const updateData: Prisma.WineUpdateInput = {
    ...Object.fromEntries(
      Object.entries(wineData).filter(([, v]) => v !== undefined)
    ),
  };

  // Handle appellationId separately since it can be null (to unset)
  if (appellationId !== undefined) {
    if (appellationId === null) {
      updateData.appellation = { disconnect: true };
    } else {
      updateData.appellation = { connect: { id: appellationId } };
    }
  }

  // Update wine
  const wine = await prisma.wine.update({
    where: { id },
    data: updateData,
  });

  // Update grape varieties if provided
  if (grapeVarietyIds !== undefined) {
    // Delete existing associations
    await prisma.wineGrapeVariety.deleteMany({
      where: { wineId: id },
    });

    // Create new associations
    if (grapeVarietyIds && grapeVarietyIds.length > 0) {
      await prisma.wineGrapeVariety.createMany({
        data: grapeVarietyIds.map((g) => ({
          wineId: id,
          grapeVarietyId: g.grapeVarietyId,
          percentage: g.percentage,
        })),
      });
    }
  }

  await createAuditLog({
    action: "UPDATE",
    entityType: "Wine",
    entityId: id,
    oldValues: { name: existingWine.name },
    newValues: { name: wine.name },
  });

  revalidatePath("/admin/vins");
  revalidatePath(`/admin/vins/${id}`);

  return wine;
}

export async function deleteWine(id: string) {
  await requireAdmin();

  const wine = await prisma.wine.findUnique({
    where: { id },
    include: {
      _count: {
        select: { tastings: true },
      },
    },
  });

  if (!wine) {
    throw new Error("Vin non trouve");
  }

  if (wine._count.tastings > 0) {
    throw new Error("Impossible de supprimer un vin avec des degustations associees");
  }

  await prisma.wine.delete({
    where: { id },
  });

  await createAuditLog({
    action: "DELETE",
    entityType: "Wine",
    entityId: id,
    oldValues: { name: wine.name },
  });

  revalidatePath("/admin/vins");
}

export async function getWinesCount() {
  await requireAdmin();

  const total = await prisma.wine.count();
  return { total };
}

export async function getWineRegions() {
  const regions = await prisma.wine.findMany({
    select: { region: true },
    distinct: ["region"],
    where: { region: { not: null } },
  });

  return regions.map((r) => r.region).filter(Boolean) as string[];
}

export async function getWineCountries() {
  const countries = await prisma.wine.findMany({
    select: { country: true },
    distinct: ["country"],
  });

  return countries.map((c) => c.country);
}

// ============================================
// IMPORT JSON
// ============================================

// Mappings pour convertir les valeurs JSON vers les enums Prisma
const acidityMap: Record<string, AcidityLevel> = {
  faible: AcidityLevel.LOW,
  moyenne: AcidityLevel.MEDIUM,
  elevee: AcidityLevel.HIGH,
};

const alcoholMap: Record<string, AlcoholLevel> = {
  faible: AlcoholLevel.LOW,
  modere: AlcoholLevel.MODERATE,
  eleve: AlcoholLevel.HIGH,
};

const bodyMap: Record<string, BodyLevel> = {
  legere: BodyLevel.LIGHT,
  moyenne: BodyLevel.MEDIUM,
  ample: BodyLevel.FULL,
  puissante: BodyLevel.POWERFUL,
};

const structureMap: Record<string, StructureType> = {
  tendue: StructureType.TENSE,
  ample: StructureType.AMPLE,
};

const tanninMap: Record<string, TanninLevel> = {
  fins: TanninLevel.FINE,
  souples: TanninLevel.SOFT,
  serres: TanninLevel.FIRM,
  marques: TanninLevel.PRONOUNCED,
};

const finishMap: Record<string, FinishLength> = {
  courte: FinishLength.SHORT,
  moyenne: FinishLength.MEDIUM,
  moyenne_a_longue: FinishLength.MEDIUM_LONG,
  longue: FinishLength.LONG,
};

const variabilityMap: Record<string, VariabilityLevel> = {
  faible: VariabilityLevel.LOW,
  moyenne: VariabilityLevel.MEDIUM,
  elevee: VariabilityLevel.HIGH,
};

function getWineTypeAndColor(type: string): { wineType: "STILL" | "SPARKLING" | "FORTIFIED" | "SWEET"; wineColor: "RED" | "WHITE" | "ROSE" | "ORANGE" } {
  switch (type) {
    case "rouge":
      return { wineType: "STILL", wineColor: "RED" };
    case "blanc_sec":
      return { wineType: "STILL", wineColor: "WHITE" };
    case "blanc_moelleux":
      return { wineType: "SWEET", wineColor: "WHITE" };
    case "rose":
      return { wineType: "STILL", wineColor: "ROSE" };
    default:
      return { wineType: "STILL", wineColor: "WHITE" };
  }
}

function generateWineName(data: ImportWineInput): string {
  const cepage = data.cepage[0];
  const region = data.region;
  const typeLabel =
    data.type === "rouge"
      ? "Rouge"
      : data.type === "blanc_sec"
        ? "Blanc Sec"
        : data.type === "blanc_moelleux"
          ? "Blanc Moelleux"
          : data.type;
  return `${cepage} - ${region} (${typeLabel})`;
}

export async function importWinesFromJson(jsonData: unknown) {
  await requireAdmin();

  // Valider les donnees
  const validatedData = importWinesSchema.parse(jsonData);

  const results = {
    created: 0,
    updated: 0,
    errors: [] as string[],
  };

  for (const wineData of validatedData) {
    try {
      const { wineType, wineColor } = getWineTypeAndColor(wineData.type);
      const wineName = generateWineName(wineData);
      const wineId = wineData.id || wineName.toLowerCase().replace(/[^a-z0-9]+/g, "_");

      // Verifier/creer les cepages
      for (const cepageName of wineData.cepage) {
        await prisma.grapeVariety.upsert({
          where: { name: cepageName },
          update: {},
          create: {
            name: cepageName,
            color: wineColor,
            origin: `${wineData.region}, France`,
          },
        });
      }

      // Trouver le premier cepage
      const grape = await prisma.grapeVariety.findUnique({
        where: { name: wineData.cepage[0] },
      });

      if (!grape) {
        results.errors.push(`Cepage non trouve: ${wineData.cepage[0]}`);
        continue;
      }

      // Creer ou mettre a jour le vin
      const existingWine = await prisma.wine.findUnique({
        where: { id: wineId },
      });

      const wine = await prisma.wine.upsert({
        where: { id: wineId },
        update: {
          name: wineName,
          type: wineType,
          color: wineColor,
          region: wineData.region,
          climate: wineData.climat,
          isActive: true,
        },
        create: {
          id: wineId,
          name: wineName,
          type: wineType,
          color: wineColor,
          region: wineData.region,
          climate: wineData.climat,
          isActive: true,
        },
      });

      // Lier le cepage au vin
      await prisma.wineGrapeVariety.upsert({
        where: {
          wineId_grapeVarietyId: {
            wineId: wine.id,
            grapeVarietyId: grape.id,
          },
        },
        update: { percentage: 100 },
        create: {
          wineId: wine.id,
          grapeVarietyId: grape.id,
          percentage: 100,
        },
      });

      // Creer ou mettre a jour le profil sensoriel
      await prisma.wineSensoryProfile.upsert({
        where: { wineId: wine.id },
        update: {
          acidity: acidityMap[wineData.acidite] || AcidityLevel.MEDIUM,
          perceivedAlcohol: alcoholMap[wineData.alcool_percu] || AlcoholLevel.MODERATE,
          body: bodyMap[wineData.matiere] || BodyLevel.MEDIUM,
          structure: structureMap[wineData.structure] || StructureType.TENSE,
          tannins: wineData.tanins ? tanninMap[wineData.tanins] : null,
          finish: finishMap[wineData.finale] || FinishLength.MEDIUM,
          dominantAromas: wineData.aromes_dominants,
          variability: variabilityMap[wineData.variabilite] || VariabilityLevel.MEDIUM,
        },
        create: {
          wineId: wine.id,
          acidity: acidityMap[wineData.acidite] || AcidityLevel.MEDIUM,
          perceivedAlcohol: alcoholMap[wineData.alcool_percu] || AlcoholLevel.MODERATE,
          body: bodyMap[wineData.matiere] || BodyLevel.MEDIUM,
          structure: structureMap[wineData.structure] || StructureType.TENSE,
          tannins: wineData.tanins ? tanninMap[wineData.tanins] : null,
          finish: finishMap[wineData.finale] || FinishLength.MEDIUM,
          dominantAromas: wineData.aromes_dominants,
          variability: variabilityMap[wineData.variabilite] || VariabilityLevel.MEDIUM,
        },
      });

      if (existingWine) {
        results.updated++;
      } else {
        results.created++;
      }
    } catch (error) {
      results.errors.push(
        `Erreur pour ${wineData.cepage[0]} ${wineData.region}: ${error instanceof Error ? error.message : "Erreur inconnue"}`
      );
    }
  }

  await createAuditLog({
    action: "CREATE",
    entityType: "Wine",
    newValues: {
      action: "import_json",
      created: results.created,
      updated: results.updated,
      errors: results.errors.length,
    },
  });

  revalidatePath("/admin/vins");

  return results;
}

export async function getWineWithSensoryProfile(id: string) {
  await requireAdmin();

  const wine = await prisma.wine.findUnique({
    where: { id },
    include: {
      appellation: true,
      grapeVarieties: {
        include: {
          grapeVariety: true,
        },
      },
      sensoryProfile: true,
      _count: {
        select: {
          tastings: true,
        },
      },
    },
  });

  if (!wine) {
    throw new Error("Vin non trouve");
  }

  return wine;
}

export async function updateWineSensoryProfile(
  wineId: string,
  data: {
    acidity: AcidityLevel;
    perceivedAlcohol: AlcoholLevel;
    body: BodyLevel;
    structure: StructureType;
    tannins?: TanninLevel | null;
    finish: FinishLength;
    dominantAromas: string[];
    variability: VariabilityLevel;
    typicalCharacteristics?: string | null;
    pedagogicalNotes?: string | null;
  }
) {
  await requireAdmin();

  const wine = await prisma.wine.findUnique({
    where: { id: wineId },
  });

  if (!wine) {
    throw new Error("Vin non trouve");
  }

  const profile = await prisma.wineSensoryProfile.upsert({
    where: { wineId },
    update: data,
    create: {
      wineId,
      ...data,
    },
  });

  await createAuditLog({
    action: "UPDATE",
    entityType: "WineSensoryProfile",
    entityId: profile.id,
    newValues: { wineId, ...data },
  });

  revalidatePath("/admin/vins");
  revalidatePath(`/admin/vins/${wineId}`);

  return profile;
}

export async function deleteWineSensoryProfile(wineId: string) {
  await requireAdmin();

  const profile = await prisma.wineSensoryProfile.findUnique({
    where: { wineId },
  });

  if (!profile) {
    throw new Error("Profil sensoriel non trouve");
  }

  await prisma.wineSensoryProfile.delete({
    where: { wineId },
  });

  await createAuditLog({
    action: "DELETE",
    entityType: "WineSensoryProfile",
    entityId: profile.id,
    oldValues: { wineId },
  });

  revalidatePath("/admin/vins");
  revalidatePath(`/admin/vins/${wineId}`);
}
