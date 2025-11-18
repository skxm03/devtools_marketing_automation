// ...existing code...
import React from "react";
import { Activity, PenSquare, FileText, Layout, Clock } from "lucide-react";
import { Outlet } from "react-router-dom";

const defaultActivities = [
  {
    id: 1,
    title: 'Scheduled "October Promo" post',
    time: "2 hours ago",
    icon: PenSquare,
  },
  {
    id: 2,
    title: 'Template "Launch" created',
    time: "Yesterday",
    icon: Layout,
  },
  {
    id: 3,
    title: 'Post "Welcome" published',
    time: "3 days ago",
    icon: FileText,
  },
];

export default function RecentActivity({ activities = defaultActivities }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 w-100 ml-340">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Activity size={18} className="text-gray-600" />
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {activities.map((act) => {
          const Icon = act.icon || Clock;
          return (
            <button
              key={act.id}
              type="button"
              className="w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors duration-150 hover:bg-gray-50"
            >
              <div className="shrink-0 pt-0.5">
                <Icon size={18} className="text-blue-500" />
              </div>

              <div className="min-w-0">
                <div className="font-semibold text-gray-900 truncate">
                  {act.title}
                </div>
                <div className="text-sm text-gray-500 mt-1">{act.time}</div>
              </div>
            </button>
          );
        })}
      </div>
      <Outlet />
    </div>
  );
}
//
