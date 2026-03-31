import { CardSkeleton } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div>
      <div className="bg-white border-b border-[var(--beige-dark)] px-6 py-4">
        <div className="h-4 w-32 animate-pulse rounded bg-[var(--beige-dark)] mb-2" />
        <div className="h-7 w-48 animate-pulse rounded bg-[var(--beige-dark)]" />
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
