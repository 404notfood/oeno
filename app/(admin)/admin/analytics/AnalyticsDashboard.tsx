"use client";

import { useState } from "react";
import {
  AreaChartCard,
  BarChartCard,
  PieChartCard,
  LineChartCard,
  StatCard,
} from "@/components/admin/charts";

interface TimeSeriesDataPoint {
  name: string;
  value: number;
}

interface MultiSeriesDataPoint {
  name: string;
  [key: string]: string | number;
}

interface DistributionDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface AnalyticsDashboardProps {
  userRegistrations: TimeSeriesDataPoint[];
  roleDistribution: DistributionDataPoint[];
  activityByBloc: DistributionDataPoint[];
  quizStats: MultiSeriesDataPoint[];
  loginStats: TimeSeriesDataPoint[];
  establishmentsByRegion: DistributionDataPoint[];
  classesByLevel: DistributionDataPoint[];
  contentStats: {
    wines: number;
    grapes: number;
    appellations: number;
    glossaryTerms: number;
    quizzes: number;
    questions: number;
  };
  trends: {
    users: { current: number; previous: number; trend: number };
    sessions: { current: number; previous: number; trend: number };
    quizCompleted: { current: number; previous: number; trend: number };
  };
}

type Period = "week" | "month" | "year";

export default function AnalyticsDashboard({
  userRegistrations,
  roleDistribution,
  activityByBloc,
  quizStats,
  loginStats,
  establishmentsByRegion,
  classesByLevel,
  contentStats,
  trends,
}: AnalyticsDashboardProps) {
  const [period, setPeriod] = useState<Period>("month");

  const periodLabels: Record<Period, string> = {
    week: "Cette semaine",
    month: "Ce mois",
    year: "Cette année",
  };

  return (
    <div className="space-y-6">
      {/* Période selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gris-dark">Vue d&apos;ensemble</h2>
        <div className="flex gap-2">
          {(["week", "month", "year"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? "bg-bordeaux text-white"
                  : "bg-beige text-gris-dark hover:bg-beige-dark"
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs avec tendances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Nouveaux utilisateurs"
          value={trends.users.current}
          subtitle="ce mois-ci"
          trend={{
            value: trends.users.trend,
            isPositive: trends.users.trend >= 0,
          }}
          color="bordeaux"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Connexions"
          value={trends.sessions.current}
          subtitle="ce mois-ci"
          trend={{
            value: trends.sessions.trend,
            isPositive: trends.sessions.trend >= 0,
          }}
          color="or"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          }
        />
        <StatCard
          title="Quiz complétés"
          value={trends.quizCompleted.current}
          subtitle="ce mois-ci"
          trend={{
            value: trends.quizCompleted.trend,
            isPositive: trends.quizCompleted.trend >= 0,
          }}
          color="vert"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Contenu total"
          value={
            contentStats.wines +
            contentStats.grapes +
            contentStats.appellations +
            contentStats.glossaryTerms
          }
          subtitle="éléments de référence"
          color="info"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          }
        />
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaChartCard
          title="Inscriptions utilisateurs"
          subtitle="Évolution des nouvelles inscriptions"
          data={userRegistrations}
          color="#6B1F3D"
          gradientId="userRegistrations"
        />
        <AreaChartCard
          title="Connexions"
          subtitle="Nombre de sessions créées"
          data={loginStats}
          color="#C5975C"
          gradientId="loginStats"
        />
      </div>

      {/* Distribution et répartition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PieChartCard
          title="Répartition par rôle"
          subtitle="Distribution des utilisateurs"
          data={roleDistribution}
          height={280}
        />
        <PieChartCard
          title="Classes par niveau"
          subtitle="Distribution des classes"
          data={classesByLevel}
          height={280}
        />
        <BarChartCard
          title="Activités par bloc"
          subtitle="Nombre d'activités par compétence"
          data={activityByBloc}
          color="#4A5D3F"
          height={280}
        />
      </div>

      {/* Quiz stats */}
      <LineChartCard
        title="Statistiques des quiz"
        subtitle="Complétions et scores moyens au fil du temps"
        data={quizStats}
        series={[
          { dataKey: "completions", color: "#6B1F3D", name: "Complétions" },
          { dataKey: "averageScore", color: "#4A5D3F", name: "Score moyen (%)" },
        ]}
        height={320}
      />

      {/* Établissements par région */}
      <BarChartCard
        title="Établissements par région"
        subtitle="Top 10 des régions"
        data={establishmentsByRegion}
        layout="vertical"
        color="#C5975C"
        height={400}
        showColors
      />

      {/* Stats de contenu détaillées */}
      <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6">
        <h3 className="text-lg font-semibold text-gris-dark mb-4">
          Contenu de la plateforme
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-beige/50 rounded-lg">
            <p className="text-2xl font-bold text-bordeaux">{contentStats.wines}</p>
            <p className="text-sm text-gris-tech">Vins</p>
          </div>
          <div className="text-center p-4 bg-beige/50 rounded-lg">
            <p className="text-2xl font-bold text-or">{contentStats.grapes}</p>
            <p className="text-sm text-gris-tech">Cépages</p>
          </div>
          <div className="text-center p-4 bg-beige/50 rounded-lg">
            <p className="text-2xl font-bold text-vert">{contentStats.appellations}</p>
            <p className="text-sm text-gris-tech">Appellations</p>
          </div>
          <div className="text-center p-4 bg-beige/50 rounded-lg">
            <p className="text-2xl font-bold text-info">{contentStats.glossaryTerms}</p>
            <p className="text-sm text-gris-tech">Termes glossaire</p>
          </div>
          <div className="text-center p-4 bg-beige/50 rounded-lg">
            <p className="text-2xl font-bold text-bordeaux-light">{contentStats.quizzes}</p>
            <p className="text-sm text-gris-tech">Quiz</p>
          </div>
          <div className="text-center p-4 bg-beige/50 rounded-lg">
            <p className="text-2xl font-bold text-gris-dark">{contentStats.questions}</p>
            <p className="text-sm text-gris-tech">Questions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
