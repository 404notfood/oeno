"use client";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "bordeaux" | "or" | "vert" | "info";
}

const colorClasses = {
  bordeaux: "bg-bordeaux/10 text-bordeaux",
  or: "bg-or/10 text-or",
  vert: "bg-vert/10 text-vert",
  info: "bg-info/10 text-info",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "bordeaux",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gris-tech">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gris-dark">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gris-tech">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? "text-success" : "text-danger"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <svg
                className={`w-4 h-4 ${
                  trend.isPositive ? "text-success" : "text-danger rotate-180"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              <span className="text-xs text-gris-tech">vs mois dernier</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        )}
      </div>
    </div>
  );
}
