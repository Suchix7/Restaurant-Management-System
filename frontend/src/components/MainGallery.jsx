import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance.js";
import toast from "react-hot-toast";

const MainGallery = () => {
  const [images, setImages] = useState(Array(6).fill(null));
  const [loading, setLoading] = useState(false);
  const [isGalleryExisting, setIsGalleryExisting] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axiosInstance.get("/main-gallery");
        const fetchedImages = res.data.images || [];

        const newState = Array(6).fill(null);
        fetchedImages.forEach((img, i) => {
          if (i < 6) {
            newState[i] = {
              preview: img.imageUrl,
              publicId: img.publicId,
              fromDB: true,
            };
          }
        });

        setImages(newState);
        setIsGalleryExisting(true);
      } catch (error) {
        console.error("Failed to load gallery:", error);
      }
    };

    fetchGallery();
  }, []);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = {
        file,
        preview: URL.createObjectURL(file),
        fromDB: false,
      };
      setImages(newImages);
    }
  };

  const handleSubmit = async () => {
    const nonNullCount = images.filter((img) => img !== null).length;

    if (nonNullCount !== 6) {
      return alert("You must have exactly 6 images to proceed.");
    }

    const newImages = images
      .map((img, index) => ({ ...img, index }))
      .filter((img) => img && !img.fromDB && img.file);

    const formData = new FormData();
    newImages.forEach((img) => {
      formData.append("images", img.file);
    });

    if (isGalleryExisting && newImages.length > 0) {
      const replaceIndexes = newImages.map((img) => img.index);
      formData.append("replaceIndexes", JSON.stringify(replaceIndexes));

      try {
        setLoading(true);
        const res = await axiosInstance.put("/main-gallery", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Gallery updated!");
        window.location.reload();
      } catch (err) {
        console.error("Update failed:", err);
        toast.error("Failed to update images.");
      } finally {
        setLoading(false);
      }
    } else if (!isGalleryExisting) {
      // First-time upload of 6 full images
      const fullFormData = new FormData();
      images.forEach((img) => fullFormData.append("images", img.file));

      try {
        setLoading(true);
        const res = await axiosInstance.post("/main-gallery", fullFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Gallery uploaded!");
        window.location.reload();
      } catch (err) {
        console.error("Upload failed:", err);
        toast.error("Failed to upload gallery.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("No new images to update.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Main Gallery</h2>
      <p className="text-slate-600 mb-6">
        Upload or update main gallery images.
      </p>
      <div className="max-w-xl mx-auto mt-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative border-2 border-dashed border-gray-300 rounded-lg h-40 w-full overflow-hidden flex items-center justify-center group"
            >
              {image ? (
                <>
                  <img
                    src={image.preview}
                    alt={`Preview ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <label
                      htmlFor={`upload-${index}`}
                      className="bg-white p-1 rounded shadow cursor-pointer text-xs"
                      title="Edit"
                    >
                      ✏️
                      <input
                        type="file"
                        accept="image/*"
                        id={`upload-${index}`}
                        onChange={(e) => handleImageChange(e, index)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </>
              ) : (
                <label
                  htmlFor={`upload-${index}`}
                  className="cursor-pointer text-gray-400 text-sm hover:text-gray-600 flex items-center justify-center w-full h-full"
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

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 px-4 text-white rounded ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? "Uploading..."
            : isGalleryExisting
            ? "Update Gallery"
            : "Submit Gallery"}
        </button>
      </div>
    </div>
  );
};

export default MainGallery;
