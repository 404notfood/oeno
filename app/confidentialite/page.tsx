import Link from "next/link";

export const metadata = {
  title: "Politique de Confidentialité | Oenoclass",
  description: "Politique de confidentialité et protection des données personnelles",
};

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-beige py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-bordeaux hover:text-bordeaux-light mb-8 inline-block"
        >
          &larr; Retour à l&apos;accueil
        </Link>

        <h1 className="font-cormorant text-4xl text-bordeaux mb-8">
          Politique de Confidentialité
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6 text-gris-tech">
          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              Introduction
            </h2>
            <p>
              Oenoclass s&apos;engage à protéger la vie privée des utilisateurs de
              sa plateforme. Cette politique de confidentialité explique comment
              nous collectons, utilisons et protégeons vos données personnelles.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              Données collectées
            </h2>
            <p>Nous collectons les données suivantes :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Établissement scolaire (pour les connexions GAR)</li>
              <li>Données de progression pédagogique</li>
              <li>Données de connexion (logs, adresse IP)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              Utilisation des données
            </h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Gérer votre compte et authentification</li>
              <li>Personnaliser votre expérience d&apos;apprentissage</li>
              <li>Suivre votre progression pédagogique</li>
              <li>Améliorer nos services</li>
              <li>Communiquer avec vous si nécessaire</li>
            </ul>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              Base légale du traitement
            </h2>
            <p>
              Le traitement de vos données repose sur :
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>L&apos;exécution du contrat de service éducatif</li>
              <li>Le respect de nos obligations légales</li>
              <li>Notre intérêt légitime à améliorer nos services</li>
            </ul>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              Conservation des données
            </h2>
            <p>
              Vos données sont conservées pendant la durée de votre utilisation
              de la plateforme, puis archivées pendant une durée maximale de
              3 ans après votre dernière connexion, conformément aux obligations
              légales en matière éducative.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              Partage des données
            </h2>
            <p>
              Vos données ne sont jamais vendues à des tiers. Elles peuvent être
              partagées avec :
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Votre établissement scolaire (dans le cadre du GAR)</li>
              <li>Nos sous-traitants techniques (hébergement, maintenance)</li>
              <li>Les autorités compétentes si requis par la loi</li>
            </ul>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              Sécurité
            </h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles
              appropriées pour protéger vos données : chiffrement SSL/TLS,
              hachage des mots de passe, accès restreints, sauvegardes régulières.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              Vos droits
            </h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Accès</strong> : obtenir une copie de vos données</li>
              <li><strong>Rectification</strong> : corriger des données inexactes</li>
              <li><strong>Effacement</strong> : demander la suppression de vos données</li>
              <li><strong>Opposition</strong> : vous opposer au traitement</li>
              <li><strong>Portabilité</strong> : recevoir vos données dans un format lisible</li>
              <li><strong>Limitation</strong> : limiter le traitement de vos données</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits : [email à compléter]
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              Cookies
            </h2>
            <p>
              Nous utilisons uniquement des cookies essentiels au fonctionnement
              du site (session, authentification). Aucun cookie publicitaire
              ou de tracking n&apos;est utilisé.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              Contact DPO
            </h2>
            <p>
              Pour toute question relative à la protection de vos données :<br />
              [Email DPO à compléter]
            </p>
            <p className="mt-2">
              Vous pouvez également adresser une réclamation à la CNIL :
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bordeaux hover:text-bordeaux-light ml-1"
              >
                www.cnil.fr
              </a>
            </p>
          </section>
        </div>

        <p className="text-center text-gris-tech mt-8 text-sm">
          Dernière mise à jour : Janvier 2026
        </p>
      </div>
    </main>
  );
}
