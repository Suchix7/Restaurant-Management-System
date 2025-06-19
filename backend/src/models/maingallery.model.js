import mongoose from "mongoose";

const mainGallerySchema = {
  images: [
    {
      imageUrl: String,
      publicId: String,
    },
  ],
};

const MainGallery = mongoose.model("MainGallery", mainGallerySchema);
export default MainGallery;
