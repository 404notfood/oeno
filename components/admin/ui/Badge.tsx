interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "bordeaux" | "or";
  size?: "sm" | "md";
}

const variantStyles = {
  default: "bg-gris-light/20 text-gris-dark",
  success: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning",
  danger: "bg-danger/20 text-danger",
  info: "bg-info/20 text-info",
  bordeaux: "bg-bordeaux/20 text-bordeaux",
  or: "bg-or/20 text-or-dark",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export default function Badge({
  children,
  variant = "default",
  size = "sm",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </span>
  );
}

// Role badges helper
export function RoleBadge({ role }: { role: string }) {
  const roleConfig: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
    STUDENT: { label: "Eleve", variant: "info" },
    TEACHER: { label: "Enseignant", variant: "or" },
    ADMIN: { label: "Admin", variant: "bordeaux" },
    SUPER_ADMIN: { label: "Super Admin", variant: "danger" },
  };

  const config = roleConfig[role] || { label: role, variant: "default" as const };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

// Status badges helper
export function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? "success" : "danger"}>
      {isActive ? "Actif" : "Inactif"}
    </Badge>
  );
}
