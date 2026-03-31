import { AdminHeader } from "@/components/admin/layout";
import { getQuizzes, getBlocs } from "@/actions/admin";
import QuizTable from "./QuizTable";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ search?: string; blockId?: string; page?: string }>;
}

export default async function QuizPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const filters = { search: params.search, blockId: params.blockId, page, limit: 10 };

  const [result, blocs] = await Promise.all([getQuizzes(filters), getBlocs()]);

  return (
    <>
      <AdminHeader
        title="Quiz"
        description={`${result.pagination.total} quiz au total`}
        actions={
          <Link href="/admin/quiz/nouveau" className="btn btn-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau quiz
          </Link>
        }
      />
      <div className="p-6">
        <QuizTable quizzes={result.data} pagination={result.pagination} blocs={blocs} currentFilters={filters} />
      </div>
    </>
  );
}
