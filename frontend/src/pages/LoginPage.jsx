import React, { useState, useEffect } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axiosInstance from "@/lib/axiosInstance.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/roles");
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to load roles");
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role || !password) return;

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", {
        role,
        password,
      });

      const { token, role: userRole, id } = response.data;

      // Store auth data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("userId", id);

      toast.success("Login successful!");
      navigate("/dashboard", { state: { id } });
    } catch (error) {
      console.error("Login error:", error);
      const msg =
        error?.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[#2D6A4F]/5 bg-[radial-gradient(#2D6A4F_1px,transparent_1px)] [background-size:16px_16px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-gray-200 bg-white/95 backdrop-blur-sm shadow-xl">
          <CardHeader className="space-y-1 pb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-4"
            >
              <div className="w-12 h-12 bg-[#2D6A4F] rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Role
                </label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="bg-white border-gray-200 text-gray-900 focus:border-[#2D6A4F] focus:ring-[#2D6A4F]/20">
                    {loading ? (
                      <SelectValue placeholder="Loading..." />
                    ) : (
                      <SelectValue placeholder="Select your role" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {roles.length > 0 &&
                      roles.map((r) => (
                        <SelectItem
                          value={r.role}
                          key={r.role}
                          className="text-gray-900 hover:bg-[#2D6A4F]/10"
                        >
                          {r.role}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password:
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-[#2D6A4F] focus:ring-[#2D6A4F]/20 pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!role || !password || isLoading}
                className="w-full bg-[#2D6A4F] hover:bg-[#235c41] text-white font-medium py-2.5 mt-6 transition-all duration-200 disabled:opacity-50 disabled:hover:bg-[#2D6A4F]"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    SignIn
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
