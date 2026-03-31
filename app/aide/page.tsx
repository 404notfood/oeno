import Link from "next/link";

export const metadata = {
  title: "Aide | Oenoclass",
  description: "Centre d'aide et FAQ de la plateforme Oenoclass",
};

export default function AidePage() {
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
          Centre d&apos;aide
        </h1>

        <div className="space-y-6">
          {/* FAQ Élèves */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-cormorant text-2xl text-bordeaux mb-4">
              Questions fréquentes - Élèves
            </h2>

            <div className="space-y-4">
              <details className="group">
                <summary className="cursor-pointer font-medium text-gris-tech hover:text-bordeaux">
                  Comment me connecter avec mon compte ENT ?
                </summary>
                <p className="mt-2 text-gris-tech pl-4">
                  Sur la page de connexion, cliquez sur &quot;Se connecter avec GAR/ENT&quot;.
                  Vous serez redirigé vers votre ENT pour vous authentifier.
                  Une fois connecté, vous reviendrez automatiquement sur Oenoclass.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer font-medium text-gris-tech hover:text-bordeaux">
                  Comment accéder à mes activités ?
                </summary>
                <p className="mt-2 text-gris-tech pl-4">
                  Depuis votre tableau de bord, cliquez sur un bloc de compétences.
                  Vous verrez toutes les activités disponibles. Les activités vertes
                  sont complétées, les oranges sont en cours.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer font-medium text-gris-tech hover:text-bordeaux">
                  Où trouver mon portfolio ?
                </summary>
                <p className="mt-2 text-gris-tech pl-4">
                  Votre portfolio est accessible depuis le menu principal.
                  Il contient toutes vos fiches de dégustation et votre progression
                  dans les différents blocs de compétences.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer font-medium text-gris-tech hover:text-bordeaux">
                  J&apos;ai perdu mon mot de passe, que faire ?
                </summary>
                <p className="mt-2 text-gris-tech pl-4">
                  Cliquez sur &quot;Mot de passe oublié&quot; sur la page de connexion.
                  Un email vous sera envoyé avec un lien pour réinitialiser
                  votre mot de passe. Si vous utilisez le GAR, contactez votre
                  établissement.
                </p>
              </details>
            </div>
          </section>

          {/* FAQ Enseignants */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-cormorant text-2xl text-bordeaux mb-4">
              Questions fréquentes - Enseignants
            </h2>

            <div className="space-y-4">
              <details className="group">
                <summary className="cursor-pointer font-medium text-gris-tech hover:text-bordeaux">
                  Comment créer une séquence pédagogique ?
                </summary>
                <p className="mt-2 text-gris-tech pl-4">
                  Dans votre espace enseignant, allez dans &quot;Mes séquences&quot; puis
                  &quot;Créer une séquence&quot;. Vous pourrez sélectionner les activités
                  à inclure, définir l&apos;ordre et paramétrer les options.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer font-medium text-gris-tech hover:text-bordeaux">
                  Comment suivre la progression de mes élèves ?
                </summary>
                <p className="mt-2 text-gris-tech pl-4">
                  Le tableau de bord enseignant affiche une vue d&apos;ensemble de
                  la progression par classe. Cliquez sur une classe pour voir
                  le détail par élève et par compétence.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer font-medium text-gris-tech hover:text-bordeaux">
                  Comment donner un feedback à un élève ?
                </summary>
                <p className="mt-2 text-gris-tech pl-4">
                  Depuis le suivi d&apos;un élève, cliquez sur une activité complétée
                  pour voir sa réponse. Vous pouvez ajouter un commentaire et
                  une note qui seront visibles par l&apos;élève.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer font-medium text-gris-tech hover:text-bordeaux">
                  Puis-je personnaliser les activités ?
                </summary>
                <p className="mt-2 text-gris-tech pl-4">
                  Les activités du catalogue sont prédéfinies, mais vous pouvez
                  créer des séquences personnalisées en sélectionnant et ordonnant
                  les activités selon vos besoins pédagogiques.
                </p>
              </details>
            </div>
          </section>

          {/* Support technique */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-cormorant text-2xl text-bordeaux mb-4">
              Support technique
            </h2>

            <div className="space-y-4 text-gris-tech">
              <p>
                <strong>Problème technique ?</strong><br />
                Contactez notre support : [email à compléter]
              </p>

              <p>
                <strong>Bug ou suggestion ?</strong><br />
                Utilisez le bouton de feedback en bas à droite de chaque page
                pour nous signaler un problème ou proposer une amélioration.
              </p>

              <div className="bg-beige rounded p-4 mt-4">
                <p className="font-medium text-bordeaux mb-2">Navigateurs supportés</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Google Chrome (dernières versions)</li>
                  <li>Mozilla Firefox (dernières versions)</li>
                  <li>Microsoft Edge (dernières versions)</li>
                  <li>Safari (dernières versions)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-bordeaux text-white rounded-lg shadow-md p-6">
            <h2 className="font-cormorant text-2xl mb-4">
              Besoin d&apos;aide supplémentaire ?
            </h2>
            <p className="mb-4">
              Notre équipe est disponible pour répondre à vos questions
              du lundi au vendredi, de 9h à 17h.
            </p>
            <a
              href="mailto:support@oenoclass.fr"
              className="inline-block bg-white text-bordeaux px-6 py-2 rounded-lg font-medium hover:bg-beige transition-colors"
            >
              Nous contacter
            </a>
          </section>
        </div>

        <p className="text-center text-gris-tech mt-8 text-sm">
          Dernière mise à jour : Janvier 2026
        </p>
      </div>
    </main>
  );
}
