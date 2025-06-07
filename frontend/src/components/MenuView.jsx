import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-hot-toast";

const MenuView = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editImage, setEditImage] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axiosInstance.get("/menu");
      setMenuItems(res.data || []);
    } catch (error) {
      console.error("Failed to fetch menu:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirm) return;

    try {
      await axiosInstance.delete(`/menu/${id}`);
      toast.success("Menu item deleted.");
      fetchMenu();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete menu item.");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditCategory(item.category);
    setEditImage(null);
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    const formData = new FormData();
    formData.append("category", editCategory);
    if (editImage) {
      formData.append("menu-image", editImage);
    }

    try {
      await axiosInstance.put(`/menu/${editingItem._id}`, formData);
      toast.success("Menu updated.");
      setEditingItem(null);
      setEditCategory("");
      setEditImage(null);
      fetchMenu();
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Menu Management</h2>
      <p className="text-slate-600">
        View and manage your menu categories below.
      </p>

      {menuItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="border rounded shadow-sm overflow-hidden bg-white relative group"
            >
              <img
                src={item.imageUrl}
                alt={item.category}
                onClick={() => setSelectedImage(item.imageUrl)}
                className="w-full h-100 object-cover cursor-pointer transition hover:brightness-90"
              />
              <div className="p-3 text-center">
                <h3 className="text-sm font-medium text-slate-800">
                  {item.category}
                </h3>
              </div>
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-400 text-black text-xs px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 text-white text-xs px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500">No menu items found.</p>
      )}

      {/* Fullscreen Image Viewer */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
        >
          <img
            src={selectedImage}
            alt="Full view"
            className="max-h-full max-w-full object-contain cursor-pointer"
          />
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md space-y-4 w-full max-w-sm">
            <h3 className="text-lg font-semibold">Edit Menu Item</h3>
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Category"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditImage(e.target.files[0])}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuView;
