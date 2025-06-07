import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { toast } from "react-hot-toast";

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredImages, setFilteredImages] = useState([]);

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
    } else {
      setFilteredImages([]);
    }
  }, [selectedCategory, galleries]);

  const uniqueCategories = [...new Set(galleries.map((g) => g.category))];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery</CardTitle>
      </CardHeader>
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

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredImages.map((imgUrl, idx) => (
              <div
                key={idx}
                className="w-full h-80 overflow-hidden rounded border"
              >
                <img
                  src={imgUrl.url}
                  alt={`gallery-${idx}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        ) : selectedCategory ? (
          <p className="text-slate-500">No images found for this category.</p>
        ) : (
          <p className="text-slate-500">
            Please select a category to view images.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default Gallery;
