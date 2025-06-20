import React, { useState, useEffect } from "react";
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
  User,
  User2,
  MessageCircle,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance.js";
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
import Gallery from "@/components/GalleryAdmin";
import ManageGallery from "@/components/ManageGallery";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddMenu from "@/components/AddMenu";
import MenuView from "@/components/MenuView";
import InquiriesView from "@/components/InquiriesView";
import AddGalleryView from "@/components/AddGalleryView";
import EventsView from "@/components/EventsView";
import AddEvents from "@/components/AddEvents";
import AddRole from "@/components/AddRole";
import ViewRoles from "@/components/ViewRoles";
import MainGallery from "@/components/MainGallery";
import MailConfigForm from "@/components/MailConfigForm";

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

const Dashboard = ({ userRole }) => {
  const location = useLocation();
  const id = location.state?.id;
  const [role, setRole] = useState({ permissions: [] });

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axiosInstance.get(`/role/${id}`);
        setRole(response.data);
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    fetchRole();
  }, []);

  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuthentication() {
      try {
        await axiosInstance.get("/auth/check");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        toast.error("You need to log in first.");
        navigate("/login");
      }
    }
    checkAuthentication();
  }, []);

  const allSidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", key: "Dashboard" },
    { icon: Landmark, label: "Venue", key: "Venue" },
    { icon: FileText, label: "Add Menu", key: "AddMenu" },
    { icon: UtensilsCrossed, label: "Menu", key: "Menu" },
    { icon: GalleryIcon, label: "Main Gallery", key: "MainGallery" },
    { icon: GalleryIcon, label: "Gallery", key: "Gallery" },
    { icon: GalleryIcon, label: "Add Gallery", key: "AddGallery" },
    { icon: FileText, label: "Manage Gallery", key: "ManageGallery" },
    { icon: FileText, label: "Add Events", key: "AddEvents" },
    { icon: CalendarDays, label: "Events", key: "Events" },
    { icon: ClipboardList, label: "Inquiries", key: "Inquiries" },
    { icon: Mail, label: "Email Config", key: "EmailConfig" },
    { icon: User, label: "Add Role", key: "AddRole" },
    { icon: User2, label: "View Roles", key: "ViewRoles" },
  ];

  const sidebarItems = allSidebarItems.filter((item) =>
    role.permissions.includes(item.key)
  );

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      navigate("/login");
      toast.success("Logout successful!");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    isAuthenticated && (
      <div className="min-h-screen bg-slate-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 shadow-sm fixed h-screen overflow-y-auto hide-scrollbar">
          <div className="px-6 py-4 border-b border-slate-200">
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
                  selectedTab === item?.key
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item?.icon && <item.icon className="w-5 h-5" />}
                <span className="font-medium">{item?.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-64">
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
                  onClick={handleLogout}
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
            {selectedTab === "AddMenu" && <AddMenu />}
            {selectedTab === "Menu" && <MenuView />}
            {selectedTab === "MainGallery" && <MainGallery />}
            {selectedTab === "Gallery" && <Gallery />}
            {selectedTab === "AddGallery" && <AddGalleryView />}
            {selectedTab === "ManageGallery" && <ManageGallery />}
            {selectedTab === "AddEvents" && <AddEvents />}
            {selectedTab === "Events" && <EventsView />}
            {selectedTab === "Inquiries" && <InquiriesView />}
            {selectedTab === "EmailConfig" && <MailConfigForm />}
            {selectedTab === "AddRole" && <AddRole />}
            {selectedTab === "ViewRoles" && <ViewRoles />}
          </main>
        </div>
      </div>
    )
  );
};

export default Dashboard;
