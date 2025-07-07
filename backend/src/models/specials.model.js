import mongoose from "mongoose";

const specialsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    posterImage: {
      imageUrl: String,
      publicId: String,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    rsvpCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Specials = mongoose.model("Specials", specialsSchema);
export default Specials;
