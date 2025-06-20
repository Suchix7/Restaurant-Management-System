import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import features from "@/lib/features.js";

const AddRole = () => {
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [editedData, setEditedData] = useState({
    permissions: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role || !password) {
      toast.error("Both role and password are required");
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.post("/role", {
        role,
        password,
        permissions: editedData.permissions,
      });
      toast.success(res.data.message);
      setRole("");
      setPassword("");
      setEditedData({ permissions: [] });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create role. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Add Role</h2>
      <p className="text-slate-600 mb-6">Create role and assign permissions</p>
      <div className="flex justify-center">
        <Card className="w-full max-w-sm shadow-md">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="block font-medium">Permissions</label>
              <div className="space-y-2">
                {features.map((feature) => (
                  <label key={feature} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editedData.permissions.includes(feature)}
                      onChange={(e) => {
                        const newPerms = editedData.permissions.includes(
                          feature
                        )
                          ? editedData.permissions.filter((f) => f !== feature)
                          : [...editedData.permissions, feature];
                        setEditedData({ ...editedData, permissions: newPerms });
                      }}
                    />
                    <span>{feature.replaceAll("_", " ")}</span>
                  </label>
                ))}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Role"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddRole;
