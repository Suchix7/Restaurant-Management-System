import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    mainImage: {
      imageUrl: String,
      publicId: String,
    },
    images: {
      type: Array,
    },
  },
  { timestamps: true }
);
const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;
