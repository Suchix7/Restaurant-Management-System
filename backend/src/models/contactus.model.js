// models/contact.model.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const DAY_ENUM = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const openingHourSchema = new Schema(
  {
    // e.g. ["Monday","Tuesday","Wednesday","Thursday"]
    days: {
      type: [String],
      enum: DAY_ENUM,
      required: true,
      validate: (v) => v.length > 0,
    },
    // 24h "HH:mm" for storage; use your UI to format to 4PM, 11PM, etc.
    open: { type: String, default: null }, // e.g. "16:00"
    close: { type: String, default: null }, // e.g. "23:00"
    // If true, ignore open/close for these days
    closed: { type: Boolean, default: false },
    note: { type: String, trim: true }, // optional (e.g., "Kitchen closes 10:30PM")
  },
  { _id: false }
);

const addressSchema = new Schema(
  {
    street: { type: String, trim: true }, // "123 Bar Street"
    city: { type: String, trim: true }, // "Sydney"
    state: { type: String, trim: true }, // "NSW"
    postalCode: { type: String, trim: true }, // "2000"
    country: { type: String, trim: true }, // "Australia"
    // Optional map pin
    geo: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      // [longitude, latitude]
      coordinates: {
        type: [Number],
        default: undefined,
      },
    },
  },
  { _id: false }
);

const contactSchema = new Schema(
  {
    // Optional display label like "The Rocks"
    locationLabel: { type: String, trim: true },

    address: { type: addressSchema, required: true },

    phone: {
      type: String,
      required: true,
      trim: true,
      // loose validation to allow country codes, spaces, brackets, etc.
      match: /^[0-9+().\-\s]{6,}$/,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    openingHours: {
      type: [openingHourSchema],
      required: true,
      // ensure at least one entry is provided
      validate: (arr) => Array.isArray(arr) && arr.length > 0,
    },
  },
  { timestamps: true, collection: "contacts" }
);

// Helpful virtual to render a single-line address
contactSchema.virtual("addressOneLine").get(function () {
  const { street, city, state, postalCode, country } = this.address || {};
  return [street, city, state, postalCode, country].filter(Boolean).join(", ");
});

// 2dsphere index if you’ll query by proximity
contactSchema.index({ "address.geo": "2dsphere" });

export default mongoose.models.Contactus ||
  mongoose.model("Contactus", contactSchema);
