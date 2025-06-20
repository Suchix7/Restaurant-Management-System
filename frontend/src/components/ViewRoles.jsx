import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import features from "@/lib/features.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ViewRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [editedData, setEditedData] = useState({
    role: "",
    password: "",
    permissions: [],
  });

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/roles");
      setRoles(res.data);
    } catch (error) {
      toast.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEditClick = (role) => {
    setEditRole(role);
    setEditedData({
      role: role.role,
      password: role.password,
      permissions: role.permissions || [],
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await axiosInstance.put(
        `admin/role/${editRole._id}`,
        editedData
      );
      toast.success(res.data.message);
      setEditRole(null);
      fetchRoles();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await axiosInstance.delete(`/role/${id}`);
      toast.success("Role deleted successfully");
      fetchRoles();
    } catch (error) {
      toast.error("Failed to delete role");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Role Management
      </h2>
      <p className="text-slate-600 mb-6">View and Update Roles</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Password</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, index) => (
              <tr key={role._id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{role.role}</td>
                <td className="border px-4 py-2">{role.password}</td>
                <td className="border px-4 py-2 space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleEditClick(role)}
                    className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(role._id)}
                    className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      <Dialog open={!!editRole} onOpenChange={() => setEditRole(null)}>
        <DialogContent className="bg-white h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              type="text"
              placeholder="Role"
              value={editedData.role}
              onChange={(e) =>
                setEditedData({ ...editedData, role: e.target.value })
              }
            />
            <Input
              type="text"
              placeholder="Password"
              value={editedData.password}
              onChange={(e) =>
                setEditedData({ ...editedData, password: e.target.value })
              }
            />
            <label className="block font-medium">Permissions</label>
            <div className="space-y-2">
              {features.map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editedData.permissions.includes(feature)}
                    onChange={() => {
                      const updated = editedData.permissions.includes(feature)
                        ? editedData.permissions.filter((f) => f !== feature)
                        : [...editedData.permissions, feature];
                      setEditedData({ ...editedData, permissions: updated });
                    }}
                  />
                  <span>{feature.replaceAll("_", " ")}</span>
                </label>
              ))}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              onClick={handleUpdate}
              className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewRoles;
