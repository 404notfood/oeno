"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DataPoint {
  name: string;
  [key: string]: string | number;
}

interface LineSeries {
  dataKey: string;
  color: string;
  name?: string;
}

interface LineChartCardProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  series: LineSeries[];
  height?: number;
  showLegend?: boolean;
}

export function LineChartCard({
  title,
  subtitle,
  data,
  series,
  height = 300,
  showLegend = true,
}: LineChartCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-beige-dark p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gris-dark">{title}</h3>
        {subtitle && <p className="text-sm text-gris-tech">{subtitle}</p>}
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" />
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
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E8E0D0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: "#566573", fontWeight: 600 }}
            />
            {showLegend && (
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => (
                  <span style={{ color: "#566573", fontSize: 12 }}>{value}</span>
                )}
              />
            )}
            {series.map((s) => (
              <Line
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                stroke={s.color}
                strokeWidth={2}
                dot={{ fill: s.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
