import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions G\u00e9n\u00e9rales d\u2019Utilisation | OenoClass",
  description:
    "Conditions g\u00e9n\u00e9rales d\u2019utilisation de la plateforme p\u00e9dagogique OenoClass.",
};

export default function CguPage() {
  return (
    <main className="min-h-screen bg-beige py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-bordeaux hover:text-bordeaux-light mb-8 inline-block"
        >
          &larr; Retour &agrave; l&apos;accueil
        </Link>

        <h1 className="font-cormorant text-4xl text-bordeaux mb-8">
          Conditions G&eacute;n&eacute;rales d&apos;Utilisation
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6 text-gris-tech">
          {/* 1. Objet */}
          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              1. Objet
            </h2>
            <p>
              Les pr&eacute;sentes Conditions G&eacute;n&eacute;rales d&apos;Utilisation (ci-apr&egrave;s
              &laquo; CGU &raquo;) ont pour objet de d&eacute;finir les conditions dans
              lesquelles la soci&eacute;t&eacute; OenoClass (ci-apr&egrave;s &laquo; l&apos;&Eacute;diteur &raquo;)
              met &agrave; disposition sa plateforme p&eacute;dagogique en ligne d&eacute;di&eacute;e &agrave;
              l&apos;enseignement de l&apos;oenologie (ci-apr&egrave;s &laquo; la Plateforme &raquo;) et
              les conditions dans lesquelles les utilisateurs (ci-apr&egrave;s
              &laquo; l&apos;Utilisateur &raquo;) y acc&egrave;dent et l&apos;utilisent.
            </p>
            <p className="mt-2">
              La Plateforme est destin&eacute;e aux &eacute;tablissements d&apos;enseignement
              agricole, &agrave; leurs enseignants et &agrave; leurs &eacute;l&egrave;ves dans le cadre
              d&apos;activit&eacute;s p&eacute;dagogiques li&eacute;es &agrave; l&apos;oenologie et &agrave; la
              viticulture.
            </p>
            <p className="mt-2">
              L&apos;utilisation de la Plateforme implique l&apos;acceptation pleine et
              enti&egrave;re des pr&eacute;sentes CGU. Si vous n&apos;acceptez pas ces conditions,
              veuillez ne pas utiliser la Plateforme.
            </p>
          </section>

          {/* 2. Acces au service */}
          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              2. Acc&egrave;s au service
            </h2>
            <p>
              L&apos;acc&egrave;s &agrave; la Plateforme est r&eacute;serv&eacute; aux utilisateurs disposant
              d&apos;un compte cr&eacute;&eacute; par un administrateur d&apos;&eacute;tablissement, ou via
              le Gestionnaire d&apos;Acc&egrave;s aux Ressources (GAR) de l&apos;&Eacute;ducation
              Nationale.
            </p>
            <p className="mt-2">
              L&apos;&Eacute;diteur s&apos;efforce de maintenir la Plateforme accessible
              24 heures sur 24, 7 jours sur 7, hors p&eacute;riodes de maintenance
              programm&eacute;e ou en cas de force majeure. L&apos;&Eacute;diteur ne saurait
              &ecirc;tre tenu responsable des interruptions de service li&eacute;es &agrave; des
              facteurs ext&eacute;rieurs (panne r&eacute;seau, maintenance de l&apos;h&eacute;bergeur,
              etc.).
            </p>
            <p className="mt-2">
              L&apos;&Eacute;diteur se r&eacute;serve le droit de suspendre ou d&apos;interrompre
              temporairement l&apos;acc&egrave;s &agrave; tout ou partie de la Plateforme pour
              des raisons de maintenance, de mise &agrave; jour ou d&apos;am&eacute;lioration,
              sans pr&eacute;avis ni indemnit&eacute;.
            </p>
          </section>

          {/* 3. Comptes utilisateurs */}
          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              3. Comptes utilisateurs
            </h2>
            <p>
              Trois types de comptes sont disponibles sur la Plateforme :
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong>&Eacute;l&egrave;ve</strong> : acc&egrave;s aux activit&eacute;s p&eacute;dagogiques,
                suivi de progression, portfolio personnel.
              </li>
              <li>
                <strong>Enseignant</strong> : acc&egrave;s aux outils de cr&eacute;ation de
                s&eacute;quences, suivi des &eacute;l&egrave;ves, &eacute;valuation et feedback.
              </li>
              <li>
                <strong>Administrateur</strong> : gestion de l&apos;&eacute;tablissement,
                des classes et des utilisateurs.
              </li>
            </ul>
            <p className="mt-2">
              Chaque Utilisateur s&apos;engage &agrave; fournir des informations exactes
              lors de la cr&eacute;ation de son compte et &agrave; les maintenir &agrave; jour.
              L&apos;Utilisateur est responsable de la confidentialit&eacute; de ses
              identifiants de connexion et de toute activit&eacute; effectu&eacute;e sous
              son compte.
            </p>
            <p className="mt-2">
              En cas de suspicion d&apos;utilisation non autoris&eacute;e de son compte,
              l&apos;Utilisateur doit en informer imm&eacute;diatement l&apos;&Eacute;diteur &agrave;
              l&apos;adresse contact@oenoclass.fr.
            </p>
          </section>

          {/* 4. Propriete intellectuelle */}
          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              4. Propri&eacute;t&eacute; intellectuelle
            </h2>
            <p>
              L&apos;ensemble des &eacute;l&eacute;ments constituant la Plateforme (textes,
              graphismes, images, logos, ic&ocirc;nes, sons, logiciels, base de
              donn&eacute;es, structure p&eacute;dagogique, activit&eacute;s interactives) est la
              propri&eacute;t&eacute; exclusive de l&apos;&Eacute;diteur ou fait l&apos;objet d&apos;une
              autorisation d&apos;exploitation.
            </p>
            <p className="mt-2">
              Toute reproduction, repr&eacute;sentation, modification, publication,
              transmission ou d&eacute;naturation, totale ou partielle, de la
              Plateforme ou de son contenu, par quelque proc&eacute;d&eacute; que ce soit
              et sur quelque support que ce soit, est interdite sans
              l&apos;autorisation &eacute;crite pr&eacute;alable de l&apos;&Eacute;diteur.
            </p>
            <p className="mt-2">
              Les contenus cr&eacute;&eacute;s par les Utilisateurs dans le cadre de leur
              utilisation de la Plateforme (r&eacute;ponses aux activit&eacute;s, fiches de
              d&eacute;gustation, portfolios) restent leur propri&eacute;t&eacute;.
              L&apos;Utilisateur accorde toutefois &agrave; l&apos;&Eacute;diteur un droit
              d&apos;utilisation anonymis&eacute;e &agrave; des fins d&apos;am&eacute;lioration de la
              Plateforme.
            </p>
          </section>

          {/* 5. Donnees personnelles */}
          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              5. Donn&eacute;es personnelles
            </h2>
            <p>
              L&apos;&Eacute;diteur collecte et traite des donn&eacute;es personnelles dans le
              cadre de l&apos;utilisation de la Plateforme, conform&eacute;ment au
              R&egrave;glement G&eacute;n&eacute;ral sur la Protection des Donn&eacute;es (RGPD) et &agrave;
              la loi Informatique et Libert&eacute;s du 6 janvier 1978 modifi&eacute;e.
            </p>
            <p className="mt-2">
              Les donn&eacute;es collect&eacute;es sont n&eacute;cessaires au fonctionnement du
              service et au suivi p&eacute;dagogique des &eacute;l&egrave;ves. Elles ne sont
              jamais vendues &agrave; des tiers et sont trait&eacute;es dans le strict
              respect de notre{" "}
              <Link
                href="/confidentialite"
                className="text-bordeaux hover:text-bordeaux-light underline"
              >
                Politique de Confidentialit&eacute;
              </Link>
              .
            </p>
            <p className="mt-2">
              S&apos;agissant d&apos;une plateforme &eacute;ducative utilis&eacute;e par des mineurs,
              l&apos;&Eacute;diteur porte une attention particuli&egrave;re &agrave; la protection
              des donn&eacute;es des &eacute;l&egrave;ves. Les donn&eacute;es de progression sont
              uniquement accessibles &agrave; l&apos;&eacute;l&egrave;ve concern&eacute;, &agrave; ses enseignants
              et &agrave; l&apos;administrateur de l&apos;&eacute;tablissement.
            </p>
            <p className="mt-2">
              Conform&eacute;ment au RGPD, chaque Utilisateur dispose d&apos;un droit
              d&apos;acc&egrave;s, de rectification, d&apos;effacement, de portabilit&eacute; et
              d&apos;opposition concernant ses donn&eacute;es personnelles. Pour exercer
              ces droits, contactez : contact@oenoclass.fr.
            </p>
          </section>

          {/* 6. Responsabilites */}
          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              6. Responsabilit&eacute;s
            </h2>
            <h3 className="font-cormorant text-lg text-bordeaux mt-4 mb-2">
              6.1 Responsabilit&eacute;s de l&apos;&Eacute;diteur
            </h3>
            <p>
              L&apos;&Eacute;diteur s&apos;engage &agrave; mettre en &oelig;uvre tous les moyens
              raisonnables pour assurer le bon fonctionnement de la Plateforme
              et la s&eacute;curit&eacute; des donn&eacute;es. Toutefois, l&apos;&Eacute;diteur ne
              saurait &ecirc;tre tenu responsable :
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                Des difficult&eacute;s d&apos;acc&egrave;s li&eacute;es &agrave; des perturbations du
                r&eacute;seau Internet.
              </li>
              <li>
                Des dommages r&eacute;sultant de l&apos;utilisation ou de l&apos;impossibilit&eacute;
                d&apos;utiliser la Plateforme.
              </li>
              <li>
                De l&apos;exactitude p&eacute;dagogique absolue des contenus, qui sont
                fournis &agrave; titre &eacute;ducatif et compl&eacute;mentaire.
              </li>
            </ul>

            <h3 className="font-cormorant text-lg text-bordeaux mt-4 mb-2">
              6.2 Responsabilit&eacute;s de l&apos;Utilisateur
            </h3>
            <p>L&apos;Utilisateur s&apos;engage &agrave; :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                Utiliser la Plateforme conform&eacute;ment &agrave; sa destination
                p&eacute;dagogique.
              </li>
              <li>
                Ne pas tenter de porter atteinte au bon fonctionnement de la
                Plateforme.
              </li>
              <li>
                Ne pas diffuser de contenus illicites, injurieux ou contraires
                aux bonnes m&oelig;urs.
              </li>
              <li>
                Respecter les droits de propri&eacute;t&eacute; intellectuelle de
                l&apos;&Eacute;diteur et des tiers.
              </li>
              <li>
                Signaler tout dysfonctionnement ou toute faille de s&eacute;curit&eacute;
                constat&eacute;e.
              </li>
            </ul>
            <p className="mt-2">
              En cas de manquement &agrave; ces obligations, l&apos;&Eacute;diteur se r&eacute;serve
              le droit de suspendre ou de supprimer le compte de l&apos;Utilisateur
              concern&eacute;, sans pr&eacute;avis ni indemnit&eacute;.
            </p>
          </section>

          {/* 7. Modification des CGU */}
          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              7. Modification des CGU
            </h2>
            <p>
              L&apos;&Eacute;diteur se r&eacute;serve le droit de modifier les pr&eacute;sentes CGU
              &agrave; tout moment. Les Utilisateurs seront inform&eacute;s de toute
              modification substantielle par notification sur la Plateforme ou
              par email.
            </p>
            <p className="mt-2">
              La poursuite de l&apos;utilisation de la Plateforme apr&egrave;s notification
              des modifications vaut acceptation des nouvelles CGU. En cas de
              d&eacute;saccord, l&apos;Utilisateur peut demander la cl&ocirc;ture de son compte.
            </p>
          </section>

          {/* 8. Droit applicable */}
          <section>
            <h2 className="font-cormorant text-2xl text-bordeaux mb-3">
              8. Droit applicable
            </h2>
            <p>
              Les pr&eacute;sentes CGU sont r&eacute;gies par le droit fran&ccedil;ais. En cas
              de litige relatif &agrave; l&apos;interpr&eacute;tation, l&apos;ex&eacute;cution ou la
              r&eacute;siliation des pr&eacute;sentes, les parties s&apos;engagent &agrave;
              rechercher une solution amiable avant toute action judiciaire.
            </p>
            <p className="mt-2">
              &Agrave; d&eacute;faut de r&eacute;solution amiable dans un d&eacute;lai de trente (30)
              jours, le litige sera soumis aux tribunaux comp&eacute;tents du ressort
              du si&egrave;ge social de l&apos;&Eacute;diteur.
            </p>
            <p className="mt-2">
              Pour toute question relative aux pr&eacute;sentes CGU, vous pouvez nous
              contacter &agrave; l&apos;adresse :{" "}
              <a
                href="mailto:contact@oenoclass.fr"
                className="text-bordeaux hover:text-bordeaux-light"
              >
                contact@oenoclass.fr
              </a>
            </p>
          </section>
        </div>

        <p className="text-center text-gris-tech mt-8 text-sm">
          Derni&egrave;re mise &agrave; jour : 10 mars 2026
        </p>
      </div>
    </main>
  );
}
