import { AdminHeader } from "@/components/admin/layout";
import { getSettings, getSettingCategories } from "@/actions/admin";
import SettingsForm from "./SettingsForm";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function SettingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentCategory = params.category || "general";

  const [settings, categories] = await Promise.all([
    getSettings(currentCategory),
    getSettingCategories(),
  ]);

  return (
    <>
      <AdminHeader
        title="Paramètres système"
        description="Configuration globale de la plateforme"
      />

      <div className="p-6">
        <SettingsForm
          settings={settings}
          categories={categories}
          currentCategory={currentCategory}
        />
      </div>
    </>
  );
}
