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
  // Bell,
  LogOut,
  UtensilsCrossed,
  User,
  User2,
  Contact,
  MessageCircle,
  Menu,
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
import AddSpecials from "@/components/AddSpecials";
import Specials from "@/components/Specials";
import ContactSettings from "@/components/ManageContact";
import ManagePosts from "@/components/ManagePosts";

const Dashboard = ({ userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialId = location.state?.id || localStorage.getItem("userId");

  const [role, setRole] = useState({ permissions: [] });
  const [selectedTab, setSelectedTab] = useState("Venue");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch role/permissions
  useEffect(() => {
    if (!initialId) {
      toast.error("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    const fetchRole = async () => {
      try {
        const response = await axiosInstance.get(`/role/${initialId}`);
        setRole(response.data);
      } catch (error) {
        console.error("Error fetching role:", error);
        toast.error("Failed to load role permissions.");
      }
    };

    fetchRole();
  }, [initialId, navigate]);

  // Auth check
  useEffect(() => {
    async function checkAuthentication() {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        toast.error("You need to log in first.");
        navigate("/login");
        return;
      }

      try {
        await axiosInstance.get("/auth/check");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        toast.error("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        navigate("/login");
      }
    }

    checkAuthentication();
  }, [navigate]);

  const allSidebarItems = [
    { icon: Landmark, label: "Venue", key: "Venue" },
    { icon: FileText, label: "Add Menu", key: "AddMenu" },
    { icon: UtensilsCrossed, label: "Menu", key: "Menu" },
    { icon: GalleryIcon, label: "Main Gallery", key: "MainGallery" },
    { icon: GalleryIcon, label: "Gallery", key: "Gallery" },
    { icon: GalleryIcon, label: "Add Gallery", key: "AddGallery" },
    { icon: FileText, label: "Manage Gallery", key: "ManageGallery" },
    { icon: FileText, label: "Add Events", key: "AddEvents" },
    { icon: CalendarDays, label: "Events", key: "Events" },
    { icon: FileText, label: "Add Specials", key: "AddSpecials" },
    { icon: CalendarDays, label: "Specials", key: "Specials" },
    { icon: ClipboardList, label: "Inquiries", key: "Inquiries" },
    { icon: Mail, label: "Email Config", key: "EmailConfig" },
    { icon: User, label: "Add Role", key: "AddRole" },
    { icon: User2, label: "View Roles", key: "ViewRoles" },
    { icon: Contact, label: "Manage ContactUs", key: "ManageContactUs" },
    { icon: MessageCircle, label: "Manage Posts", key: "ManagePosts" },
  ];

  const sidebarItems = allSidebarItems.filter((item) =>
    role.permissions.includes(item.key)
  );

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout").catch(() => {});
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      toast.success("Logout successful!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    isAuthenticated && (
      <div className="min-h-screen bg-slate-50 flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 shadow-sm overflow-y-auto transform transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">Admin Panel</h1>
            </div>
            <button
              className="lg:hidden p-1 rounded-md hover:bg-slate-100"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedTab(item.key);
                  setSidebarOpen(false); // close on mobile
                }}
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
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-full max-w-xs sm:max-w-md bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div> */}
            </div>

            <div className="flex items-center space-x-4">
              {/* <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button> */}

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
                  {/* <p className="text-slate-500">Online</p> */}
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
          </header>

          {/* Content Section */}
          <main className="flex-1 p-6 space-y-6 overflow-auto">
            {selectedTab === "Venue" && <VenueView />}
            {selectedTab === "AddMenu" && <AddMenu />}
            {selectedTab === "Menu" && <MenuView />}
            {selectedTab === "MainGallery" && <MainGallery />}
            {selectedTab === "Gallery" && <Gallery />}
            {selectedTab === "AddGallery" && <AddGalleryView />}
            {selectedTab === "ManageGallery" && <ManageGallery />}
            {selectedTab === "AddEvents" && <AddEvents />}
            {selectedTab === "Events" && <EventsView />}
            {selectedTab === "AddSpecials" && <AddSpecials />}
            {selectedTab === "Specials" && <Specials />}
            {selectedTab === "Inquiries" && <InquiriesView />}
            {selectedTab === "EmailConfig" && <MailConfigForm />}
            {selectedTab === "AddRole" && <AddRole />}
            {selectedTab === "ViewRoles" && <ViewRoles />}
            {selectedTab === "ManageContactUs" && <ContactSettings />}
            {selectedTab === "ManagePosts" && <ManagePosts />}
          </main>
        </div>
      </div>
    )
  );
};

export default Dashboard;
