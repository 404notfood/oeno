"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const pathLabels: Record<string, string> = {
  admin: "Administration",
  utilisateurs: "Utilisateurs",
  etablissements: "Établissements",
  classes: "Classes",
  blocs: "Blocs de compétences",
  quiz: "Quiz",
  questions: "Questions",
  vins: "Vins",
  cepages: "Cépages",
  appellations: "Appellations",
  aromes: "Arômes",
  glossaire: "Glossaire",
  logs: "Logs d'audit",
  nouveau: "Nouveau",
  nouvelle: "Nouvelle",
  activites: "Activités",
  permissions: "Permissions",
  parametres: "Paramètres",
  analytics: "Analytics",
};

export default function AdminHeader({
  title,
  description,
  actions,
}: AdminHeaderProps) {
  const pathname = usePathname();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    let currentPath = "";
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentPath += `/${segment}`;

      // Skip UUID-like segments in breadcrumb labels but keep the path
      const isUuid = /^[a-z0-9]{20,}$/i.test(segment);
      const label = isUuid ? "Détails" : pathLabels[segment] || segment;

      breadcrumbs.push({
        label,
        href: i < segments.length - 1 ? currentPath : undefined,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="bg-white border-b border-beige-dark">
      <div className="px-6 py-4">
        {/* Breadcrumbs */}
        <nav className="mb-2">
          <ol className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <svg
                    className="h-4 w-4 text-gris-light"
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
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-gris-tech hover:text-bordeaux transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gris-dark font-medium">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Title and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-bordeaux font-cormorant">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-gris-tech">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
