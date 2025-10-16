import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    linkUrl: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      publicId: { type: String, required: true },
      imageUrl: { type: String, required: true },
      width: Number,
      height: Number,
      format: String,
      bytes: Number,
    },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "posts" }
);

export default mongoose.models.Post || mongoose.model("Post", postSchema);
