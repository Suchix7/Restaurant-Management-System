import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { ReactSortable } from "react-sortablejs";

const ManageGallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryImages, setCategoryImages] = useState([]);
  const [numImages, setNumImages] = useState(0);
  const [newFiles, setNewFiles] = useState([]);

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
        data: { category: selectedCategory, public_id },
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
      `Are you sure you want to delete "${selectedCategory}" gallery?`
    );
    if (!confirm) return;

    try {
      await axiosInstance.delete("/gallery", {
        data: { category: selectedCategory },
      });
      toast.success("Gallery deleted.");
      setSelectedCategory("");
      setCategoryImages([]);
      fetchGalleries();
    } catch (error) {
      console.error("Error deleting gallery:", error);
      toast.error("Failed to delete gallery.");
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Manage Gallery
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Select + Delete */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-1/2 border border-slate-300 rounded px-3 py-2"
          >
            <option value="">Select Category</option>
            {uniqueCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          {selectedCategory && (
            <Button variant="destructive" onClick={handleDeleteGallery}>
              Delete Gallery
            </Button>
          )}
        </div>

        {/* Existing Images */}

        {selectedCategory &&
          (categoryImages.length > 0 ? (
            <>
              <ReactSortable
                list={categoryImages}
                setList={setCategoryImages}
                tag="div"
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {categoryImages.map((img, idx) => (
                  <div
                    key={img.public_id}
                    className="relative group border rounded overflow-hidden"
                    data-id={img.public_id}
                  >
                    <img
                      src={img.url}
                      alt={`img-${idx}`}
                      className="w-full h-72 object-cover"
                    />
                    <button
                      onClick={() => handleDeleteImage(img.public_id)}
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </ReactSortable>

              <Button
                onClick={async () => {
                  try {
                    await axiosInstance.put("/gallery/reorder", {
                      category: selectedCategory,
                      images: categoryImages,
                    });
                    toast.success("Image order saved.");
                    fetchGalleries();
                  } catch (err) {
                    console.error(err);
                    toast.error("Failed to save image order.");
                  }
                }}
                className="mt-4"
                variant="outline"
              >
                Save Order
              </Button>
            </>
          ) : (
            <p className="text-sm text-slate-500 italic">
              No images in this category.
            </p>
          ))}

        {/* Upload New Images */}
        {selectedCategory && (
          <div className="space-y-3">
            <Input
              type="number"
              placeholder="Number of images"
              min="1"
              value={numImages}
              onChange={handleNumImagesChange}
              className="w-full md:w-1/3"
            />

            {newFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {newFiles.map((fileObj, index) => (
                  <div
                    key={index}
                    className="relative group h-72 border rounded bg-slate-100 flex items-center justify-center overflow-hidden"
                  >
                    <label className="w-full h-full flex items-center justify-center cursor-pointer">
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
                    <button
                      type="button"
                      onClick={() =>
                        setNewFiles(newFiles.filter((_, i) => i !== index))
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
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
                  className="h-72 w-full border border-dashed rounded text-slate-400 hover:text-slate-600 hover:border-slate-400 text-4xl font-bold flex items-center justify-center"
                >
                  +
                </button>
              </div>
            )}

            <Button onClick={handleAddImages} className="mt-2">
              Add Images
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ManageGallery;
