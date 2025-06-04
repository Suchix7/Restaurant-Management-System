import mongoose from "mongoose";
const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    bookingType: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    estimatedGuests: {
      type: Number,
      required: true,
    },
    reserveDate: {
      type: Date,
      default: new Date(),
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    specialRequests: {
      type: String,
      default: "",
    },
    file: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Venue = mongoose.model("Venue", venueSchema);
export default Venue;
