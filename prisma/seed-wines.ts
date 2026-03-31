import {
  PrismaClient,
  WineType,
  WineColor,
  AcidityLevel,
  AlcoholLevel,
  BodyLevel,
  StructureType,
  TanninLevel,
  FinishLength,
  VariabilityLevel,
} from "@prisma/client";

const prisma = new PrismaClient();

// Donnees des vins depuis documents/vin.json avec mapping vers les enums Prisma
const winesData = [
  {
    id: "chardonnay_bourgogne_blanc_sec",
    cepage: ["Chardonnay"],
    region: "Bourgogne",
    climat: "frais",
    type: "blanc_sec",
    acidite: "moyenne",
    alcool_percu: "modere",
    matiere: "moyenne",
    structure: "tendue",
    tanins: null,
    aromes_dominants: ["pomme", "poire", "floral"],
    finale: "moyenne_a_longue",
    variabilite: "faible",
  },
  {
    id: "chenin_loire_blanc_sec",
    cepage: ["Chenin blanc"],
    region: "Loire",
    climat: "frais",
    type: "blanc_sec",
    acidite: "elevee",
    alcool_percu: "modere",
    matiere: "moyenne",
    structure: "tendue",
    tanins: null,
    aromes_dominants: ["pomme", "coing", "fleurs blanches"],
    finale: "moyenne_a_longue",
    variabilite: "moyenne",
  },
  {
    id: "sauvignon_loire_blanc_sec",
    cepage: ["Sauvignon blanc"],
    region: "Loire",
    climat: "frais",
    type: "blanc_sec",
    acidite: "elevee",
    alcool_percu: "modere",
    matiere: "legere",
    structure: "tendue",
    tanins: null,
    aromes_dominants: ["agrumes", "pierre a fusil", "fleurs blanches"],
    finale: "moyenne",
    variabilite: "faible",
  },
  {
    id: "pinot_noir_bourgogne_rouge",
    cepage: ["Pinot Noir"],
    region: "Bourgogne",
    climat: "frais",
    type: "rouge",
    acidite: "elevee",
    alcool_percu: "modere",
    matiere: "moyenne",
    structure: "tendue",
    tanins: "fins",
    aromes_dominants: ["cerise", "framboise", "terre"],
    finale: "moyenne_a_longue",
    variabilite: "moyenne",
  },
  {
    id: "merlot_bordeaux_rouge",
    cepage: ["Merlot"],
    region: "Bordeaux",
    climat: "tempere",
    type: "rouge",
    acidite: "moyenne",
    alcool_percu: "modere",
    matiere: "ample",
    structure: "ample",
    tanins: "souples",
    aromes_dominants: ["prune", "cassis", "boise"],
    finale: "longue",
    variabilite: "moyenne",
  },
  {
    id: "cabernet_sauvignon_bordeaux_rouge",
    cepage: ["Cabernet Sauvignon"],
    region: "Bordeaux",
    climat: "tempere",
    type: "rouge",
    acidite: "elevee",
    alcool_percu: "modere",
    matiere: "puissante",
    structure: "tendue",
    tanins: "serres",
    aromes_dominants: ["cassis", "poivron", "boise"],
    finale: "longue",
    variabilite: "moyenne",
  },
  {
    id: "grenache_rhone_rouge",
    cepage: ["Grenache"],
    region: "Rhone",
    climat: "chaud",
    type: "rouge",
    acidite: "moyenne",
    alcool_percu: "eleve",
    matiere: "puissante",
    structure: "ample",
    tanins: "marques",
    aromes_dominants: ["fruits rouges", "epices", "terre"],
    finale: "longue",
    variabilite: "moyenne",
  },
  {
    id: "syrah_rhone_rouge",
    cepage: ["Syrah"],
    region: "Rhone",
    climat: "chaud",
    type: "rouge",
    acidite: "moyenne",
    alcool_percu: "modere",
    matiere: "puissante",
    structure: "tendue",
    tanins: "serres",
    aromes_dominants: ["cassis", "poivre", "viande"],
    finale: "longue",
    variabilite: "moyenne",
  },
  {
    id: "viognier_rhone_blanc_sec",
    cepage: ["Viognier"],
    region: "Rhone",
    climat: "chaud",
    type: "blanc_sec",
    acidite: "faible",
    alcool_percu: "eleve",
    matiere: "ample",
    structure: "ample",
    tanins: null,
    aromes_dominants: ["abricot", "fleurs", "miel"],
    finale: "moyenne",
    variabilite: "moyenne",
  },
  {
    id: "riesling_alsace_blanc_sec",
    cepage: ["Riesling"],
    region: "Alsace",
    climat: "frais",
    type: "blanc_sec",
    acidite: "elevee",
    alcool_percu: "modere",
    matiere: "legere",
    structure: "tendue",
    tanins: null,
    aromes_dominants: ["citron", "mineral", "fleurs"],
    finale: "moyenne_a_longue",
    variabilite: "faible",
  },
  {
    id: "gewurztraminer_alsace_blanc_moelleux",
    cepage: ["Gewurztraminer"],
    region: "Alsace",
    climat: "frais",
    type: "blanc_moelleux",
    acidite: "moyenne",
    alcool_percu: "modere",
    matiere: "ample",
    structure: "ample",
    tanins: null,
    aromes_dominants: ["litchi", "rose", "epices"],
    finale: "longue",
    variabilite: "moyenne",
  },
  {
    id: "cabernet_franc_loire_rouge",
    cepage: ["Cabernet Franc"],
    region: "Loire",
    climat: "frais",
    type: "rouge",
    acidite: "elevee",
    alcool_percu: "modere",
    matiere: "moyenne",
    structure: "tendue",
    tanins: "fins",
    aromes_dominants: ["framboise", "herbes", "terre"],
    finale: "moyenne_a_longue",
    variabilite: "moyenne",
  },
  {
    id: "grolleau_loire_rouge",
    cepage: ["Grolleau"],
    region: "Loire",
    climat: "frais",
    type: "rouge",
    acidite: "elevee",
    alcool_percu: "faible",
    matiere: "legere",
    structure: "tendue",
    tanins: "fins",
    aromes_dominants: ["fruits rouges", "floral"],
    finale: "courte",
    variabilite: "moyenne",
  },
  {
    id: "malbec_sud_ouest_rouge",
    cepage: ["Malbec"],
    region: "Sud-Ouest",
    climat: "tempere",
    type: "rouge",
    acidite: "moyenne",
    alcool_percu: "modere",
    matiere: "puissante",
    structure: "tendue",
    tanins: "serres",
    aromes_dominants: ["cassis", "cerise", "terre"],
    finale: "longue",
    variabilite: "moyenne",
  },
  {
    id: "cabernet_sauvignon_sud_ouest_rouge",
    cepage: ["Cabernet Sauvignon"],
    region: "Sud-Ouest",
    climat: "tempere",
    type: "rouge",
    acidite: "moyenne",
    alcool_percu: "modere",
    matiere: "puissante",
    structure: "tendue",
    tanins: "serres",
    aromes_dominants: ["cassis", "poivron", "boise"],
    finale: "longue",
    variabilite: "moyenne",
  },
  {
    id: "merlot_sud_ouest_rouge",
    cepage: ["Merlot"],
    region: "Sud-Ouest",
    climat: "tempere",
    type: "rouge",
    acidite: "moyenne",
    alcool_percu: "modere",
    matiere: "ample",
    structure: "ample",
    tanins: "souples",
    aromes_dominants: ["prune", "cassis", "boise"],
    finale: "longue",
    variabilite: "moyenne",
  },
  {
    id: "grenache_languedoc_rouge",
    cepage: ["Grenache"],
    region: "Languedoc",
    climat: "chaud",
    type: "rouge",
    acidite: "moyenne",
    alcool_percu: "eleve",
    matiere: "puissante",
    structure: "ample",
    tanins: "marques",
    aromes_dominants: ["fruits rouges", "epices", "terre"],
    finale: "longue",
    variabilite: "moyenne",
  },
  {
    id: "syrah_languedoc_rouge",
    cepage: ["Syrah"],
    region: "Languedoc",
    climat: "chaud",
    type: "rouge",
    acidite: "moyenne",
    alcool_percu: "modere",
    matiere: "puissante",
    structure: "tendue",
    tanins: "serres",
    aromes_dominants: ["cassis", "poivre", "viande"],
    finale: "longue",
    variabilite: "moyenne",
  },
  {
    id: "viognier_languedoc_blanc_sec",
    cepage: ["Viognier"],
    region: "Languedoc",
    climat: "chaud",
    type: "blanc_sec",
    acidite: "faible",
    alcool_percu: "eleve",
    matiere: "ample",
    structure: "ample",
    tanins: null,
    aromes_dominants: ["abricot", "fleurs", "miel"],
    finale: "moyenne",
    variabilite: "moyenne",
  },
];

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

// Fonction pour generer un nom de vin lisible
function generateWineName(data: (typeof winesData)[0]): string {
  const cepage = data.cepage[0];
  const region = data.region;
  const typeLabel =
    data.type === "rouge"
      ? "Rouge"
      : data.type === "blanc_sec"
        ? "Blanc Sec"
        : "Blanc Moelleux";
  return `${cepage} - ${region} (${typeLabel})`;
}

// Fonction pour determiner WineType et WineColor
function getWineTypeAndColor(
  type: string
): { wineType: WineType; wineColor: WineColor } {
  switch (type) {
    case "rouge":
      return { wineType: WineType.STILL, wineColor: WineColor.RED };
    case "blanc_sec":
      return { wineType: WineType.STILL, wineColor: WineColor.WHITE };
    case "blanc_moelleux":
      return { wineType: WineType.SWEET, wineColor: WineColor.WHITE };
    default:
      return { wineType: WineType.STILL, wineColor: WineColor.WHITE };
  }
}

export async function seedWines() {
  console.log("\n🍷 Seeding vins avec profils sensoriels...");

  // D'abord, creer les cepages manquants
  const additionalGrapes = [
    { name: "Chenin blanc", color: WineColor.WHITE, origin: "Loire, France" },
    { name: "Viognier", color: WineColor.WHITE, origin: "Rhone, France" },
    { name: "Gewurztraminer", color: WineColor.WHITE, origin: "Alsace, France" },
    { name: "Cabernet Franc", color: WineColor.RED, origin: "Loire, France" },
    { name: "Grolleau", color: WineColor.RED, origin: "Loire, France" },
    { name: "Malbec", color: WineColor.RED, origin: "Sud-Ouest, France" },
  ];

  for (const grape of additionalGrapes) {
    await prisma.grapeVariety.upsert({
      where: { name: grape.name },
      update: {},
      create: grape,
    });
  }
  console.log(`  ✅ Cepages supplementaires crees/verifies`);

  // Creer les vins avec leurs profils sensoriels
  for (const wineData of winesData) {
    const { wineType, wineColor } = getWineTypeAndColor(wineData.type);
    const wineName = generateWineName(wineData);

    // Trouver le cepage
    const grape = await prisma.grapeVariety.findUnique({
      where: { name: wineData.cepage[0] },
    });

    if (!grape) {
      console.log(`  ⚠️ Cepage non trouve: ${wineData.cepage[0]}`);
      continue;
    }

    // Creer ou mettre a jour le vin
    const wine = await prisma.wine.upsert({
      where: {
        id: wineData.id,
      },
      update: {
        name: wineName,
        type: wineType,
        color: wineColor,
        region: wineData.region,
        climate: wineData.climat,
        isActive: true,
      },
      create: {
        id: wineData.id,
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
      update: {},
      create: {
        wineId: wine.id,
        grapeVarietyId: grape.id,
        percentage: 100,
      },
    });

    // Creer le profil sensoriel
    await prisma.wineSensoryProfile.upsert({
      where: { wineId: wine.id },
      update: {
        acidity: acidityMap[wineData.acidite],
        perceivedAlcohol: alcoholMap[wineData.alcool_percu],
        body: bodyMap[wineData.matiere],
        structure: structureMap[wineData.structure],
        tannins: wineData.tanins ? tanninMap[wineData.tanins] : null,
        finish: finishMap[wineData.finale],
        dominantAromas: wineData.aromes_dominants,
        variability: variabilityMap[wineData.variabilite],
      },
      create: {
        wineId: wine.id,
        acidity: acidityMap[wineData.acidite],
        perceivedAlcohol: alcoholMap[wineData.alcool_percu],
        body: bodyMap[wineData.matiere],
        structure: structureMap[wineData.structure],
        tannins: wineData.tanins ? tanninMap[wineData.tanins] : null,
        finish: finishMap[wineData.finale],
        dominantAromas: wineData.aromes_dominants,
        variability: variabilityMap[wineData.variabilite],
      },
    });

    console.log(`  ✅ ${wineName}`);
  }

  console.log(`\n🎉 ${winesData.length} vins avec profils sensoriels crees!`);
}

// Pour execution standalone
if (require.main === module) {
  seedWines()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
