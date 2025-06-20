import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { ReactSortable } from "react-sortablejs";
import { Loader } from "lucide-react";

const ManageGallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryImages, setCategoryImages] = useState([]);
  const [numImages, setNumImages] = useState(0);
  const [newFiles, setNewFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [newMainImage, setNewMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingMainImage, setIsEditingMainImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const res = await axiosInstance.get("/gallery");
      setGalleries(res.data || []);
    } catch (error) {
      toast.error("Failed to load gallery data.");
    }
  };

  useEffect(() => {
    const gallery = galleries.find((g) => g.category === selectedCategory);
    if (gallery) {
      setCategoryImages(gallery.images || []);
      setDescription(gallery.description || "");
      setMainImage(gallery.mainImage || null);
      setNewMainImage(null);
      setMainPreview(null);
      setIsEditingDescription(false);
      setIsEditingMainImage(false);
    } else {
      setCategoryImages([]);
      setDescription("");
      setMainImage(null);
    }
  }, [selectedCategory, galleries]);

  const uniqueCategories = [...new Set(galleries.map((g) => g.category))];

  const handleDeleteImage = async (public_id) => {
    try {
      await axiosInstance.delete("/gallery/image", {
        data: { category: selectedCategory, public_id },
      });
      toast.success("Image deleted!");
      fetchGalleries();
    } catch {
      toast.error("Failed to delete image.");
    }
  };

  const handleAddImages = async () => {
    setLoading(true);
    if (
      !selectedCategory ||
      newFiles.length === 0 ||
      newFiles.some((f) => !f.file)
    ) {
      toast.error("Please upload all new images.");
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
      setLoading(false);
    } catch {
      toast.error("Failed to upload images.");
      setLoading(false);
    }
  };

  const handleNumImagesChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setNumImages(count);
    setNewFiles(Array(count).fill({ file: null, preview: null }));
  };

  const handleImageChange = (index, file) => {
    const updated = [...newFiles];
    const preview = URL.createObjectURL(file);
    updated[index] = { file, preview };
    setNewFiles(updated);
  };

  const handleMainImageChange = (file) => {
    setNewMainImage(file);
    setMainPreview(URL.createObjectURL(file));
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
      fetchGalleries();
    } catch {
      toast.error("Failed to delete gallery.");
    }
  };

  const handleSaveMetadata = async () => {
    const formData = new FormData();
    formData.append("category", selectedCategory);
    formData.append("description", description);
    if (newMainImage) {
      formData.append("mainImage", newMainImage);
    }

    try {
      await axiosInstance.put("/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Gallery updated!");
      fetchGalleries();
    } catch {
      toast.error("Failed to update gallery.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Manage Gallery</h2>
      <p className="text-slate-600 mb-6">
        Update category, description, main image and the whole gallery.
      </p>

      <Card className="bg-white shadow-sm">
        <CardContent className="space-y-6">
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

          {selectedCategory && (
            <>
              <div className="space-y-2">
                {isEditingDescription ? (
                  <>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Gallery Description"
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveMetadata}
                        className="bg-yellow-400"
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setIsEditingDescription(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-slate-700">
                      {description || "No description added."}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setIsEditingDescription(true)}
                      className="bg-yellow-300"
                    >
                      Edit Description
                    </Button>
                  </div>
                )}
              </div>

              {mainImage && (
                <div className="space-y-2">
                  <div className="relative w-72 h-72 border rounded overflow-hidden">
                    <img
                      src={mainPreview || mainImage.imageUrl}
                      alt="Main"
                      className="object-cover w-full h-full"
                    />

                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => handleMainImageChange(e.target.files[0])}
                      className="hidden"
                    />
                  </div>

                  <div className="flex gap-2">
                    {!isEditingMainImage && (
                      <Button
                        onClick={() => {
                          fileInputRef.current?.click();
                          setIsEditingMainImage(true);
                        }}
                        className="bg-yellow-300"
                      >
                        Edit Main Image
                      </Button>
                    )}

                    {isEditingMainImage && (
                      <>
                        <Button
                          onClick={handleSaveMetadata}
                          className="bg-yellow-400"
                        >
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setIsEditingMainImage(false);
                            setNewMainImage(null);
                            setMainPreview(null);
                          }}
                          className="bg-red-500"
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

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
                    } catch {
                      toast.error("Failed to save image order.");
                    }
                  }}
                  className="bg-yellow-400"
                >
                  Save Order
                </Button>
              </>
            ) : (
              <p className="text-sm italic text-slate-500">
                No images in this category.
              </p>
            ))}

          {selectedCategory && (
            <>
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
              {loading ? (
                <Button onClick={handleAddImages} className="bg-blue-500">
                  <Loader className="animate-spin" />
                  Add Images
                </Button>
              ) : (
                <Button onClick={handleAddImages} className="bg-blue-500">
                  Add Images
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageGallery;
