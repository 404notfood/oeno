import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";
import { seedWines } from "./seed-wines";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Hash du mot de passe par defaut: "Password123!"
  const defaultPassword = await hash("Password123!", 12);

  // ============================================
  // UTILISATEURS
  // ============================================

  // Eleve
  const student = await prisma.user.upsert({
    where: { email: "eleve@oenoclass.fr" },
    update: {},
    create: {
      email: "eleve@oenoclass.fr",
      firstName: "Marie",
      lastName: "Dupont",
      role: UserRole.STUDENT,
      accounts: {
        create: {
          accountId: "eleve@oenoclass.fr",
          providerId: "credential",
          password: defaultPassword,
        },
      },
    },
  });
  console.log(`✅ Eleve cree: ${student.email}`);

  // Enseignant
  const teacher = await prisma.user.upsert({
    where: { email: "enseignant@oenoclass.fr" },
    update: {},
    create: {
      email: "enseignant@oenoclass.fr",
      firstName: "Jean",
      lastName: "Martin",
      role: UserRole.TEACHER,
      accounts: {
        create: {
          accountId: "enseignant@oenoclass.fr",
          providerId: "credential",
          password: defaultPassword,
        },
      },
    },
  });
  console.log(`✅ Enseignant cree: ${teacher.email}`);

  // Administrateur
  const admin = await prisma.user.upsert({
    where: { email: "admin@oenoclass.fr" },
    update: {},
    create: {
      email: "admin@oenoclass.fr",
      firstName: "Pierre",
      lastName: "Durand",
      role: UserRole.ADMIN,
      accounts: {
        create: {
          accountId: "admin@oenoclass.fr",
          providerId: "credential",
          password: defaultPassword,
        },
      },
    },
  });
  console.log(`✅ Admin cree: ${admin.email}`);

  // Super Administrateur
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@oenoclass.fr" },
    update: {},
    create: {
      email: "superadmin@oenoclass.fr",
      firstName: "Lucas",
      lastName: "Bernard",
      role: UserRole.SUPER_ADMIN,
      accounts: {
        create: {
          accountId: "superadmin@oenoclass.fr",
          providerId: "credential",
          password: defaultPassword,
        },
      },
    },
  });
  console.log(`✅ Super Admin cree: ${superAdmin.email}`);

  // ============================================
  // BLOCS DE COMPETENCES
  // ============================================

  const blocsData = [
    {
      number: 1,
      title: "Culture vitivinicole",
      icon: "🍇",
      color: "bordeaux",
      description: "Comprendre la filière vitivinicole française et internationale, maîtriser le vocabulaire professionnel et connaître l'histoire du vin.",
    },
    {
      number: 2,
      title: "Vigne et raisin",
      icon: "🌿",
      color: "vert",
      description: "Identifier les facteurs de qualité du raisin, comprendre le cycle végétatif de la vigne et les pratiques culturales.",
    },
    {
      number: 3,
      title: "Vinification",
      icon: "🍷",
      color: "bordeaux",
      description: "Comprendre les étapes de vinification (blanc, rouge, rosé, effervescent) et leurs impacts sur le profil du vin.",
    },
    {
      number: 4,
      title: "Analyse sensorielle",
      icon: "👃",
      color: "or",
      description: "Appliquer une méthode d'analyse sensorielle structurée : examen visuel, olfactif et gustatif du vin.",
    },
    {
      number: 5,
      title: "Cépages et styles",
      icon: "🍃",
      color: "vert",
      description: "Associer cépages, profils aromatiques et styles de vins. Connaître les grands cépages français et internationaux.",
    },
    {
      number: 6,
      title: "Qualité et défauts",
      icon: "🔍",
      color: "bordeaux",
      description: "Identifier et diagnostiquer les défauts du vin (oxydation, réduction, goût de bouchon, etc.) et comprendre leurs origines.",
    },
    {
      number: 7,
      title: "Vins sans alcool",
      icon: "🥂",
      color: "or",
      description: "Comprendre les procédés de désalcoolisation, les innovations du secteur et les alternatives aux vins traditionnels.",
    },
    {
      number: 8,
      title: "Réglementation",
      icon: "⚖️",
      color: "gris-tech",
      description: "Adopter une posture professionnelle responsable : réglementation, étiquetage, santé publique et consommation responsable.",
    },
  ];

  for (const bloc of blocsData) {
    await prisma.competencyBlock.upsert({
      where: { number: bloc.number },
      update: {
        description: bloc.description,
      },
      create: {
        number: bloc.number,
        title: bloc.title,
        description: bloc.description,
        icon: bloc.icon,
        color: bloc.color,
        order: bloc.number,
      },
    });
  }
  console.log(`✅ 8 blocs de competences crees`);

  // ============================================
  // CATEGORIES D'AROMES
  // ============================================

  const aromaCategories = [
    { name: "Fruites", color: "#E74C3C", order: 1 },
    { name: "Floraux", color: "#9B59B6", order: 2 },
    { name: "Vegetaux", color: "#27AE60", order: 3 },
    { name: "Epices", color: "#E67E22", order: 4 },
    { name: "Boise", color: "#8B4513", order: 5 },
    { name: "Grille/Torrefie", color: "#34495E", order: 6 },
    { name: "Animal", color: "#95A5A6", order: 7 },
    { name: "Mineral", color: "#7F8C8D", order: 8 },
    { name: "Defauts", color: "#C0392B", order: 9 },
  ];

  for (const category of aromaCategories) {
    await prisma.aromaCategory.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        color: category.color,
        order: category.order,
      },
    });
  }
  console.log(`✅ 9 categories d'aromes creees`);

  // ============================================
  // CEPAGES
  // ============================================

  const grapeVarieties = [
    {
      name: "Cabernet Sauvignon",
      color: "RED" as const,
      origin: "Bordeaux, France",
      characteristics: "Tanins puissants, structure, garde",
    },
    {
      name: "Merlot",
      color: "RED" as const,
      origin: "Bordeaux, France",
      characteristics: "Souple, fruité, rond",
    },
    {
      name: "Pinot Noir",
      color: "RED" as const,
      origin: "Bourgogne, France",
      characteristics: "Finesse, elegance, aromes subtils",
    },
    {
      name: "Syrah",
      color: "RED" as const,
      origin: "Vallée du Rhône, France",
      characteristics: "Epicé, puissant, poivré",
    },
    {
      name: "Chardonnay",
      color: "WHITE" as const,
      origin: "Bourgogne, France",
      characteristics: "Polyvalent, beurré, minéral",
    },
    {
      name: "Sauvignon Blanc",
      color: "WHITE" as const,
      origin: "Loire/Bordeaux, France",
      characteristics: "Vif, agrumes, buis",
    },
    {
      name: "Riesling",
      color: "WHITE" as const,
      origin: "Alsace, France / Allemagne",
      characteristics: "Minéral, floral, acidité vive",
    },
    {
      name: "Grenache",
      color: "RED" as const,
      origin: "Espagne",
      characteristics: "Généreux, fruits rouges, épicé",
    },
  ];

  for (const grape of grapeVarieties) {
    await prisma.grapeVariety.upsert({
      where: { name: grape.name },
      update: {},
      create: grape,
    });
  }
  console.log(`✅ ${grapeVarieties.length} cepages crees`);

  // ============================================
  // APPELLATIONS
  // ============================================

  const appellations = [
    // Bordeaux
    { name: "Bordeaux", type: "AOP" as const, region: "Bordeaux", description: "Appellation régionale couvrant l'ensemble du vignoble bordelais." },
    { name: "Médoc", type: "AOP" as const, region: "Bordeaux", description: "Vins rouges de la rive gauche de la Garonne, taniques et de garde." },
    { name: "Saint-Émilion", type: "AOP" as const, region: "Bordeaux", description: "Vins rouges de la rive droite, dominés par le Merlot." },
    { name: "Pomerol", type: "AOP" as const, region: "Bordeaux", description: "Petite appellation prestigieuse, vins riches et veloutés." },
    { name: "Margaux", type: "AOP" as const, region: "Bordeaux", description: "Vins élégants et parfumés du Médoc." },
    { name: "Pauillac", type: "AOP" as const, region: "Bordeaux", description: "Grands vins de garde, puissants et complexes." },
    { name: "Sauternes", type: "AOP" as const, region: "Bordeaux", description: "Vins liquoreux issus de raisins botrytisés." },
    // Bourgogne
    { name: "Bourgogne", type: "AOP" as const, region: "Bourgogne", description: "Appellation régionale, Pinot Noir et Chardonnay." },
    { name: "Chablis", type: "AOP" as const, region: "Bourgogne", description: "Vins blancs minéraux et vifs du nord de la Bourgogne." },
    { name: "Meursault", type: "AOP" as const, region: "Bourgogne", description: "Grands vins blancs de la Côte de Beaune." },
    { name: "Gevrey-Chambertin", type: "AOP" as const, region: "Bourgogne", description: "Vins rouges puissants de la Côte de Nuits." },
    { name: "Nuits-Saint-Georges", type: "AOP" as const, region: "Bourgogne", description: "Vins rouges structurés et complexes." },
    { name: "Pommard", type: "AOP" as const, region: "Bourgogne", description: "Vins rouges robustes de la Côte de Beaune." },
    // Vallée du Rhône
    { name: "Côtes du Rhône", type: "AOP" as const, region: "Vallée du Rhône", description: "Appellation régionale, vins rouges généreux." },
    { name: "Châteauneuf-du-Pape", type: "AOP" as const, region: "Vallée du Rhône", description: "Grands vins du sud, assemblages complexes." },
    { name: "Hermitage", type: "AOP" as const, region: "Vallée du Rhône", description: "Syrah pure du nord, vins de grande garde." },
    { name: "Côte-Rôtie", type: "AOP" as const, region: "Vallée du Rhône", description: "Syrah élégante, parfois assemblée au Viognier." },
    { name: "Condrieu", type: "AOP" as const, region: "Vallée du Rhône", description: "Vins blancs aromatiques 100% Viognier." },
    // Loire
    { name: "Sancerre", type: "AOP" as const, region: "Loire", description: "Sauvignon Blanc vif et minéral." },
    { name: "Pouilly-Fumé", type: "AOP" as const, region: "Loire", description: "Sauvignon Blanc aux notes fumées." },
    { name: "Vouvray", type: "AOP" as const, region: "Loire", description: "Chenin Blanc sec, demi-sec ou moelleux." },
    { name: "Muscadet", type: "AOP" as const, region: "Loire", description: "Vins blancs secs, parfaits avec les fruits de mer." },
    { name: "Chinon", type: "AOP" as const, region: "Loire", description: "Cabernet Franc fruité et élégant." },
    // Alsace
    { name: "Alsace", type: "AOP" as const, region: "Alsace", description: "Vins blancs de cépages, vendus sous le nom du cépage." },
    { name: "Alsace Grand Cru", type: "AOP" as const, region: "Alsace", description: "51 terroirs d'exception pour Riesling, Gewurztraminer, Pinot Gris, Muscat." },
    { name: "Crémant d'Alsace", type: "AOP" as const, region: "Alsace", description: "Effervescent de qualité, méthode traditionnelle." },
    // Champagne
    { name: "Champagne", type: "AOP" as const, region: "Champagne", description: "Effervescent de prestige, méthode champenoise." },
    // Beaujolais
    { name: "Beaujolais", type: "AOP" as const, region: "Beaujolais", description: "Gamay fruité et gourmand." },
    { name: "Morgon", type: "AOP" as const, region: "Beaujolais", description: "Cru du Beaujolais, charpenté et de garde." },
    { name: "Fleurie", type: "AOP" as const, region: "Beaujolais", description: "Cru élégant aux arômes floraux." },
    // Provence et Sud
    { name: "Côtes de Provence", type: "AOP" as const, region: "Provence", description: "Rosés réputés, vins de soleil." },
    { name: "Bandol", type: "AOP" as const, region: "Provence", description: "Mourvèdre puissant, rosés et rouges de caractère." },
    { name: "Languedoc", type: "AOP" as const, region: "Languedoc-Roussillon", description: "Vaste région, vins variés et accessibles." },
    { name: "Corbières", type: "AOP" as const, region: "Languedoc-Roussillon", description: "Vins rouges généreux du sud." },
    { name: "Minervois", type: "AOP" as const, region: "Languedoc-Roussillon", description: "Vins rouges fruités et épicés." },
    // IGP
    { name: "Pays d'Oc", type: "IGP" as const, region: "Languedoc-Roussillon", description: "Plus grande IGP de France, vins de cépages." },
    { name: "Val de Loire", type: "IGP" as const, region: "Loire", description: "Vins du Val de Loire hors AOP." },
    { name: "Côtes de Gascogne", type: "IGP" as const, region: "Sud-Ouest", description: "Vins blancs frais et aromatiques." },
  ];

  for (const appellation of appellations) {
    await prisma.appellation.upsert({
      where: { name_region: { name: appellation.name, region: appellation.region } },
      update: {},
      create: appellation,
    });
  }
  console.log(`✅ ${appellations.length} appellations creees`);

  // ============================================
  // SOUS-CATEGORIES ET AROMES
  // ============================================

  const aromaData: Record<string, { subCategories: { name: string; aromas: string[] }[] }> = {
    "Fruites": {
      subCategories: [
        { name: "Agrumes", aromas: ["Citron", "Orange", "Pamplemousse", "Citron vert", "Bergamote"] },
        { name: "Fruits rouges", aromas: ["Fraise", "Framboise", "Cerise", "Groseille", "Canneberge"] },
        { name: "Fruits noirs", aromas: ["Cassis", "Mûre", "Myrtille", "Cerise noire", "Prune"] },
        { name: "Fruits à noyau", aromas: ["Pêche", "Abricot", "Nectarine", "Prune fraîche"] },
        { name: "Fruits tropicaux", aromas: ["Ananas", "Mangue", "Fruit de la passion", "Litchi", "Papaye"] },
        { name: "Fruits du verger", aromas: ["Pomme verte", "Pomme rouge", "Poire", "Coing"] },
        { name: "Fruits secs", aromas: ["Raisin sec", "Figue", "Datte", "Pruneau", "Abricot sec"] },
      ],
    },
    "Floraux": {
      subCategories: [
        { name: "Fleurs blanches", aromas: ["Acacia", "Jasmin", "Fleur d'oranger", "Aubépine", "Tilleul", "Chèvrefeuille"] },
        { name: "Fleurs colorées", aromas: ["Rose", "Violette", "Pivoine", "Iris", "Lavande", "Géranium"] },
        { name: "Fleurs séchées", aromas: ["Pot-pourri", "Rose fanée", "Camomille"] },
      ],
    },
    "Vegetaux": {
      subCategories: [
        { name: "Végétal frais", aromas: ["Herbe coupée", "Buis", "Menthe", "Eucalyptus", "Poivron vert", "Feuille de tomate"] },
        { name: "Herbes aromatiques", aromas: ["Thym", "Romarin", "Laurier", "Sauge", "Basilic", "Origan", "Fenouil"] },
        { name: "Sous-bois", aromas: ["Champignon", "Truffe", "Humus", "Feuilles mortes", "Mousse"] },
        { name: "Végétal sec", aromas: ["Foin", "Paille", "Tabac", "Thé"] },
      ],
    },
    "Epices": {
      subCategories: [
        { name: "Épices douces", aromas: ["Vanille", "Cannelle", "Noix de muscade", "Clou de girofle", "Anis étoilé", "Réglisse"] },
        { name: "Épices chaudes", aromas: ["Poivre noir", "Poivre blanc", "Baie rose", "Gingembre", "Safran"] },
        { name: "Épices exotiques", aromas: ["Cardamome", "Cumin", "Coriandre", "Curry"] },
      ],
    },
    "Boise": {
      subCategories: [
        { name: "Chêne", aromas: ["Chêne français", "Chêne américain", "Toast", "Cèdre", "Bois de santal"] },
        { name: "Torréfaction", aromas: ["Café", "Cacao", "Chocolat", "Moka", "Caramel"] },
        { name: "Fumé", aromas: ["Fumée", "Lard fumé", "Goudron", "Cendre", "Encens"] },
      ],
    },
    "Grille/Torrefie": {
      subCategories: [
        { name: "Grillé", aromas: ["Pain grillé", "Brioche", "Noisette grillée", "Amande grillée"] },
        { name: "Torréfié", aromas: ["Café torréfié", "Cacao amer", "Malt"] },
      ],
    },
    "Animal": {
      subCategories: [
        { name: "Animal noble", aromas: ["Cuir", "Musc", "Fourrure", "Gibier", "Civette"] },
        { name: "Basse-cour", aromas: ["Écurie", "Étable", "Laine mouillée"] },
      ],
    },
    "Mineral": {
      subCategories: [
        { name: "Pierres", aromas: ["Silex", "Craie", "Ardoise", "Granit", "Calcaire"] },
        { name: "Salin", aromas: ["Sel marin", "Huître", "Algue", "Saumure"] },
        { name: "Métallique", aromas: ["Fer", "Cuivre", "Graphite"] },
      ],
    },
    "Defauts": {
      subCategories: [
        { name: "Oxydation", aromas: ["Madère/Xérès", "Pomme blette", "Vinaigre"] },
        { name: "Réduction", aromas: ["Soufre", "Œuf pourri", "Caoutchouc", "Ail"] },
        { name: "Contamination", aromas: ["Bouchon (TCA)", "Brettanomyces", "Acidité volatile", "Géranium (défaut)"] },
      ],
    },
  };

  for (const [categoryName, data] of Object.entries(aromaData)) {
    const category = await prisma.aromaCategory.findUnique({
      where: { name: categoryName },
    });

    if (category) {
      for (let subIndex = 0; subIndex < data.subCategories.length; subIndex++) {
        const subCat = data.subCategories[subIndex];
        const subCategory = await prisma.aromaSubCategory.upsert({
          where: { name_categoryId: { name: subCat.name, categoryId: category.id } },
          update: {},
          create: {
            name: subCat.name,
            categoryId: category.id,
            order: subIndex + 1,
          },
        });

        for (let aromaIndex = 0; aromaIndex < subCat.aromas.length; aromaIndex++) {
          const aromaName = subCat.aromas[aromaIndex];
          await prisma.aroma.upsert({
            where: { name_subCategoryId: { name: aromaName, subCategoryId: subCategory.id } },
            update: {},
            create: {
              name: aromaName,
              subCategoryId: subCategory.id,
              order: aromaIndex + 1,
            },
          });
        }
      }
    }
  }
  console.log(`✅ Sous-categories et aromes crees`);

  // ============================================
  // TERMES DU GLOSSAIRE
  // ============================================

  const glossaryTerms = [
    {
      term: "Tanins",
      definition: "Composés phénoliques présents dans la peau, les pépins et la rafle du raisin, apportant structure et astringence au vin rouge.",
      category: "Dégustation",
    },
    {
      term: "Terroir",
      definition: "Ensemble des facteurs naturels (sol, climat, exposition) et humains qui confèrent au vin ses caractéristiques uniques.",
      category: "Viticulture",
    },
    {
      term: "Fermentation alcoolique",
      definition: "Transformation des sucres du raisin en alcool et CO2 sous l'action des levures.",
      category: "Vinification",
    },
    {
      term: "Élevage",
      definition: "Période de maturation du vin après fermentation, en cuve ou en fût, permettant son évolution aromatique.",
      category: "Vinification",
    },
    {
      term: "Appellation",
      definition: "Dénomination géographique garantissant l'origine et les conditions de production d'un vin.",
      category: "Réglementation",
    },
    {
      term: "Cépage",
      definition: "Variété de vigne cultivée pour la production de raisin de cuve ou de table.",
      category: "Viticulture",
    },
    {
      term: "Millésime",
      definition: "Année de récolte du raisin ayant servi à élaborer le vin.",
      category: "Réglementation",
    },
    {
      term: "Fermentation malolactique",
      definition: "Transformation de l'acide malique en acide lactique par des bactéries, assouplissant le vin.",
      category: "Vinification",
    },
    {
      term: "Assemblage",
      definition: "Mélange de différents cépages, terroirs ou millésimes pour créer un vin équilibré.",
      category: "Vinification",
    },
    {
      term: "Décantation",
      definition: "Action de transvaser le vin dans une carafe pour l'aérer ou séparer le dépôt.",
      category: "Dégustation",
    },
    {
      term: "Robe",
      definition: "Aspect visuel du vin : couleur, intensité, brillance et limpidité.",
      category: "Dégustation",
    },
    {
      term: "Nez",
      definition: "Ensemble des arômes perçus à l'olfaction, avant la mise en bouche.",
      category: "Dégustation",
    },
    {
      term: "Bouche",
      definition: "Sensations gustatives et tactiles perçues lors de la dégustation du vin.",
      category: "Dégustation",
    },
    {
      term: "Finale",
      definition: "Persistance aromatique en bouche après avoir avalé ou recraché le vin, mesurée en caudalies.",
      category: "Dégustation",
    },
    {
      term: "Caudalies",
      definition: "Unité de mesure de la persistance aromatique (1 caudalie = 1 seconde).",
      category: "Dégustation",
    },
    {
      term: "AOC/AOP",
      definition: "Appellation d'Origine Contrôlée/Protégée, garantissant l'origine géographique et le respect d'un cahier des charges.",
      category: "Réglementation",
    },
    {
      term: "IGP",
      definition: "Indication Géographique Protégée, label européen moins restrictif que l'AOP.",
      category: "Réglementation",
    },
    {
      term: "Vin de France",
      definition: "Catégorie de vin sans indication géographique, offrant plus de liberté au vigneron.",
      category: "Réglementation",
    },
    {
      term: "Sulfites",
      definition: "Conservateurs (SO2) utilisés pour protéger le vin de l'oxydation et des bactéries.",
      category: "Vinification",
    },
    {
      term: "Collage",
      definition: "Opération de clarification du vin par ajout de substances qui entraînent les particules en suspension.",
      category: "Vinification",
    },
    {
      term: "Débourbage",
      definition: "Clarification du moût avant fermentation par décantation des particules solides.",
      category: "Vinification",
    },
    {
      term: "Soutirage",
      definition: "Transfert du vin d'un contenant à un autre en laissant les lies au fond.",
      category: "Vinification",
    },
    {
      term: "Lies",
      definition: "Dépôt composé de levures mortes et particules au fond de la cuve après fermentation.",
      category: "Vinification",
    },
    {
      term: "Bâtonnage",
      definition: "Remise en suspension des lies fines pour enrichir le vin en arômes et texture.",
      category: "Vinification",
    },
    {
      term: "Pressurage",
      definition: "Extraction du jus de raisin par pression mécanique.",
      category: "Vinification",
    },
    {
      term: "Macération",
      definition: "Contact du moût avec les peaux pour extraire couleur, tanins et arômes.",
      category: "Vinification",
    },
    {
      term: "Vendanges",
      definition: "Récolte du raisin, manuelle ou mécanique, à maturité optimale.",
      category: "Viticulture",
    },
    {
      term: "Véraison",
      definition: "Stade de maturation où le raisin change de couleur et commence à accumuler les sucres.",
      category: "Viticulture",
    },
    {
      term: "Effeuillage",
      definition: "Suppression des feuilles autour des grappes pour améliorer l'ensoleillement et l'aération.",
      category: "Viticulture",
    },
    {
      term: "Ébourgeonnage",
      definition: "Suppression des bourgeons excédentaires pour concentrer la vigueur de la vigne.",
      category: "Viticulture",
    },
    {
      term: "Taille",
      definition: "Coupe des sarments pour réguler la production et la qualité du raisin.",
      category: "Viticulture",
    },
    {
      term: "Porte-greffe",
      definition: "Partie racinaire de la vigne, résistante au phylloxéra, sur laquelle on greffe le cépage.",
      category: "Viticulture",
    },
    {
      term: "Phylloxéra",
      definition: "Puceron ravageur de la vigne ayant détruit le vignoble européen au XIXe siècle.",
      category: "Viticulture",
    },
    {
      term: "Goût de bouchon",
      definition: "Défaut du vin causé par le TCA (trichloroanisole), donnant une odeur de moisi.",
      category: "Défauts",
    },
    {
      term: "Oxydation",
      definition: "Altération du vin par contact excessif avec l'air, modifiant couleur et arômes.",
      category: "Défauts",
    },
    {
      term: "Réduction",
      definition: "Défaut aromatique (œuf pourri, caoutchouc) dû à un manque d'oxygène.",
      category: "Défauts",
    },
    {
      term: "Acidité volatile",
      definition: "Excès d'acide acétique donnant au vin une odeur de vinaigre.",
      category: "Défauts",
    },
    {
      term: "Brettanomyces",
      definition: "Levure indésirable produisant des arômes d'écurie, sueur ou cuir prononcé.",
      category: "Défauts",
    },
  ];

  for (const term of glossaryTerms) {
    await prisma.glossaryTerm.upsert({
      where: { term: term.term },
      update: {},
      create: term,
    });
  }
  console.log(`✅ ${glossaryTerms.length} termes de glossaire crees`);

  // ============================================
  // ACTIVITES PEDAGOGIQUES
  // ============================================

  // Récupérer les blocs pour les associer aux activités
  const blocs = await prisma.competencyBlock.findMany({
    orderBy: { number: "asc" },
  });

  const activitiesData = [
    // Bloc 1 - Culture vitivinicole
    {
      blockNumber: 1,
      activities: [
        {
          title: "Histoire de la vigne et du vin",
          description: "Découvrez l'histoire millénaire de la viticulture, des origines à nos jours.",
          type: "LESSON" as const,
          duration: 20,
          points: 10,
          order: 1,
        },
        {
          title: "La filière vitivinicole française",
          description: "Comprenez l'organisation de la filière, des producteurs aux consommateurs.",
          type: "LESSON" as const,
          duration: 15,
          points: 10,
          order: 2,
        },
        {
          title: "Frise chronologique du vin",
          description: "Placez les événements majeurs de l'histoire du vin sur une frise interactive.",
          type: "INTERACTIVE" as const,
          duration: 15,
          points: 15,
          order: 3,
        },
      ],
    },
    // Bloc 2 - Vigne et raisin
    {
      blockNumber: 2,
      activities: [
        {
          title: "Anatomie de la vigne",
          description: "Identifiez les différentes parties de la vigne et leurs fonctions.",
          type: "LESSON" as const,
          duration: 20,
          points: 10,
          order: 1,
        },
        {
          title: "Le cycle végétatif",
          description: "Suivez le cycle annuel de la vigne, de la taille aux vendanges.",
          type: "LESSON" as const,
          duration: 15,
          points: 10,
          order: 2,
        },
        {
          title: "Schéma de la grappe",
          description: "Annotez les parties d'une grappe de raisin sur un schéma interactif.",
          type: "INTERACTIVE" as const,
          duration: 10,
          points: 15,
          order: 3,
        },
        {
          title: "Facteurs de qualité du raisin",
          description: "Classez les facteurs influençant la qualité du raisin.",
          type: "EXERCISE" as const,
          duration: 15,
          points: 15,
          order: 4,
        },
      ],
    },
    // Bloc 3 - Vinification
    {
      blockNumber: 3,
      activities: [
        {
          title: "Vinification en rouge",
          description: "Découvrez les étapes de la vinification des vins rouges.",
          type: "LESSON" as const,
          duration: 25,
          points: 10,
          order: 1,
        },
        {
          title: "Vinification en blanc",
          description: "Comprenez les spécificités de la vinification des vins blancs.",
          type: "LESSON" as const,
          duration: 20,
          points: 10,
          order: 2,
        },
        {
          title: "Vinification en rosé",
          description: "Les différentes méthodes de production des vins rosés.",
          type: "LESSON" as const,
          duration: 15,
          points: 10,
          order: 3,
        },
        {
          title: "Schéma du processus de vinification",
          description: "Ordonnez les étapes de vinification sur un schéma interactif.",
          type: "INTERACTIVE" as const,
          duration: 15,
          points: 15,
          order: 4,
        },
      ],
    },
    // Bloc 4 - Analyse sensorielle
    {
      blockNumber: 4,
      activities: [
        {
          title: "L'examen visuel",
          description: "Apprenez à observer et décrire la robe d'un vin.",
          type: "LESSON" as const,
          duration: 15,
          points: 10,
          order: 1,
        },
        {
          title: "L'examen olfactif",
          description: "Maîtrisez les techniques d'analyse des arômes.",
          type: "LESSON" as const,
          duration: 20,
          points: 10,
          order: 2,
        },
        {
          title: "L'examen gustatif",
          description: "Analysez les sensations en bouche : attaque, milieu, finale.",
          type: "LESSON" as const,
          duration: 20,
          points: 10,
          order: 3,
        },
        {
          title: "La roue des arômes",
          description: "Identifiez les familles aromatiques sur la roue des arômes interactive.",
          type: "INTERACTIVE" as const,
          duration: 20,
          points: 20,
          order: 4,
        },
        {
          title: "Fiche de dégustation",
          description: "Complétez une fiche d'analyse sensorielle structurée.",
          type: "TASTING" as const,
          duration: 30,
          points: 25,
          order: 5,
        },
      ],
    },
    // Bloc 5 - Cépages et styles
    {
      blockNumber: 5,
      activities: [
        {
          title: "Les grands cépages rouges",
          description: "Découvrez les caractéristiques des principaux cépages rouges.",
          type: "LESSON" as const,
          duration: 25,
          points: 10,
          order: 1,
        },
        {
          title: "Les grands cépages blancs",
          description: "Explorez les cépages blancs et leurs profils aromatiques.",
          type: "LESSON" as const,
          duration: 25,
          points: 10,
          order: 2,
        },
        {
          title: "Appariement cépages-arômes",
          description: "Associez chaque cépage à ses arômes typiques.",
          type: "INTERACTIVE" as const,
          duration: 15,
          points: 15,
          order: 3,
        },
        {
          title: "Styles de vins et occasions",
          description: "Identifiez les styles de vins adaptés à chaque occasion.",
          type: "EXERCISE" as const,
          duration: 15,
          points: 15,
          order: 4,
        },
      ],
    },
    // Bloc 6 - Qualité et défauts
    {
      blockNumber: 6,
      activities: [
        {
          title: "Les défauts du vin",
          description: "Identifiez les principaux défauts et leurs causes.",
          type: "LESSON" as const,
          duration: 25,
          points: 10,
          order: 1,
        },
        {
          title: "Goût de bouchon et TCA",
          description: "Comprenez le défaut le plus courant et sa prévention.",
          type: "LESSON" as const,
          duration: 15,
          points: 10,
          order: 2,
        },
        {
          title: "Arbre de diagnostic des défauts",
          description: "Utilisez l'arbre décisionnel pour identifier un défaut.",
          type: "INTERACTIVE" as const,
          duration: 20,
          points: 20,
          order: 3,
        },
        {
          title: "Étude de cas : vin défectueux",
          description: "Analysez un cas pratique et proposez un diagnostic.",
          type: "EXERCISE" as const,
          duration: 20,
          points: 20,
          order: 4,
        },
      ],
    },
    // Bloc 7 - Vins sans alcool
    {
      blockNumber: 7,
      activities: [
        {
          title: "Les procédés de désalcoolisation",
          description: "Découvrez les techniques pour retirer l'alcool du vin.",
          type: "LESSON" as const,
          duration: 20,
          points: 10,
          order: 1,
        },
        {
          title: "Marché des vins sans alcool",
          description: "Analysez les tendances et l'évolution du marché.",
          type: "LESSON" as const,
          duration: 15,
          points: 10,
          order: 2,
        },
        {
          title: "Comparaison organoleptique",
          description: "Comparez les profils sensoriels avant/après désalcoolisation.",
          type: "EXERCISE" as const,
          duration: 20,
          points: 15,
          order: 3,
        },
      ],
    },
    // Bloc 8 - Réglementation
    {
      blockNumber: 8,
      activities: [
        {
          title: "Les appellations d'origine",
          description: "Comprenez le système AOC/AOP, IGP et Vin de France.",
          type: "LESSON" as const,
          duration: 20,
          points: 10,
          order: 1,
        },
        {
          title: "L'étiquetage des vins",
          description: "Décryptez les mentions obligatoires et facultatives.",
          type: "LESSON" as const,
          duration: 15,
          points: 10,
          order: 2,
        },
        {
          title: "Consommation responsable",
          description: "Sensibilisation aux risques de l'alcool et à la modération.",
          type: "LESSON" as const,
          duration: 15,
          points: 10,
          order: 3,
        },
        {
          title: "Lecture d'étiquette",
          description: "Identifiez les informations sur une étiquette de vin.",
          type: "INTERACTIVE" as const,
          duration: 15,
          points: 15,
          order: 4,
        },
      ],
    },
  ];

  let totalActivities = 0;
  for (const blocData of activitiesData) {
    const bloc = blocs.find((b) => b.number === blocData.blockNumber);
    if (bloc) {
      for (const activity of blocData.activities) {
        await prisma.activity.upsert({
          where: {
            id: `activity-${bloc.number}-${activity.order}`,
          },
          update: {
            title: activity.title,
            description: activity.description,
            type: activity.type,
            duration: activity.duration,
            points: activity.points,
            order: activity.order,
          },
          create: {
            id: `activity-${bloc.number}-${activity.order}`,
            title: activity.title,
            description: activity.description,
            type: activity.type,
            duration: activity.duration,
            points: activity.points,
            order: activity.order,
            blockId: bloc.id,
          },
        });
        totalActivities++;
      }
    }
  }
  console.log(`✅ ${totalActivities} activites pedagogiques creees`);

  // ============================================
  // QUIZ
  // ============================================

  const quizData = [
    {
      blockNumber: 1,
      title: "Quiz - Culture vitivinicole",
      description: "Testez vos connaissances sur l'histoire et la filière du vin.",
      timeLimit: 15,
      passingScore: 60,
      questions: [
        {
          question: "Dans quelle région a-t-on trouvé les plus anciennes traces de viticulture ?",
          type: "SINGLE_CHOICE" as const,
          options: [
            { text: "France", isCorrect: false },
            { text: "Italie", isCorrect: false },
            { text: "Géorgie/Caucase", isCorrect: true },
            { text: "Espagne", isCorrect: false },
          ],
          explanation: "Les plus anciennes traces de viticulture datent de 6000 ans av. J.-C. dans le Caucase (Géorgie actuelle).",
        },
        {
          question: "Que signifie AOC ?",
          type: "SINGLE_CHOICE" as const,
          options: [
            { text: "Appellation d'Origine Contrôlée", isCorrect: true },
            { text: "Association des Œnologues Certifiés", isCorrect: false },
            { text: "Assemblage d'Origine Commune", isCorrect: false },
            { text: "Agriculture Organique Contrôlée", isCorrect: false },
          ],
          explanation: "AOC signifie Appellation d'Origine Contrôlée, un label garantissant l'origine et le respect d'un cahier des charges.",
        },
        {
          question: "Quel insecte a ravagé le vignoble européen au XIXe siècle ?",
          type: "SINGLE_CHOICE" as const,
          options: [
            { text: "Le doryphore", isCorrect: false },
            { text: "Le phylloxéra", isCorrect: true },
            { text: "La cochenille", isCorrect: false },
            { text: "Le charançon", isCorrect: false },
          ],
          explanation: "Le phylloxéra, un puceron américain, a détruit une grande partie du vignoble européen entre 1860 et 1900.",
        },
      ],
    },
    {
      blockNumber: 3,
      title: "Quiz - Vinification",
      description: "Testez vos connaissances sur les processus de vinification.",
      timeLimit: 15,
      passingScore: 60,
      questions: [
        {
          question: "Quelle est la principale différence entre la vinification en rouge et en blanc ?",
          type: "SINGLE_CHOICE" as const,
          options: [
            { text: "La température de fermentation", isCorrect: false },
            { text: "La macération avec les peaux", isCorrect: true },
            { text: "Le type de levures utilisées", isCorrect: false },
            { text: "La durée de fermentation", isCorrect: false },
          ],
          explanation: "En vinification rouge, le moût macère avec les peaux pour extraire couleur et tanins, contrairement au blanc.",
        },
        {
          question: "Qu'est-ce que la fermentation malolactique ?",
          type: "SINGLE_CHOICE" as const,
          options: [
            { text: "Transformation du sucre en alcool", isCorrect: false },
            { text: "Transformation de l'acide malique en acide lactique", isCorrect: true },
            { text: "Ajout de bactéries pour aromatiser", isCorrect: false },
            { text: "Processus de vieillissement en fût", isCorrect: false },
          ],
          explanation: "La fermentation malolactique transforme l'acide malique (dur) en acide lactique (doux), assouplissant le vin.",
        },
        {
          question: "À quelle température fermente généralement un vin blanc ?",
          type: "SINGLE_CHOICE" as const,
          options: [
            { text: "5-10°C", isCorrect: false },
            { text: "12-18°C", isCorrect: true },
            { text: "25-30°C", isCorrect: false },
            { text: "35-40°C", isCorrect: false },
          ],
          explanation: "Les vins blancs fermentent à basse température (12-18°C) pour préserver les arômes fruités.",
        },
      ],
    },
    {
      blockNumber: 4,
      title: "Quiz - Analyse sensorielle",
      description: "Testez vos connaissances sur la dégustation du vin.",
      timeLimit: 15,
      passingScore: 60,
      questions: [
        {
          question: "Que désigne le terme 'robe' dans la dégustation ?",
          type: "SINGLE_CHOICE" as const,
          options: [
            { text: "Le goût du vin", isCorrect: false },
            { text: "L'aspect visuel du vin", isCorrect: true },
            { text: "Les arômes du vin", isCorrect: false },
            { text: "La texture en bouche", isCorrect: false },
          ],
          explanation: "La robe désigne l'aspect visuel du vin : couleur, intensité, brillance et limpidité.",
        },
        {
          question: "Qu'est-ce qu'une caudalie ?",
          type: "SINGLE_CHOICE" as const,
          options: [
            { text: "Un défaut du vin", isCorrect: false },
            { text: "Une unité de mesure de la persistance aromatique", isCorrect: true },
            { text: "Un type de cépage", isCorrect: false },
            { text: "Un outil de dégustation", isCorrect: false },
          ],
          explanation: "La caudalie est l'unité de mesure de la persistance aromatique (1 caudalie = 1 seconde).",
        },
        {
          question: "Quels sont les trois temps de l'examen olfactif ?",
          type: "SINGLE_CHOICE" as const,
          options: [
            { text: "Léger, moyen, intense", isCorrect: false },
            { text: "Premier nez, deuxième nez, troisième nez", isCorrect: true },
            { text: "Fruité, floral, épicé", isCorrect: false },
            { text: "Attaque, milieu, finale", isCorrect: false },
          ],
          explanation: "L'examen olfactif comprend le premier nez (sans agiter), le deuxième nez (après agitation) et parfois un troisième nez (vin aéré).",
        },
        {
          question: "À quelle famille aromatique appartient la vanille ?",
          type: "SINGLE_CHOICE" as const,
          options: [
            { text: "Fruités", isCorrect: false },
            { text: "Floraux", isCorrect: false },
            { text: "Épicés/Boisés", isCorrect: true },
            { text: "Végétaux", isCorrect: false },
          ],
          explanation: "La vanille appartient à la famille des épices douces, souvent associée à l'élevage en fût de chêne.",
        },
      ],
    },
    {
      blockNumber: 5,
      title: "Quiz - Cépages",
      description: "Testez vos connaissances sur les cépages.",
      timeLimit: 15,
      passingScore: 60,
      questions: [
        {
          question: "Quel cépage est typique des vins de Bourgogne rouge ?",
          type: "SINGLE_CHOICE" as const,
          options: [
            { text: "Cabernet Sauvignon", isCorrect: false },
            { text: "Merlot", isCorrect: false },
            { text: "Pinot Noir", isCorrect: true },
            { text: "Syrah", isCorrect: false },
          ],
          explanation: "Le Pinot Noir est le cépage rouge emblématique de la Bourgogne.",
        },
        {
          question: "Quel arôme est typique du Sauvignon Blanc ?",
          type: "SINGLE_CHOICE" as const,
          options: [
            { text: "Vanille", isCorrect: false },
            { text: "Buis / Agrumes", isCorrect: true },
            { text: "Litchi", isCorrect: false },
            { text: "Brioche", isCorrect: false },
          ],
          explanation: "Le Sauvignon Blanc est reconnaissable à ses arômes de buis, bourgeon de cassis et agrumes.",
        },
        {
          question: "Quelle est la couleur du Gewurztraminer ?",
          type: "SINGLE_CHOICE" as const,
          options: [
            { text: "Rouge", isCorrect: false },
            { text: "Blanc", isCorrect: true },
            { text: "Rosé", isCorrect: false },
            { text: "Orange", isCorrect: false },
          ],
          explanation: "Le Gewurztraminer est un cépage blanc aromatique, typique d'Alsace.",
        },
      ],
    },
    {
      blockNumber: 6,
      title: "Quiz - Défauts du vin",
      description: "Testez vos connaissances sur les défauts du vin.",
      timeLimit: 10,
      passingScore: 60,
      questions: [
        {
          question: "Quelle molécule est responsable du goût de bouchon ?",
          type: "SINGLE_CHOICE" as const,
          options: [
            { text: "Acide acétique", isCorrect: false },
            { text: "TCA (trichloroanisole)", isCorrect: true },
            { text: "Sulfites", isCorrect: false },
            { text: "Brettanomyces", isCorrect: false },
          ],
          explanation: "Le TCA (trichloroanisole) est la molécule responsable du goût de bouchon, donnant une odeur de moisi/carton mouillé.",
        },
        {
          question: "Qu'est-ce que la 'Brett' ?",
          type: "SINGLE_CHOICE" as const,
          options: [
            { text: "Un défaut d'oxydation", isCorrect: false },
            { text: "Une levure indésirable (Brettanomyces)", isCorrect: true },
            { text: "Un type de bouchon", isCorrect: false },
            { text: "Une maladie de la vigne", isCorrect: false },
          ],
          explanation: "La Brett (Brettanomyces) est une levure indésirable produisant des arômes d'écurie, sueur ou cuir.",
        },
      ],
    },
    {
      blockNumber: 8,
      title: "Quiz - Réglementation",
      description: "Testez vos connaissances sur la réglementation du vin.",
      timeLimit: 10,
      passingScore: 60,
      questions: [
        {
          question: "Quelle est la hiérarchie des appellations du plus au moins restrictif ?",
          type: "SINGLE_CHOICE" as const,
          options: [
            { text: "IGP > AOP > VDF", isCorrect: false },
            { text: "AOP > IGP > VDF", isCorrect: true },
            { text: "VDF > AOP > IGP", isCorrect: false },
            { text: "AOP > VDF > IGP", isCorrect: false },
          ],
          explanation: "L'ordre du plus au moins restrictif est : AOP (Appellation d'Origine Protégée) > IGP > VDF (Vin de France).",
        },
        {
          question: "Quelle mention est obligatoire sur l'étiquette d'un vin ?",
          type: "SINGLE_CHOICE" as const,
          options: [
            { text: "Le cépage", isCorrect: false },
            { text: "Le degré d'alcool", isCorrect: true },
            { text: "Les accords mets-vins", isCorrect: false },
            { text: "L'âge du vin", isCorrect: false },
          ],
          explanation: "Le degré d'alcool est une mention obligatoire sur l'étiquette, contrairement au cépage qui est facultatif.",
        },
      ],
    },
  ];

  let totalQuizzes = 0;
  let totalQuestions = 0;
  for (const quiz of quizData) {
    const bloc = blocs.find((b) => b.number === quiz.blockNumber);
    if (bloc) {
      const createdQuiz = await prisma.quiz.upsert({
        where: { id: `quiz-bloc-${quiz.blockNumber}` },
        update: {
          title: quiz.title,
          description: quiz.description,
          timeLimit: quiz.timeLimit,
          passingScore: quiz.passingScore,
        },
        create: {
          id: `quiz-bloc-${quiz.blockNumber}`,
          title: quiz.title,
          description: quiz.description,
          timeLimit: quiz.timeLimit,
          passingScore: quiz.passingScore,
          blockId: bloc.id,
        },
      });
      totalQuizzes++;

      for (let i = 0; i < quiz.questions.length; i++) {
        const q = quiz.questions[i];
        const questionId = `question-${quiz.blockNumber}-${i + 1}`;

        // Supprimer les anciennes options si elles existent
        await prisma.quizOption.deleteMany({
          where: { question: { id: questionId } },
        });

        await prisma.quizQuestion.upsert({
          where: { id: questionId },
          update: {
            question: q.question,
            type: q.type,
            explanation: q.explanation,
            order: i + 1,
          },
          create: {
            id: questionId,
            question: q.question,
            type: q.type,
            explanation: q.explanation,
            order: i + 1,
            quizId: createdQuiz.id,
            options: {
              create: q.options.map((opt, optIndex) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
                order: optIndex + 1,
              })),
            },
          },
        });
        totalQuestions++;
      }
    }
  }
  console.log(`✅ ${totalQuizzes} quiz crees avec ${totalQuestions} questions`);

  // ============================================
  // VINS AVEC PROFILS SENSORIELS
  // ============================================

  await seedWines();

  console.log("\n🎉 Seeding termine avec succes!");
  console.log("\n📋 Comptes de test:");
  console.log("   Email: eleve@oenoclass.fr      | Mot de passe: Password123! | Role: Eleve");
  console.log("   Email: enseignant@oenoclass.fr | Mot de passe: Password123! | Role: Enseignant");
  console.log("   Email: admin@oenoclass.fr      | Mot de passe: Password123! | Role: Admin");
  console.log("   Email: superadmin@oenoclass.fr | Mot de passe: Password123! | Role: Super Admin");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
