interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "bordeaux" | "or" | "vert" | "info";
}

const variantStyles = {
  default: {
    bg: "bg-white",
    icon: "bg-beige text-gris-tech",
    trend: {
      positive: "text-success bg-success/10",
      negative: "text-danger bg-danger/10",
    },
  },
  bordeaux: {
    bg: "bg-bordeaux",
    icon: "bg-white/20 text-white",
    trend: {
      positive: "text-white/90 bg-white/20",
      negative: "text-white/90 bg-white/20",
    },
  },
  or: {
    bg: "bg-or",
    icon: "bg-white/20 text-white",
    trend: {
      positive: "text-white/90 bg-white/20",
      negative: "text-white/90 bg-white/20",
    },
  },
  vert: {
    bg: "bg-vert",
    icon: "bg-white/20 text-white",
    trend: {
      positive: "text-white/90 bg-white/20",
      negative: "text-white/90 bg-white/20",
    },
  },
  info: {
    bg: "bg-info",
    icon: "bg-white/20 text-white",
    trend: {
      positive: "text-white/90 bg-white/20",
      negative: "text-white/90 bg-white/20",
    },
  },
};

const defaultIcons: Record<string, string> = {
  users:
    "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  establishments:
    "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  classes:
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  activities:
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  quizzes:
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  chart:
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
};

export default function StatsCard({
  title,
  value,
  description,
  icon = "chart",
  trend,
  variant = "default",
}: StatsCardProps) {
  const styles = variantStyles[variant];
  const iconPath = defaultIcons[icon] || defaultIcons.chart;
  const isColored = variant !== "default";

  return (
    <div
      className={`${styles.bg} rounded-xl p-6 shadow-sm border border-beige-dark/50`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${styles.icon}`}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d={iconPath}
            />
          </svg>
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
              trend.isPositive
                ? styles.trend.positive
                : styles.trend.negative
            }`}
          >
            {trend.isPositive ? (
              <svg
                className="h-3 w-3"
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
            ) : (
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            )}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p
          className={`text-sm font-medium ${
            isColored ? "text-white/80" : "text-gris-tech"
          }`}
        >
          {title}
        </p>
        <p
          className={`mt-1 text-3xl font-bold font-cormorant ${
            isColored ? "text-white" : "text-gris-dark"
          }`}
        >
          {value}
        </p>
        {description && (
          <p
            className={`mt-1 text-xs ${
              isColored ? "text-white/70" : "text-gris-light"
            }`}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
