import mongoose from "mongoose";

const mainGallerySchema = {
  tagline: {
    type: String,
    required: true,
  },
  images: [
    {
      imageUrl: String,
      publicId: String,
    },
  ],
};

const MainGallery = mongoose.model("MainGallery", mainGallerySchema);
export default MainGallery;
