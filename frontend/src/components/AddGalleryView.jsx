import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";

const AddGalleryView = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (index, file) => {
    const updated = [...images];
    updated[index] = {
      file,
      preview: URL.createObjectURL(file),
    };
    setImages(updated);
  };

  const addImageBox = () => {
    setImages([...images, { file: null, preview: null }]);
  };

  const removeImageBox = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleMainImageChange = (file) => {
    setMainImage(file);
    setMainPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !category ||
      !description ||
      !mainImage ||
      images.some((img) => !img.file)
    ) {
      toast.error("Please fill all fields and upload required images.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("category", category);
    formData.append("description", description);
    formData.append("mainImage", mainImage);
    images.forEach((img) => formData.append("images", img.file));

    try {
      await axiosInstance.post("/gallery", formData);
      toast.success("Gallery uploaded!");
      setCategory("");
      setDescription("");
      setMainImage(null);
      setMainPreview(null);
      setImages([]);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.");
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Gallery</CardTitle>
        <CardDescription>
          Add a main image and supporting gallery images.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Main Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Main Image</label>
            <div className="relative border rounded w-full aspect-square flex items-center justify-center bg-slate-100 overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleMainImageChange(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {mainPreview ? (
                <img
                  src={mainPreview}
                  alt="Main Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-sm text-slate-500">Click to upload</span>
              )}
            </div>
          </div>

          {/* Supporting Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative group border rounded overflow-hidden h-48 bg-slate-100"
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
                  {img.preview ? (
                    <img
                      src={img.preview}
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
                  onClick={() => removeImageBox(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addImageBox}
              className="h-48 border border-dashed rounded flex items-center justify-center text-4xl font-bold text-slate-400 hover:text-slate-600 hover:border-slate-400"
            >
              +
            </button>
          </div>

          {loading ? (
            <>
              <Button disabled>
                <Loader className="animate-spin mr-2" />
                Uploading...
              </Button>
            </>
          ) : (
            <Button
              type="submit"
              className="bg-blue-500 text-white cursor-pointer"
            >
              Upload Gallery
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AddGalleryView;
