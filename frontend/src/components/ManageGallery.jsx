import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const ManageGallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryImages, setCategoryImages] = useState([]);
  const [numImages, setNumImages] = useState(0);
  const [newFiles, setNewFiles] = useState([]); // [{ file, preview }]

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const res = await axiosInstance.get("/gallery");
      setGalleries(res.data || []);
    } catch (error) {
      console.error("Error fetching galleries:", error);
      toast.error("Failed to load gallery data.");
    }
  };

  useEffect(() => {
    const gallery = galleries.find((g) => g.category === selectedCategory);
    setCategoryImages(gallery?.images || []);
  }, [selectedCategory, galleries]);

  const uniqueCategories = [...new Set(galleries.map((g) => g.category))];

  const handleDeleteImage = async (public_id) => {
    try {
      await axiosInstance.delete("/gallery/image", {
        data: {
          category: selectedCategory,
          public_id,
        },
      });

      toast.success("Image deleted!");
      fetchGalleries();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image.");
    }
  };

  const handleAddImages = async () => {
    if (
      !selectedCategory ||
      newFiles.length === 0 ||
      newFiles.some((f) => !f.file)
    ) {
      toast.error("Please select a category and upload all images.");
      return;
    }

    const formData = new FormData();
    formData.append("category", selectedCategory);
    newFiles.forEach(({ file }) => formData.append("images", file));

    try {
      await axiosInstance.put("/gallery", formData);
      toast.success("Images added!");
      setNewFiles([]);
      setNumImages(0);
      fetchGalleries();
    } catch (error) {
      console.error("Error uploading images:", error?.response?.data || error);
      toast.error("Failed to upload images.");
    }
  };

  const handleImageChange = (index, file) => {
    const updatedFiles = [...newFiles];
    const preview = URL.createObjectURL(file);
    updatedFiles[index] = { file, preview };
    setNewFiles(updatedFiles);
  };

  const handleNumImagesChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setNumImages(count);
    setNewFiles(Array(count).fill({ file: null, preview: null }));
  };

  const handleDeleteGallery = async () => {
    const confirm = window.confirm(
      `Are you sure you want to delete the entire gallery for category "${selectedCategory}"?`
    );
    if (!confirm) return;

    try {
      await axiosInstance.delete("/gallery", {
        data: { category: selectedCategory },
      });
      toast.success("Gallery deleted successfully.");
      setSelectedCategory("");
      setCategoryImages([]);
      fetchGalleries();
    } catch (error) {
      console.error("Error deleting gallery:", error);
      toast.error("Failed to delete gallery.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Gallery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Select Category */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full border border-slate-300 rounded px-3 py-2"
        >
          <option value="">Select Category</option>
          {uniqueCategories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        {selectedCategory && (
          <Button
            variant="destructive"
            onClick={handleDeleteGallery}
            className="mt-2 text-black"
          >
            Delete Entire Gallery
          </Button>
        )}

        {/* Existing Images */}
        {categoryImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoryImages.map((img, idx) => (
              <div
                key={idx}
                className="relative border rounded overflow-hidden group"
              >
                <img
                  src={img.url}
                  alt={`img-${idx}`}
                  className="object-cover w-full h-80"
                />
                <button
                  onClick={() => handleDeleteImage(img.public_id)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : selectedCategory ? (
          <p className="text-slate-500">No images in this category.</p>
        ) : (
          <p className="text-slate-500">Please select a category to manage.</p>
        )}

        {/* Number of Images Input */}
        <Input
          type="number"
          placeholder="Number of images"
          min="1"
          value={numImages}
          onChange={handleNumImagesChange}
        />

        {/* Upload Boxes with Preview */}
        {newFiles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newFiles.map((fileObj, index) => (
              <div
                key={index}
                className="relative border h-80 w-full rounded bg-slate-100 flex items-center justify-center overflow-hidden group"
              >
                <label className="w-full h-full cursor-pointer flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      handleImageChange(index, e.target.files[0])
                    }
                  />
                  {fileObj.preview ? (
                    <img
                      src={fileObj.preview}
                      alt={`preview-${index}`}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-sm text-slate-500">
                      Click to upload
                    </span>
                  )}
                </label>

                {/* ❌ Delete Button */}
                <button
                  type="button"
                  onClick={() =>
                    setNewFiles(newFiles.filter((_, i) => i !== index))
                  }
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
              </div>
            ))}

            {/* ➕ Add Box */}
            <button
              type="button"
              onClick={() =>
                setNewFiles([...newFiles, { file: null, preview: null }])
              }
              className="h-80 w-full border border-dashed rounded text-slate-400 hover:text-slate-600 hover:border-slate-400 text-4xl font-bold flex items-center justify-center"
            >
              +
            </button>
          </div>
        )}

        <Button onClick={handleAddImages}>Add Images</Button>
      </CardContent>
    </Card>
  );
};

export default ManageGallery;
