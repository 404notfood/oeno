import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs | OenoClass",
  description:
    "Decouvrez les tarifs simples et transparents d'OenoClass pour votre etablissement ou academie.",
};

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  price: string;
  priceDetail: string;
  description: string;
  features: PricingFeature[];
  cta: string;
  ctaHref: string;
  highlighted: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "D\u00e9couverte",
    price: "Gratuit",
    priceDetail: "pour d\u00e9marrer",
    description:
      "Id\u00e9al pour tester la plateforme avec une classe et d\u00e9couvrir les fonctionnalit\u00e9s essentielles.",
    features: [
      { text: "1 classe (jusqu\u2019\u00e0 35 \u00e9l\u00e8ves)", included: true },
      { text: "2 blocs de comp\u00e9tences", included: true },
      { text: "Activit\u00e9s interactives de base", included: true },
      { text: "Tableau de bord enseignant", included: true },
      { text: "Support par email", included: true },
      { text: "Tous les 8 blocs", included: false },
      { text: "Analytics avanc\u00e9s", included: false },
      { text: "Int\u00e9gration GAR / ENT", included: false },
    ],
    cta: "Commencer gratuitement",
    ctaHref: "/register",
    highlighted: false,
  },
  {
    name: "\u00c9tablissement",
    price: "Sur devis",
    priceDetail: "par \u00e9tablissement / an",
    description:
      "La solution compl\u00e8te pour un \u00e9tablissement avec toutes les fonctionnalit\u00e9s p\u00e9dagogiques.",
    features: [
      { text: "Classes illimit\u00e9es", included: true },
      { text: "Tous les 8 blocs de comp\u00e9tences", included: true },
      { text: "Toutes les activit\u00e9s interactives", included: true },
      { text: "Analytics et suivi de progression", included: true },
      { text: "Support prioritaire", included: true },
      { text: "Int\u00e9gration GAR / ENT", included: true },
      { text: "Formation en ligne (1h)", included: true },
      { text: "Multi-\u00e9tablissements", included: false },
    ],
    cta: "Demander un devis",
    ctaHref: "/contact",
    highlighted: true,
  },
  {
    name: "Acad\u00e9mie",
    price: "Sur devis",
    priceDetail: "par acad\u00e9mie / an",
    description:
      "D\u00e9ploiement \u00e0 l\u2019\u00e9chelle acad\u00e9mique avec accompagnement d\u00e9di\u00e9 et API compl\u00e8te.",
    features: [
      { text: "Multi-\u00e9tablissements", included: true },
      { text: "Tous les 8 blocs de comp\u00e9tences", included: true },
      { text: "Toutes les activit\u00e9s interactives", included: true },
      { text: "Analytics et rapports acad\u00e9miques", included: true },
      { text: "API GAR compl\u00e8te", included: true },
      { text: "Formation sur site incluse", included: true },
      { text: "Support d\u00e9di\u00e9 (r\u00e9f\u00e9rent)", included: true },
      { text: "Personnalisation p\u00e9dagogique", included: true },
    ],
    cta: "Nous contacter",
    ctaHref: "/contact",
    highlighted: false,
  },
];

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-[var(--vert)] flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      className="w-5 h-5 text-[var(--gris-light)] flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

export default function TarifsPage() {
  return (
    <main className="min-h-screen bg-[var(--beige)]">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--bordeaux)] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--or)] opacity-10 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto relative z-10">
          <Link
            href="/"
            className="text-[var(--bordeaux)] hover:text-[var(--bordeaux-light)] mb-8 inline-flex items-center gap-2 transition-colors"
          >
            &larr; Retour &agrave; l&apos;accueil
          </Link>

          <h1 className="font-cormorant text-4xl md:text-5xl text-[var(--bordeaux)] mb-4">
            Tarifs simples et transparents
          </h1>
          <p className="text-lg text-[var(--gris-tech)] max-w-2xl">
            Une offre adapt&eacute;e &agrave; chaque &eacute;tablissement, de la d&eacute;couverte
            au d&eacute;ploiement acad&eacute;mique. Pas de frais cach&eacute;s, pas
            d&apos;engagement sur le forfait gratuit.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-start">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-8 transition-all ${
                tier.highlighted
                  ? "bg-white shadow-xl border-2 border-[var(--bordeaux)] scale-105 z-10"
                  : "bg-white shadow-md border border-[var(--beige-dark)]"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[var(--or)] text-white text-sm font-medium px-4 py-1 rounded-full">
                    Recommand&eacute;
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h2 className="font-cormorant text-2xl text-[var(--bordeaux)] mb-2">
                  {tier.name}
                </h2>
                <div className="mb-1">
                  <span
                    className={`text-3xl font-bold ${
                      tier.highlighted
                        ? "text-[var(--bordeaux)]"
                        : "text-[var(--gris-dark)]"
                    }`}
                  >
                    {tier.price}
                  </span>
                </div>
                <p className="text-sm text-[var(--gris-light)]">
                  {tier.priceDetail}
                </p>
              </div>

              <p className="text-[var(--gris-tech)] text-sm text-center mb-6 min-h-[3rem]">
                {tier.description}
              </p>

              <hr className="border-[var(--beige-dark)] mb-6" />

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    {feature.included ? <CheckIcon /> : <CrossIcon />}
                    <span
                      className={`text-sm ${
                        feature.included
                          ? "text-[var(--gris-dark)]"
                          : "text-[var(--gris-light)]"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.ctaHref}
                className={`btn w-full text-center ${
                  tier.highlighted ? "btn-primary" : "btn-secondary"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Info */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--bordeaux)] rounded-3xl p-10 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--bordeaux-light)] rounded-full opacity-30 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--or)] rounded-full opacity-20 blur-2xl" />

            <div className="relative z-10">
              <h2 className="font-cormorant text-3xl mb-3">
                Besoin d&apos;un devis personnalis&eacute; ?
              </h2>
              <p className="text-white/80 mb-6 max-w-lg mx-auto">
                Chaque &eacute;tablissement est unique. Contactez-nous pour recevoir
                une offre adapt&eacute;e &agrave; vos besoins, votre nombre de classes
                et vos sp&eacute;cificit&eacute;s p&eacute;dagogiques.
              </p>
              <Link
                href="/contact"
                className="btn bg-white text-[var(--bordeaux)] hover:bg-[var(--beige)] text-lg px-8 py-3"
              >
                Demander une d&eacute;monstration
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Billing */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-cormorant text-3xl text-[var(--bordeaux)] mb-8 text-center">
            Questions sur la facturation
          </h2>

          <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
            <details className="group">
              <summary className="cursor-pointer font-medium text-[var(--gris-dark)] hover:text-[var(--bordeaux)] transition-colors py-2">
                Comment fonctionne le forfait gratuit ?
              </summary>
              <p className="text-[var(--gris-tech)] pl-4 pb-3">
                Le forfait D&eacute;couverte est enti&egrave;rement gratuit et sans
                engagement. Il vous permet de tester la plateforme avec une
                classe et deux blocs de comp&eacute;tences. Vous pouvez passer &agrave;
                un forfait sup&eacute;rieur &agrave; tout moment.
              </p>
            </details>

            <hr className="border-[var(--beige-dark)]" />

            <details className="group">
              <summary className="cursor-pointer font-medium text-[var(--gris-dark)] hover:text-[var(--bordeaux)] transition-colors py-2">
                Quelle est la dur&eacute;e de l&apos;engagement ?
              </summary>
              <p className="text-[var(--gris-tech)] pl-4 pb-3">
                Les forfaits &Eacute;tablissement et Acad&eacute;mie sont propos&eacute;s
                avec un engagement annuel, align&eacute; sur l&apos;ann&eacute;e scolaire.
                Le renouvellement se fait sur simple accord. Il n&apos;y a pas
                d&apos;engagement minimum sur le forfait gratuit.
              </p>
            </details>

            <hr className="border-[var(--beige-dark)]" />

            <details className="group">
              <summary className="cursor-pointer font-medium text-[var(--gris-dark)] hover:text-[var(--bordeaux)] transition-colors py-2">
                Acceptez-vous les bons de commande publics ?
              </summary>
              <p className="text-[var(--gris-tech)] pl-4 pb-3">
                Oui, nous acceptons les bons de commande des &eacute;tablissements
                publics et les paiements par mandat administratif. Nous pouvons
                &eacute;galement facturer via les march&eacute;s publics et les groupements
                de commande acad&eacute;miques.
              </p>
            </details>

            <hr className="border-[var(--beige-dark)]" />

            <details className="group">
              <summary className="cursor-pointer font-medium text-[var(--gris-dark)] hover:text-[var(--bordeaux)] transition-colors py-2">
                Puis-je changer de forfait en cours d&apos;ann&eacute;e ?
              </summary>
              <p className="text-[var(--gris-tech)] pl-4 pb-3">
                Oui, la mise &agrave; niveau est possible &agrave; tout moment. Le
                passage du forfait Gratuit &agrave; &Eacute;tablissement se fait sans
                perte de donn&eacute;es. Pour le forfait Acad&eacute;mie, contactez-nous
                afin que nous adaptions la transition.
              </p>
            </details>

            <hr className="border-[var(--beige-dark)]" />

            <details className="group">
              <summary className="cursor-pointer font-medium text-[var(--gris-dark)] hover:text-[var(--bordeaux)] transition-colors py-2">
                Les donn&eacute;es sont-elles conserv&eacute;es apr&egrave;s la fin de l&apos;abonnement ?
              </summary>
              <p className="text-[var(--gris-tech)] pl-4 pb-3">
                &Agrave; la fin de l&apos;abonnement, vos donn&eacute;es sont conserv&eacute;es
                pendant 6 mois. Vous pouvez exporter toutes les donn&eacute;es de
                progression et les portfolios &eacute;l&egrave;ves &agrave; tout moment.
                Pass&eacute; ce d&eacute;lai, les donn&eacute;es sont supprim&eacute;es
                conform&eacute;ment au RGPD.
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}
