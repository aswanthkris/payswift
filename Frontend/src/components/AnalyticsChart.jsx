import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Card } from "./Card";

export const AnalyticsChart = ({ data, type = "income-expense" }) => {
  if (!data) return null;

  if (type === "income-expense") {
    const chartData = [
      { name: "Income", amount: data.income, fill: "#16a34a" },
      { name: "Expense", amount: data.expense, fill: "#dc2626" },
    ];

    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Monthly Overview
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                formatter={(value) => [`₹${value}`, "Amount"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  }

  if (type === "trend") {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Spending Trend (Last 7 Days)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.trend}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickFormatter={(str) => {
                  const date = new Date(str);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                formatter={(value) => [`₹${value}`, "Spent"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#16a34a"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  }

  return null;
};
