import Link from "next/link";

export const metadata = {
  title: "Mentions Légales | Oenoclass",
  description: "Mentions légales de la plateforme Oenoclass",
};

export default function MentionsLegalesPage() {
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
          Mentions Légales
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6 text-gris-tech">
          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              Éditeur du site
            </h2>
            <p>
              <strong>Oenoclass</strong><br />
              Plateforme pédagogique pour l&apos;enseignement de l&apos;oenologie<br />
              [Adresse à compléter]<br />
              [SIRET à compléter]
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              Directeur de la publication
            </h2>
            <p>[Nom du directeur de publication à compléter]</p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              Hébergement
            </h2>
            <p>
              Ce site est hébergé par :<br />
              OVH SAS<br />
              2 rue Kellermann<br />
              59100 Roubaix - France
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble des contenus présents sur ce site (textes, images,
              graphismes, logo, icônes, etc.) est protégé par le droit d&apos;auteur
              et reste la propriété exclusive d&apos;Oenoclass, sauf mention contraire.
            </p>
            <p className="mt-2">
              Toute reproduction, représentation, modification, publication ou
              adaptation de tout ou partie des éléments du site est interdite
              sans autorisation écrite préalable.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              Données personnelles
            </h2>
            <p>
              Conformément à la loi « Informatique et Libertés » du 6 janvier 1978
              modifiée et au Règlement Général sur la Protection des Données (RGPD),
              vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression
              et d&apos;opposition aux données vous concernant.
            </p>
            <p className="mt-2">
              Pour exercer ces droits, contactez-nous à : [email à compléter]
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              Cookies
            </h2>
            <p>
              Ce site utilise des cookies nécessaires à son bon fonctionnement,
              notamment pour la gestion des sessions utilisateurs. En utilisant
              ce site, vous acceptez l&apos;utilisation de ces cookies.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              Contact
            </h2>
            <p>
              Pour toute question concernant ces mentions légales, vous pouvez
              nous contacter à : [email à compléter]
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
