import React, { useState } from "react";
import {
  LayoutDashboard,
  Image as GalleryIcon,
  CalendarDays,
  Mail,
  FileText,
  Settings,
  Landmark,
  ClipboardList,
  Bell,
  Search,
  LogOut,
  UtensilsCrossed,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import VenueView from "@/components/VenueView";

// View Components (for demo)
const DashboardView = () => (
  <div>
    <h2 className="text-2xl font-bold text-slate-900 mb-2">
      Dashboard Overview
    </h2>
    <p className="text-slate-600">
      Overview of analytics, stats, and quick summaries.
    </p>
  </div>
);

const MenuView = () => (
  <div>
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Menu Management</h2>
    <p className="text-slate-600">Add, edit or remove menu items.</p>
  </div>
);

const GalleryView = () => (
  <div>
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Gallery</h2>
    <p className="text-slate-600">Manage event or venue photos.</p>
  </div>
);

const EventsView = () => (
  <div>
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Event Scheduling</h2>
    <p className="text-slate-600">Create or update upcoming events.</p>
  </div>
);

const InquiriesView = () => (
  <div>
    <h2 className="text-2xl font-bold text-slate-900 mb-2">
      Customer Inquiries
    </h2>
    <p className="text-slate-600">Review and respond to user inquiries.</p>
  </div>
);

const EmailConfigView = () => (
  <div>
    <h2 className="text-2xl font-bold text-slate-900 mb-2">
      Email Configuration
    </h2>
    <p className="text-slate-600">Manage email settings and SMTP configs.</p>
  </div>
);

const Dashboard = ({ userRole, onLogout }) => {
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", key: "Dashboard" },
    { icon: Landmark, label: "Venue", key: "Venue" },
    { icon: UtensilsCrossed, label: "Menu", key: "Menu" },
    { icon: GalleryIcon, label: "Gallery", key: "Gallery" },
    { icon: CalendarDays, label: "Events", key: "Events" },
    { icon: ClipboardList, label: "Inquiries", key: "Inquiries" },
    { icon: Mail, label: "Email Config", key: "EmailConfig" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Admin Panel</h1>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedTab(item.key)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                selectedTab === item.key
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search..."
                className="pl-10 w-80 bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                    {userRole === "admin" ? "AD" : "ED"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-slate-900 capitalize">
                    {userRole}
                  </p>
                  <p className="text-slate-500">Online</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-slate-600 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 p-6 space-y-6">
          {selectedTab === "Dashboard" && <DashboardView />}
          {selectedTab === "Venue" && <VenueView />}
          {selectedTab === "Menu" && <MenuView />}
          {selectedTab === "Gallery" && <GalleryView />}
          {selectedTab === "Events" && <EventsView />}
          {selectedTab === "Inquiries" && <InquiriesView />}
          {selectedTab === "EmailConfig" && <EmailConfigView />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
