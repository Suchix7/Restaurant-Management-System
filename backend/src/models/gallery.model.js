import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
    },
  },
  { timestamps: true }
);
const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;
