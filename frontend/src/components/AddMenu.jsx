import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";

const AddMenu = () => {
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!category || !file) {
      toast.error("Please enter a category and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("category", category);
    formData.append("menu-image", file);

    try {
      await axiosInstance.post("/menu", formData);
      toast.success("Menu item added!");
      setCategory("");
      setFile(null);
      setPreview(null);
      setLoading(false);
    } catch (err) {
      console.error("Error adding menu:", err);
      toast.error("Failed to add menu.");
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Menu Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <Input type="file" accept="image/*" onChange={handleFileChange} />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="h-80 w-full object-contain rounded border"
            />
          )}

          {loading ? (
            <Button type="submit">
              <Loader className="animate-spin" />
              Add Menu
            </Button>
          ) : (
            <Button type="submit">Add Menu</Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AddMenu;
