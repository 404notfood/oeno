import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--beige)]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--beige-dark)]" aria-label="Navigation principale">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo/favicon_enoclass.svg"
              alt="OenoClass"
              width={40}
              height={40}
              priority
            />
            <span className="font-cormorant text-2xl font-bold text-[var(--bordeaux)]">
              OenoClass
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#fonctionnalites"
              className="text-[var(--gris-tech)] hover:text-[var(--bordeaux)] transition-colors"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#blocs"
              className="text-[var(--gris-tech)] hover:text-[var(--bordeaux)] transition-colors"
            >
              Les 8 blocs
            </Link>
            <Link
              href="#contact"
              className="text-[var(--gris-tech)] hover:text-[var(--bordeaux)] transition-colors"
            >
              Contact
            </Link>
          </div>

          <Link href="/login" className="btn btn-primary">
            Se connecter
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main id="main-content">
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-[var(--bordeaux)] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--or)] opacity-10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm mb-6">
                <span className="w-2 h-2 bg-[var(--vert)] rounded-full animate-pulse-soft" />
                <span className="text-sm text-[var(--gris-tech)]">
                  Nouveau : Intégration ENT / GAR
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                L&apos;oenologie{" "}
                <span className="text-gradient">interactive</span> pour les
                lycéens
              </h1>

              <p className="text-xl text-[var(--gris-tech)] mb-8 max-w-xl">
                Découvrez OenoClass, la plateforme pédagogique qui révolutionne
                l&apos;enseignement du vin dans les lycées agricoles. 8 blocs de
                compétences, des activités interactives et un suivi personnalisé.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login" className="btn btn-primary text-lg px-8 py-4">
                  Commencer gratuitement
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
                <Link href="#demo" className="btn btn-secondary text-lg px-8 py-4">
                  Voir la démo
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-[var(--beige-dark)]">
                <div>
                  <div className="text-3xl font-bold text-[var(--bordeaux)] font-cormorant">
                    8
                  </div>
                  <div className="text-sm text-[var(--gris-tech)]">
                    Blocs de compétences
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[var(--bordeaux)] font-cormorant">
                    45+
                  </div>
                  <div className="text-sm text-[var(--gris-tech)]">
                    Activités interactives
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[var(--bordeaux)] font-cormorant">
                    700+
                  </div>
                  <div className="text-sm text-[var(--gris-tech)]">
                    Établissements ciblés
                  </div>
                </div>
              </div>
            </div>

            {/* Image mascotte */}
            <div className="relative animate-fade-in-up delay-200">
              <div className="relative z-10 animate-float">
                <Image
                  src="/images/logo/logo_raison.jpeg"
                  alt="Mascotte OenoClass - Grappe de raisin sympa"
                  width={500}
                  height={500}
                  className="rounded-3xl shadow-2xl"
                  priority
                />
              </div>
              {/* Decorations */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--or)] rounded-full opacity-20" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[var(--vert)] rounded-full opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalites" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Une plateforme complète
            </h2>
            <p className="text-xl text-[var(--gris-tech)] max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour enseigner et apprendre
              l&apos;oenologie de manière moderne et interactive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card animate-fade-in-up delay-100">
              <div className="w-14 h-14 bg-[var(--bordeaux)] bg-opacity-10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-3xl">🍇</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Roue des arômes</h3>
              <p className="text-[var(--gris-tech)]">
                Explorez les familles aromatiques du vin avec notre roue
                interactive. Identifiez et mémorisez les descripteurs comme un
                professionnel.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card animate-fade-in-up delay-200">
              <div className="w-14 h-14 bg-[var(--or)] bg-opacity-10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Suivi de progression</h3>
              <p className="text-[var(--gris-tech)]">
                Visualisez votre avancement bloc par bloc. Les enseignants
                suivent leurs classes en temps réel avec des tableaux de bord
                détaillés.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card animate-fade-in-up delay-300">
              <div className="w-14 h-14 bg-[var(--vert)] bg-opacity-10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quiz adaptatifs</h3>
              <p className="text-[var(--gris-tech)]">
                Des QCM intelligents avec feedback immédiat. Validation
                automatique pour les réponses objectives, évaluation enseignant
                pour les autres.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card animate-fade-in-up delay-100">
              <div className="w-14 h-14 bg-[var(--info)] bg-opacity-10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fiches d&apos;analyse</h3>
              <p className="text-[var(--gris-tech)]">
                Rédigez des fiches de dégustation structurées : aspect visuel,
                olfactif et gustatif. Constituez votre portfolio personnel.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card animate-fade-in-up delay-200">
              <div className="w-14 h-14 bg-[var(--warning)] bg-opacity-10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-3xl">🔐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connexion ENT / GAR</h3>
              <p className="text-[var(--gris-tech)]">
                Authentification sécurisée via le GAR de l&apos;Éducation Nationale.
                Un seul identifiant pour accéder à toutes vos ressources.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card animate-fade-in-up delay-300">
              <div className="w-14 h-14 bg-[var(--danger)] bg-opacity-10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Référentiel complet</h3>
              <p className="text-[var(--gris-tech)]">
                Glossaire interactif, fiches cépages, carte des appellations.
                Toutes les ressources pour devenir incollable sur le vin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blocs Section */}
      <section id="blocs" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              8 blocs de compétences
            </h2>
            <p className="text-xl text-[var(--gris-tech)] max-w-2xl mx-auto">
              Un parcours structuré couvrant tous les aspects de l&apos;oenologie,
              du CAPa au BTSA.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: 1, icon: "🍇", title: "Culture vitivinicole", color: "bordeaux" },
              { num: 2, icon: "🌿", title: "Vigne et raisin", color: "vert" },
              { num: 3, icon: "🍷", title: "Vinification", color: "bordeaux" },
              { num: 4, icon: "👃", title: "Analyse sensorielle", color: "or" },
              { num: 5, icon: "🍃", title: "Cépages et styles", color: "vert" },
              { num: 6, icon: "🔍", title: "Qualité et défauts", color: "bordeaux" },
              { num: 7, icon: "🥂", title: "Vins sans alcool", color: "or" },
              { num: 8, icon: "⚖️", title: "Réglementation", color: "gris-tech" },
            ].map((bloc) => (
              <div
                key={bloc.num}
                className="group relative bg-[var(--beige)] rounded-2xl p-6 hover:bg-[var(--beige-dark)] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-4xl">{bloc.icon}</span>
                  <span
                    className={`text-sm font-semibold text-[var(--${bloc.color})] bg-white px-3 py-1 rounded-full`}
                  >
                    Bloc {bloc.num}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--gris-dark)] group-hover:text-[var(--bordeaux)] transition-colors">
                  {bloc.title}
                </h3>
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-[var(--bordeaux)] rounded-3xl p-12 md:p-16 text-center overflow-hidden">
            {/* Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--bordeaux-light)] rounded-full opacity-30 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--or)] rounded-full opacity-20 blur-2xl" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-cormorant">
                Prêt à révolutionner l&apos;enseignement de l&apos;oenologie ?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Rejoignez les établissements pilotes et bénéficiez d&apos;un
                accompagnement personnalisé pour déployer OenoClass.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="btn bg-white text-[var(--bordeaux)] hover:bg-[var(--beige)] text-lg px-8 py-4"
                >
                  Demander une démo
                </Link>
                <Link
                  href="/tarifs"
                  className="btn border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4"
                >
                  Voir les tarifs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-[var(--gris-dark)] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/images/logo/favicon_enoclass.svg"
                  alt="OenoClass"
                  width={48}
                  height={48}
                />
                <span className="font-cormorant text-3xl font-bold">OenoClass</span>
              </div>
              <p className="text-white/70 max-w-sm">
                La plateforme pédagogique de référence pour l&apos;enseignement de
                l&apos;oenologie dans les lycées agricoles français.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <Link href="#fonctionnalites" className="hover:text-white transition-colors">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link href="#blocs" className="hover:text-white transition-colors">
                    Les 8 blocs
                  </Link>
                </li>
                <li>
                  <Link href="/tarifs" className="hover:text-white transition-colors">
                    Tarifs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <Link href="/mentions-legales" className="hover:text-white transition-colors">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link href="/confidentialite" className="hover:text-white transition-colors">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/cgu" className="hover:text-white transition-colors">
                    CGU
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © 2026 OenoClass by <Link href="https://404notfood.fr" target="_blank" className="text-white hover:text-white/70 transition-colors">404NotFood</Link>. Tous droits réservés.
            </p>
            <p className="text-white/50 text-sm">
              Conforme RGPD et RGAA niveau AA
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
