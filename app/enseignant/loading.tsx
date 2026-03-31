import { CardSkeleton } from "@/components/ui/Skeleton";

export default function TeacherLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-56 animate-pulse rounded-xl bg-[var(--beige-dark)] mb-2" />
        <div className="h-4 w-80 animate-pulse rounded-xl bg-[var(--beige-dark)]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
