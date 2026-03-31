"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface BarChartCardProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  dataKey?: string;
  color?: string;
  height?: number;
  layout?: "horizontal" | "vertical";
  showColors?: boolean;
}

const DEFAULT_COLORS = [
  "#6B1F3D", // bordeaux
  "#C5975C", // or
  "#4A5D3F", // vert
  "#3B82F6", // info
  "#8B2F4D", // bordeaux-light
  "#D4A574", // or-light
  "#5E7350", // vert-light
  "#60A5FA", // info-light
];

export function BarChartCard({
  title,
  subtitle,
  data,
  dataKey = "value",
  color = "#6B1F3D",
  height = 300,
  layout = "horizontal",
  showColors = false,
}: BarChartCardProps) {
  const isVertical = layout === "vertical";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gris-dark">{title}</h3>
        {subtitle && <p className="text-sm text-gris-tech">{subtitle}</p>}
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout={isVertical ? "vertical" : "horizontal"}
            margin={{
              top: 10,
              right: 10,
              left: isVertical ? 80 : 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" />
            {isVertical ? (
              <>
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#566573", fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#566573", fontSize: 12 }}
                  width={75}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#566573", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#566573", fontSize: 12 }}
                />
              </>
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E8E0D0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: "#566573", fontWeight: 600 }}
              cursor={{ fill: "rgba(107, 31, 61, 0.1)" }}
            />
            <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
              {showColors
                ? data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                    />
                  ))
                : data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
