import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  PenSquare,
  FileText,
  Layout,
} from "lucide-react";
import { Outlet } from "react-router-dom";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Create Post", icon: PenSquare, path: "/create" },
    { name: "Posts List", icon: FileText, path: "/posts" },
    { name: "Templates", icon: Layout, path: "/templates" },
  ];

  return (
    <>
      <nav className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-50">
        <div className="sm:px-6 lg:px-8">
          <div className="flex items-center justify-start h-16">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10 rounded-xl p-1.5">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.name;

                return (
                  <Link
                    key={section.name}
                    to={section.path}
                    onClick={() => setActiveSection(section.name)}
                    className={`px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    <Icon size={18} />
                    {section.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 pt-2">
              <div className="flex flex-col gap-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.name;

                  return (
                    <Link
                      key={section.name}
                      to={section.path}
                      onClick={() => {
                        setActiveSection(section.name);
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-3 rounded-xl text-left flex items-center gap-2 transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-blue-100"
                      }`}
                    >
                      <Icon size={18} />
                      {section.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      <Outlet />
    </>
  );
}
