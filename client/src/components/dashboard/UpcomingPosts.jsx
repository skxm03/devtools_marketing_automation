import React from "react";
import { Calendar, Clock, MoreHorizontal } from "lucide-react";

const defaultPosts = [
  {
    id: "1",
    title: "Black Friday Campaign Launch",
    scheduledTime: "10:00 AM",
    scheduledDate: "Nov 28, 2025",
    status: "scheduled",
    thumbnail:
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "2",
    title: "New Product Announcement",
    scheduledTime: "2:30 PM",
    scheduledDate: "Nov 25, 2025",
    status: "scheduled",
    thumbnail:
      "https://images.pexels.com/photos/3183151/pexels-photo-3183151.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "3",
    title: "Customer Success Stories",
    scheduledTime: "9:00 AM",
    scheduledDate: "Nov 24, 2025",
    status: "pending",
    thumbnail:
      "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

const statusStyles = {
  scheduled: {
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  draft: {
    badge: "bg-gray-100 text-gray-700",
    dot: "bg-gray-500",
  },
  pending: {
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
};

export default function UpcomingPosts({ posts = defaultPosts }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 -mt-82 w-335">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <Calendar size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Upcoming Posts</h3>
            <p className="text-xs text-gray-500">{posts.length} scheduled</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 animate-slideIn border border-transparent hover:border-gray-200"
            style={{ animationDelay: `${(index + 3) * 100}ms` }}
          >
            {post.thumbnail && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 shadow-sm">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full ${
                    statusStyles[post.status].dot
                  }`}
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate text-sm">
                {post.title}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar size={14} />
                  {post.scheduledDate}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={14} />
                  {post.scheduledTime}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusStyles[post.status].badge
                }`}
              >
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </span>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              >
                <MoreHorizontal size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="w-full mt-4 py-2 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-150 text-sm"
      >
        View All Scheduled Posts
      </button>
    </div>
  );
}
