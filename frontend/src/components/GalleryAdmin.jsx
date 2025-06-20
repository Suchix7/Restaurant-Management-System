import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";

const GalleryAdmin = () => {
  const [galleries, setGalleries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredImages, setFilteredImages] = useState([]);
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    async function fetchGalleries() {
      try {
        const res = await axiosInstance.get("/gallery");
        setGalleries(res.data || []);
      } catch (error) {
        console.error("Error fetching galleries:", error);
        toast.error("Failed to load gallery");
      }
    }

    fetchGalleries();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const gallery = galleries.find((g) => g.category === selectedCategory);
      setFilteredImages(gallery?.images || []);
      setDescription(gallery?.description || "");
      setMainImage(gallery?.mainImage || null);
    } else {
      setFilteredImages([]);
      setDescription("");
      setMainImage(null);
    }
  }, [selectedCategory, galleries]);

  const uniqueCategories = [...new Set(galleries.map((g) => g.category))];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Gallery</h2>
      <p className="text-slate-600 mb-6">View the details of the gallery.</p>
      <Card>
        <CardContent className="space-y-4">
          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring"
          >
            <option value="">Select Category</option>
            {uniqueCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Description and Main Image */}
          {selectedCategory && (
            <>
              {description && (
                <>
                  <h2 className="text-xl font-semibold text-slate-800 mb-2">
                    Description:
                  </h2>
                  <p className="text-slate-700 text-base italic">
                    {description}
                  </p>
                </>
              )}

              {mainImage && (
                <>
                  <h2 className="text-xl font-semibold text-slate-800 mb-2">
                    Main Image:
                  </h2>
                  <div className="w-full max-w-md h-72 rounded border overflow-hidden">
                    <img
                      src={mainImage.imageUrl}
                      alt="Main"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Gallery Grid */}
          {filteredImages.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Images in {selectedCategory} Category:
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-full h-80 overflow-hidden rounded border"
                  >
                    <img
                      src={img.url}
                      alt={`gallery-${idx}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : selectedCategory ? (
            <p className="text-slate-500">No images found for this category.</p>
          ) : (
            <p className="text-slate-500">
              Please select a category to view images.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryAdmin;
