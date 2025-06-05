import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const galleryData = {
  Food: [
    "/images/gallery/food1.jpg",
    "/images/gallery/food2.jpg",
    "/images/gallery/food3.jpg",
  ],
  Drinks: [
    "/images/gallery/drink1.jpg",
    "/images/gallery/drink2.jpg",
    "/images/gallery/drink3.jpg",
  ],
  Ambience: [
    "/images/gallery/ambience1.jpg",
    "/images/gallery/ambience2.jpg",
    "/images/gallery/ambience3.jpg",
  ],
};

const GalleryView = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(galleryData).map(([category, images]) => (
          <Dialog key={category}>
            <DialogTrigger asChild>
              <Card
                onClick={() => setActiveCategory(category)}
                className="cursor-pointer hover:shadow-md transition-shadow border-slate-200"
              >
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={images[0]}
                    alt={`${category} thumbnail`}
                    className="w-full h-40 object-cover rounded-md"
                  />
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{category} Gallery</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {galleryData[category].map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Gallery ${category} ${index}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ))}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default GalleryView;
