import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
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
  const [editedData, setEditedData] = useState({ role: "", password: "" });

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
    setEditedData({ role: role.role, password: role.password });
  };

  const handleUpdate = async () => {
    try {
      const res = await axiosInstance.put(`/role/${editRole._id}`, editedData);
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
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Roles Management</h2>
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
                  <Button size="sm" onClick={() => handleEditClick(role)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(role._id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewRoles;
