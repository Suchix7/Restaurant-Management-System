import React, { useState } from "react";

const MainGallery = () => {
  const [images, setImages] = useState(Array(6).fill(null));

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = {
        file,
        preview: URL.createObjectURL(file),
      };
      setImages(newImages);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-6">
      {images.map((image, index) => (
        <div
          key={index}
          className="border-2 border-dashed border-gray-300 rounded-lg h-40 w-full flex items-center justify-center relative overflow-hidden"
        >
          {image ? (
            <img
              src={image.preview}
              alt={`Preview ${index + 1}`}
              className="object-cover w-full h-full"
            />
          ) : (
            <label
              htmlFor={`upload-${index}`}
              className="cursor-pointer text-gray-400 text-sm hover:text-gray-600"
            >
              Click to upload
              <input
                id={`upload-${index}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, index)}
                className="hidden"
              />
            </label>
          )}
        </div>
      ))}
    </div>
  );
};

export default MainGallery;
