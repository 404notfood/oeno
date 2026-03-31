import { AdminHeader } from "@/components/admin/layout";
import { getAromaTree } from "@/actions/admin";
import AromaTreeView from "./AromaTreeView";

export default async function AromesPage() {
  const aromaTree = await getAromaTree();

  return (
    <>
      <AdminHeader
        title="Roue des aromes"
        description="Gestion hierarchique des aromes"
      />
      <div className="p-6">
        <AromaTreeView categories={aromaTree} />
      </div>
    </>
  );
}
