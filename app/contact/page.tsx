import Link from "next/link";
import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Demander une demonstration | OenoClass",
  description:
    "Demandez une demonstration de la plateforme OenoClass pour votre etablissement. Contact et informations.",
};

export default function ContactPage() {
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
            Demander une d&eacute;monstration
          </h1>
          <p className="text-lg text-[var(--gris-tech)] max-w-2xl">
            Vous souhaitez d&eacute;couvrir OenoClass pour votre &eacute;tablissement ?
            Remplissez le formulaire ci-dessous et notre &eacute;quipe vous recontactera
            sous 48h pour organiser une d&eacute;monstration personnalis&eacute;e.
          </p>
        </div>
      </section>

      {/* Form + Contact Info */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-12">
          {/* Form (2 columns) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <ContactForm />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="font-cormorant text-2xl text-[var(--bordeaux)] mb-4">
                Nous contacter
              </h2>
              <div className="space-y-4 text-[var(--gris-tech)]">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-[var(--bordeaux)] mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-[var(--gris-dark)]">Email</p>
                    <a
                      href="mailto:contact@oenoclass.fr"
                      className="text-[var(--bordeaux)] hover:text-[var(--bordeaux-light)] transition-colors"
                    >
                      contact@oenoclass.fr
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-[var(--bordeaux)] mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-[var(--gris-dark)]">T&eacute;l&eacute;phone</p>
                    <p>01 XX XX XX XX</p>
                    <p className="text-sm">Lun-Ven, 9h-17h</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-[var(--bordeaux)] mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-[var(--gris-dark)]">Adresse</p>
                    <p>[Adresse &agrave; compl&eacute;ter]</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response time */}
            <div className="bg-[var(--bordeaux)] text-white rounded-2xl p-6">
              <h3 className="font-cormorant text-xl mb-2">
                D&eacute;lai de r&eacute;ponse
              </h3>
              <p className="text-white/80 text-sm">
                Notre &eacute;quipe s&apos;engage &agrave; vous recontacter sous 48 heures
                ouvr&eacute;es. La d&eacute;monstration dure environ 30 minutes et peut
                se faire en visioconf&eacute;rence ou sur site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-cormorant text-3xl text-[var(--bordeaux)] mb-8 text-center">
            Questions fr&eacute;quentes
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-cormorant text-xl text-[var(--bordeaux)] mb-2">
                Comment se d&eacute;roule le d&eacute;ploiement ?
              </h3>
              <p className="text-[var(--gris-tech)]">
                Apr&egrave;s la d&eacute;monstration, nous configurons votre espace
                &eacute;tablissement en moins de 24h. L&apos;int&eacute;gration avec le GAR
                et votre ENT est prise en charge par notre &eacute;quipe technique.
                Vos enseignants et &eacute;l&egrave;ves peuvent commencer d&egrave;s le
                lendemain.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-cormorant text-xl text-[var(--bordeaux)] mb-2">
                Faut-il installer un logiciel ?
              </h3>
              <p className="text-[var(--gris-tech)]">
                Non, OenoClass est une plateforme 100% en ligne. Il suffit d&apos;un
                navigateur web r&eacute;cent (Chrome, Firefox, Edge, Safari). La plateforme
                est &eacute;galement optimis&eacute;e pour les tablettes, tr&egrave;s utilis&eacute;es
                en lyc&eacute;e agricole.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-cormorant text-xl text-[var(--bordeaux)] mb-2">
                La plateforme est-elle compatible avec le GAR ?
              </h3>
              <p className="text-[var(--gris-tech)]">
                Oui, OenoClass est int&eacute;gr&eacute;e au Gestionnaire d&apos;Acc&egrave;s aux
                Ressources (GAR) de l&apos;&Eacute;ducation Nationale. Vos &eacute;l&egrave;ves
                et enseignants peuvent se connecter directement depuis leur ENT
                sans cr&eacute;er de compte suppl&eacute;mentaire.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-cormorant text-xl text-[var(--bordeaux)] mb-2">
                Proposez-vous une formation pour les enseignants ?
              </h3>
              <p className="text-[var(--gris-tech)]">
                Oui, chaque d&eacute;ploiement inclut une session de formation en ligne
                de 1h pour les enseignants. Des tutoriels vid&eacute;o et une documentation
                compl&egrave;te sont &eacute;galement disponibles. Le forfait Acad&eacute;mie
                inclut une formation sur site.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
