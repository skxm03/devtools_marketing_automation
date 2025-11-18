import React from "react";
import { TrendingUp } from "lucide-react";

const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
  },
  rose: {
    bg: "bg-rose-50",
    icon: "text-rose-600",
    badge: "bg-rose-100 text-rose-700",
  },
};

const StatsCard = () => {
  // ✅ FIX 1: Define the stats array
  const stats = [
    {
      id: "1",
      label: "Total Posts",
      value: 128,
      trend: 12,
      color: "blue",
      icon: <TrendingUp size={20} />,
    },
    {
      id: "2",
      label: "Scheduled",
      value: 34,
      trend: 5,
      color: "emerald",
      icon: <TrendingUp size={20} />,
    },
    {
      id: "3",
      label: "Drafts",
      value: 12,
      trend: -2,
      color: "amber",
      icon: <TrendingUp size={20} />,
    },
    {
      id: "4",
      label: "Deleted",
      value: 8,
      trend: -1,
      color: "rose",
      icon: <TrendingUp size={20} />,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className={`${
              colorClasses[stat.color].bg
            } border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${colorClasses[stat.color].bg}`}>
                <div className={colorClasses[stat.color].icon}>{stat.icon}</div>
              </div>

              {stat.trend !== undefined && (
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                    colorClasses[stat.color].badge
                  }`}
                >
                  <TrendingUp size={14} />
                  <span className="text-xs font-semibold">
                    {stat.trend > 0 ? "+" : ""}
                    {stat.trend}%
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4">
              <p className="text-gray-600 text-sm font-medium mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default StatsCard;
