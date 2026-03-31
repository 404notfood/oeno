import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import {
  getUserProgressData,
} from "@/actions/progress";

interface GarAttributes {
  // Attributs SAML standards du GAR
  uid?: string;
  mail?: string;
  givenName?: string;
  sn?: string; // surname
  displayName?: string;
  eduPersonPrincipalName?: string;
  eduPersonAffiliation?: string[];
  eduPersonPrimaryAffiliation?: string;
  eduPersonScopedAffiliation?: string[];
  eduPersonOrgDN?: string;
  eduPersonOrgUnitDN?: string;
  schacHomeOrganization?: string;
  isMemberOf?: string[];
  FrEduFonctAdm?: string;
  FrEduResCour?: string;
  FrEduRne?: string;
  FrEduRneResp?: string[];
  FrEduNivFormation?: string;
  // Autres attributs possibles
  [key: string]: unknown;
}

async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      establishment: true,
      studentClasses: {
        include: {
          establishment: true,
        },
      },
    },
  });

  return user;
}

const roleLabels: Record<string, string> = {
  STUDENT: "Élève",
  TEACHER: "Enseignant",
  ADMIN: "Administrateur",
};

const affiliationLabels: Record<string, string> = {
  student: "Élève",
  teacher: "Enseignant",
  staff: "Personnel",
  faculty: "Corps professoral",
  member: "Membre",
  affiliate: "Affilié",
  alum: "Ancien élève",
};

export default async function ProfilPage() {
  const session = await getServerSession();
  const [user, progressData] = await Promise.all([
    getUserProfile(session!.user.id),
    getUserProgressData(session!.user.id),
  ]);

  if (!user) {
    return (
      <div className="card text-center py-12">
        <p className="text-[var(--gris-tech)]">Profil non trouvé.</p>
      </div>
    );
  }

  const garAttributes = user.garAttributes as GarAttributes | null;
  const isGarUser = !!user.garId;

  // Calculate overall progress
  const overallProgress =
    progressData.totalBlocks > 0
      ? Math.round(
          (progressData.completedBlocks / progressData.totalBlocks) * 100
        )
      : 0;

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mon profil</h1>
        <p className="text-[var(--gris-tech)]">
          Consultez vos informations personnelles et votre progression.
        </p>
      </div>

      {/* Profile Card */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--bordeaux)] to-[var(--or)] flex items-center justify-center text-white text-3xl font-bold">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <span className="mt-3 text-xs font-medium text-[var(--bordeaux)] bg-[var(--bordeaux)] bg-opacity-10 px-3 py-1 rounded-full">
              {roleLabels[user.role] || user.role}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[var(--gris-dark)] mb-1">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-[var(--gris-tech)] mb-4">{user.email}</p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="text-xs text-[var(--gris-light)]">Progression</p>
                  <p className="font-semibold text-[var(--bordeaux)]">
                    {overallProgress}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-xs text-[var(--gris-light)]">Blocs complétés</p>
                  <p className="font-semibold text-[var(--success)]">
                    {progressData.completedBlocks}/{progressData.totalBlocks}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="text-xs text-[var(--gris-light)]">Score moyen</p>
                  <p className="font-semibold text-[var(--or)]">
                    {progressData.averageScore}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ENT/GAR Information */}
        {isGarUser && (
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--info)] bg-opacity-10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[var(--info)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--gris-dark)]">
                  Compte ENT
                </h3>
                <p className="text-xs text-[var(--gris-light)]">
                  Connecté via le GAR
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* GAR ID */}
              <div>
                <p className="text-xs text-[var(--gris-light)] mb-1">
                  Identifiant GAR
                </p>
                <p className="font-mono text-sm bg-[var(--beige)] px-3 py-2 rounded-lg">
                  {user.garId}
                </p>
              </div>

              {/* Establishment from GAR */}
              {garAttributes?.schacHomeOrganization && (
                <div>
                  <p className="text-xs text-[var(--gris-light)] mb-1">
                    Organisation
                  </p>
                  <p className="text-[var(--gris-dark)]">
                    {garAttributes.schacHomeOrganization}
                  </p>
                </div>
              )}

              {/* RNE Code */}
              {garAttributes?.FrEduRne && (
                <div>
                  <p className="text-xs text-[var(--gris-light)] mb-1">
                    Code RNE
                  </p>
                  <p className="font-mono text-sm text-[var(--gris-dark)]">
                    {garAttributes.FrEduRne}
                  </p>
                </div>
              )}

              {/* Affiliation */}
              {garAttributes?.eduPersonPrimaryAffiliation && (
                <div>
                  <p className="text-xs text-[var(--gris-light)] mb-1">
                    Statut
                  </p>
                  <p className="text-[var(--gris-dark)]">
                    {affiliationLabels[garAttributes.eduPersonPrimaryAffiliation] ||
                      garAttributes.eduPersonPrimaryAffiliation}
                  </p>
                </div>
              )}

              {/* Education Level */}
              {garAttributes?.FrEduNivFormation && (
                <div>
                  <p className="text-xs text-[var(--gris-light)] mb-1">
                    Niveau de formation
                  </p>
                  <p className="text-[var(--gris-dark)]">
                    {garAttributes.FrEduNivFormation}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Establishment */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--bordeaux)] bg-opacity-10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[var(--bordeaux)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--gris-dark)]">
                Établissement
              </h3>
              <p className="text-xs text-[var(--gris-light)]">
                Votre lycée agricole
              </p>
            </div>
          </div>

          {user.establishment ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[var(--gris-light)] mb-1">Nom</p>
                <p className="text-[var(--gris-dark)] font-medium">
                  {user.establishment.name}
                </p>
              </div>
              {user.establishment.city && (
                <div>
                  <p className="text-xs text-[var(--gris-light)] mb-1">Ville</p>
                  <p className="text-[var(--gris-dark)]">
                    {user.establishment.city}
                  </p>
                </div>
              )}
              {user.establishment.uai && (
                <div>
                  <p className="text-xs text-[var(--gris-light)] mb-1">
                    Code RNE
                  </p>
                  <p className="font-mono text-sm text-[var(--gris-dark)]">
                    {user.establishment.uai}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[var(--gris-light)] text-sm">
              Aucun établissement associé à votre compte.
            </p>
          )}
        </div>

        {/* Classes */}
        {user.studentClasses.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--vert)] bg-opacity-10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[var(--vert)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--gris-dark)]">
                  Mes classes
                </h3>
                <p className="text-xs text-[var(--gris-light)]">
                  {user.studentClasses.length} classe
                  {user.studentClasses.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {user.studentClasses.map((classe) => (
                <div
                  key={classe.id}
                  className="flex items-center justify-between p-3 bg-[var(--beige)] rounded-xl"
                >
                  <div>
                    <p className="font-medium text-[var(--gris-dark)]">
                      {classe.name}
                    </p>
                    {classe.establishment && (
                      <p className="text-xs text-[var(--gris-light)]">
                        {classe.establishment.name}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-[var(--gris-light)]">
                    {classe.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account Info */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--or)] bg-opacity-10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[var(--or)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--gris-dark)]">
                Informations du compte
              </h3>
              <p className="text-xs text-[var(--gris-light)]">
                Dates et activité
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-[var(--gris-light)] mb-1">
                Compte créé le
              </p>
              <p className="text-[var(--gris-dark)]">
                {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            {user.lastLoginAt && (
              <div>
                <p className="text-xs text-[var(--gris-light)] mb-1">
                  Dernière connexion
                </p>
                <p className="text-[var(--gris-dark)]">
                  {new Date(user.lastLoginAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Notice for ENT users */}
      {isGarUser && (
        <div className="card mt-8 bg-[var(--beige)]">
          <div className="flex items-start gap-4">
            <div className="text-2xl">🔒</div>
            <div>
              <h3 className="font-semibold text-[var(--gris-dark)] mb-1">
                Protection des données
              </h3>
              <p className="text-sm text-[var(--gris-tech)]">
                Vos données personnelles sont protégées conformément au RGPD et
                aux directives de l&apos;Éducation Nationale. Les informations
                affichées proviennent de votre ENT via le GAR (Gestionnaire
                d&apos;Accès aux Ressources) et ne peuvent pas être modifiées
                ici. Pour toute modification, contactez votre établissement.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
