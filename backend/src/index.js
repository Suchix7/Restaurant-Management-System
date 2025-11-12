import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import Venue from "./models/venue.model.js";
import cloudinary from "cloudinary";
import multer from "multer";
import Contact from "./models/contact.model.js";
import { sendEmailNotification, sendEmail } from "./lib/mailTemplate.js";
import Event from "./models/events.model.js";
import { Readable } from "stream";
import Gallery from "./models/gallery.model.js";
import UserAccess from "./models/useraccess.model.js";
import { generateToken } from "./lib/util.js";
import router from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import Menu from "./models/menu.model.js";
import Mail from "./models/mail.model.js";
import Subscriber from "./models/subscriber.model.js";
import { requirePermission } from "./middleware/auth.middleware.js";
import MainGallery from "./models/maingallery.model.js";
import mailRouter from "./routes/mail.route.js";
import Specials from "./models/specials.model.js";
import Contactus from "./models/contactus.model.js";
import Post from "./models/post.model.js";
import fetch from "node-fetch";
const app = express();
app.set("trust proxy", true);
dotenv.config();
const origins =
  process.env.NODE_ENV === "production"
    ? [
        "https://reservation-system-f28uhp7p9.vercel.app",
        "https://restaurant-management-system-y7o4.onrender.com",
        "https://reservation-system-lemon.vercel.app",
        "https://www.4donkey.com.au",
        "https://4donkey.com.au",
      ]
    : ["http://localhost:3000", "http://localhost:5173"];
const SELF_URL = "https://restaurant-management-system-y7o4.onrender.com";
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || origins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
        console.log("Origin not allowed by CORS:", origin);
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

const cloudinaryV2 = cloudinary.v2;
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.use("/api/mail-config", mailRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/api/reserve-venue", upload.single("file"), async (req, res) => {
  try {
    const {
      name,
      email,
      bookingType,
      phone,
      eventType,
      guestCount,
      date,
      startTime,
      endTime,
      specialRequests,
    } = req.body;

    let uploadedFileUrl = "";

    if (req.file) {
      const bufferStream = Readable.from(req.file.buffer);
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinaryV2.uploader.upload_stream(
          { resource_type: "raw" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        bufferStream.pipe(stream);
      });

      uploadedFileUrl = result.secure_url;
    }

    await Venue.create({
      name,
      email,
      bookingType,
      phone,
      eventType,
      guestCount,
      date,
      startTime,
      endTime,
      specialRequests,
      file: uploadedFileUrl,
    });

    await sendEmailNotification(
      name,
      email,
      "New Venue Reservation",
      `New venue reservation from ${name} (${email}) for ${eventType} on ${date}.`
    );

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/venue-reservations", async (req, res) => {
  try {
    const reservations = await Venue.find({});
    res.status(200).json(reservations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
setInterval(() => {
  fetch(SELF_URL)
    .then((res) =>
      console.log(`Pinged ${SELF_URL} at ${new Date().toISOString()}`)
    )
    .catch((err) => console.error("Ping failed:", err));
}, 14 * 60 * 1000); // every 14 minutes

app.get("/api/venue-reservations/:id", async (req, res) => {
  try {
    const reservation = await Venue.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/venue-reservations/:id", async (req, res) => {
  try {
    const reservation = await Venue.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/venue-reservations/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedReservation = await Venue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log(`Contact message from ${name} (${email}): ${message}`);

    await Contact.create({ name, email, message });
    // Here you can also implement sending an email notification if needed
    // For example, using nodemailer or any other email service
    await sendEmailNotification(name, email, "New Contact Message", message);

    res.status(200).json({ message: "Contact message received successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/contact", async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/contact/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post(
  "/api/specials",
  requirePermission("AddSpecials"),
  upload.single("posterImage"),
  async (req, res) => {
    try {
      const {
        title,
        date,
        time,
        description,
        location,
        category,
        price,
        capacity,
        rsvpCount,
      } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No poster image provided" });
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinaryV2.uploader.upload_stream(
          {
            folder: "specials-posters",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      const newEvent = await Specials.create({
        title,
        date,
        time,
        description,
        posterImage: {
          imageUrl: result.secure_url,
          publicId: result.public_id,
        },
        location,
        category,
        price,
        capacity: parseInt(capacity, 10),
        rsvpCount: parseInt(rsvpCount, 10) || 0,
      });

      res
        .status(201)
        .json({ message: "Special created successfully", event: newEvent });
    } catch (error) {
      console.error("Error uploading event poster:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.get("/api/specials", async (req, res) => {
  try {
    const specials = await Specials.find({});
    return res.status(200).json(specials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/specials/:id", async (req, res) => {
  try {
    const special = await Specials.findById(req.params.id);
    if (!special) {
      return res.status(404).json({ message: "Special not found" });
    }
    res.status(200).json(special);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete(
  "/api/specials/:id",
  requirePermission("Specials"),
  async (req, res) => {
    try {
      const event = await Specials.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Special not found" });
      }

      // Delete image from Cloudinary if it exists
      if (event.posterImage && event.posterImage.publicId) {
        await cloudinary.v2.uploader.destroy(event.posterImage.publicId, {
          resource_type: "image",
        });
      }

      // Delete the event from MongoDB
      await Event.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Event delete error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.put(
  "/api/specials/:id",
  requirePermission("Specials"),
  upload.single("posterImage"),
  async (req, res) => {
    try {
      const {
        title,
        date,
        time,
        description,
        location,
        category,
        price,
        capacity,
      } = req.body;

      if (
        !title ||
        !date ||
        !time ||
        !description ||
        !location ||
        !category ||
        !price ||
        !capacity
      ) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const event = await Specials.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found." });
      }

      let newPosterImage = event.posterImage;

      if (req.file) {
        // Delete old image from Cloudinary if exists
        if (event.posterImage?.publicId) {
          await cloudinaryV2.uploader.destroy(event.posterImage.publicId, {
            resource_type: "image",
          });
        }

        // Upload new poster image
        const streamUpload = () =>
          new Promise((resolve, reject) => {
            const stream = cloudinaryV2.uploader.upload_stream(
              {
                folder: "specilas/posters",
                resource_type: "image",
              },
              (error, result) => {
                if (error) reject(error);
                else
                  resolve({
                    imageUrl: result.secure_url,
                    publicId: result.public_id,
                  });
              }
            );

            Readable.from(req.file.buffer).pipe(stream);
          });

        newPosterImage = await streamUpload();
      }

      // Update event
      const updatedEvent = await Specials.findByIdAndUpdate(
        req.params.id,
        {
          title,
          date,
          time,
          description,
          location,
          category,
          price,
          capacity: parseInt(capacity, 10) || 0,
          posterImage: newPosterImage,
        },
        { new: true }
      );

      res.status(200).json({
        message: "Special updated successfully.",
        event: updatedEvent,
      });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

app.put("/api/specials/rsvp/:id", async (req, res) => {
  try {
    const event = await Specials.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    event.rsvpCount = (event.rsvpCount || 0) + 1;
    if (event.capacity && event.rsvpCount > event.capacity) {
      return res.status(400).json({
        message: "RSVP limit exceeded. Please contact us for more information.",
      });
    }
    await event.save();

    res.status(200).json({
      message: "RSVP updated successfully.",
      rsvpCount: event.rsvpCount,
    });
  } catch (error) {
    console.error("Error updating RSVP:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post(
  "/api/events",
  requirePermission("AddEvents"),
  upload.single("posterImage"),
  async (req, res) => {
    try {
      const {
        title,
        date,
        time,
        description,
        location,
        category,
        price,
        capacity,
        rsvpCount,
      } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No poster image provided" });
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinaryV2.uploader.upload_stream(
          {
            folder: "event-posters",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      const newEvent = await Event.create({
        title,
        date,
        time,
        description,
        posterImage: {
          imageUrl: result.secure_url,
          publicId: result.public_id,
        },
        location,
        category,
        price,
        capacity: parseInt(capacity, 10),
        rsvpCount: parseInt(rsvpCount, 10) || 0,
      });

      res
        .status(201)
        .json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
      console.error("Error uploading event poster:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find({});
    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/events/:id", requirePermission("Events"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete image from Cloudinary if it exists
    if (event.posterImage && event.posterImage.publicId) {
      await cloudinary.v2.uploader.destroy(event.posterImage.publicId, {
        resource_type: "image",
      });
    }

    // Delete the event from MongoDB
    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Event delete error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put(
  "/api/events/:id",
  requirePermission("Events"),
  upload.single("posterImage"),
  async (req, res) => {
    try {
      const {
        title,
        date,
        time,
        description,
        location,
        category,
        price,
        capacity,
      } = req.body;

      if (
        !title ||
        !date ||
        !time ||
        !description ||
        !location ||
        !category ||
        !price ||
        !capacity
      ) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found." });
      }

      let newPosterImage = event.posterImage;

      if (req.file) {
        // Delete old image from Cloudinary if exists
        if (event.posterImage?.publicId) {
          await cloudinaryV2.uploader.destroy(event.posterImage.publicId, {
            resource_type: "image",
          });
        }

        // Upload new poster image
        const streamUpload = () =>
          new Promise((resolve, reject) => {
            const stream = cloudinaryV2.uploader.upload_stream(
              {
                folder: "events/posters",
                resource_type: "image",
              },
              (error, result) => {
                if (error) reject(error);
                else
                  resolve({
                    imageUrl: result.secure_url,
                    publicId: result.public_id,
                  });
              }
            );

            Readable.from(req.file.buffer).pipe(stream);
          });

        newPosterImage = await streamUpload();
      }

      // Update event
      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        {
          title,
          date,
          time,
          description,
          location,
          category,
          price,
          capacity: parseInt(capacity, 10) || 0,
          posterImage: newPosterImage,
        },
        { new: true }
      );

      res.status(200).json({
        message: "Event updated successfully.",
        event: updatedEvent,
      });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

app.put("/api/events/rsvp/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    event.rsvpCount = (event.rsvpCount || 0) + 1;
    if (event.capacity && event.rsvpCount > event.capacity) {
      return res.status(400).json({
        message: "RSVP limit exceeded. Please contact us for more information.",
      });
    }
    await event.save();

    res.status(200).json({
      message: "RSVP updated successfully.",
      rsvpCount: event.rsvpCount,
    });
  } catch (error) {
    console.error("Error updating RSVP:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

const uploadFields = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 20 }, // Adjust max count as needed
]);

app.post(
  "/api/gallery",
  requirePermission("AddGallery"),
  uploadFields,
  async (req, res) => {
    try {
      const galleryCheck = Gallery.find({});
      if (galleryCheck.length >= 5) {
        return res.status(400).json({
          message: "Gallery limit reached. Cannot add more galleries.",
        });
      }
      const { category, description } = req.body;

      if (!category || !description) {
        return res.status(400).json({
          message: "Category and description are required.",
        });
      }

      const mainImageFile = req.files?.mainImage?.[0];
      const imageFiles = req.files?.images || [];

      if (!mainImageFile) {
        return res.status(400).json({ message: "Main image is required." });
      }

      // Upload mainImage
      const mainImageResult = await new Promise((resolve, reject) => {
        const stream = cloudinaryV2.uploader.upload_stream(
          {
            folder: "gallery/main",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(mainImageFile.buffer);
      });

      const mainImage = {
        imageUrl: mainImageResult.secure_url,
        publicId: mainImageResult.public_id,
      };

      // Upload gallery images
      const uploadPromises = imageFiles.map((file) => {
        const bufferStream = Readable.from(file.buffer);
        return new Promise((resolve, reject) => {
          const stream = cloudinaryV2.uploader.upload_stream(
            {
              folder: "gallery/images",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
              });
            }
          );
          bufferStream.pipe(stream);
        });
      });

      const uploadedImages = await Promise.all(uploadPromises);

      const gallery = await Gallery.create({
        category,
        description,
        mainImage,
        images: uploadedImages,
      });

      res
        .status(200)
        .json({ message: "Gallery created successfully", gallery });
    } catch (error) {
      console.error("Gallery upload error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.post("/api/main-gallery", upload.array("images", 6), async (req, res) => {
  try {
    if (!req.files || req.files.length !== 6) {
      return res
        .status(400)
        .json({ message: "Exactly 6 images are required." });
    }

    const uploadToCloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinaryV2.uploader.upload_stream(
          { folder: "main-gallery" },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              imageUrl: result.secure_url,
              publicId: result.public_id,
            });
          }
        );
        stream.end(fileBuffer);
      });
    };

    const uploadedImages = [];

    for (const file of req.files) {
      const uploaded = await uploadToCloudinary(file.buffer);
      uploadedImages.push(uploaded);
    }

    // Save to MongoDB
    const savedGallery = await MainGallery.create({ images: uploadedImages });

    res.status(201).json({
      message: "Images uploaded and saved to DB successfully.",
      gallery: savedGallery,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ message: "Server error during image upload." });
  }
});

app.get("/api/main-gallery", async (req, res) => {
  try {
    const gallery = await MainGallery.findOne({});
    if (!gallery) {
      return res.status(404).json({ message: "Main gallery not found" });
    }
    res.status(200).json({
      message: "Main gallery fetched successfully",
      images: gallery.images,
    });
  } catch (error) {
    console.error("Error fetching main gallery:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/main-gallery", upload.array("images"), async (req, res) => {
  try {
    const replaceIndexes = req.body.replaceIndexes
      ? JSON.parse(req.body.replaceIndexes)
      : [];

    if (!req.files || req.files.length !== replaceIndexes.length) {
      return res.status(400).json({
        message: "Mismatch between uploaded files and replaceIndexes",
      });
    }

    const existingGallery = await MainGallery.findOne({});
    if (!existingGallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    const updatedImages = [...existingGallery.images]; // Copy of current images

    // Helper: Upload to Cloudinary using stream + Promise
    const uploadToCloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinaryV2.uploader.upload_stream(
          { folder: "main-gallery" },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              imageUrl: result.secure_url,
              publicId: result.public_id,
            });
          }
        );
        stream.end(fileBuffer);
      });
    };

    // Replace specified indexes
    for (let i = 0; i < replaceIndexes.length; i++) {
      const index = replaceIndexes[i];
      const file = req.files[i];

      if (index < 0 || index > 5) {
        return res.status(400).json({ message: "Invalid index " + index });
      }

      const uploaded = await uploadToCloudinary(file.buffer);

      // Optional: delete old image from Cloudinary
      if (updatedImages[index]?.publicId) {
        await cloudinaryV2.uploader.destroy(updatedImages[index].publicId);
      }

      updatedImages[index] = uploaded;
    }

    // Update in DB
    existingGallery.images = updatedImages;
    await existingGallery.save();

    res.status(200).json({
      message: "Gallery updated successfully",
      images: updatedImages,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/gallery/:category", async (req, res) => {
  try {
    const { category } = req.params;

    const gallery = await Gallery.findOne({ category });

    if (!gallery) {
      return res.status(404).json({ message: "Gallery category not found" });
    }

    res.status(200).json({
      message: "Gallery fetched successfully",
      images: gallery.images,
    });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/gallery", async (req, res) => {
  try {
    const galleries = await Gallery.find({});
    res.status(200).json(galleries);
  } catch (error) {
    console.error("Error fetching galleries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put(
  "/api/gallery",
  requirePermission("ManageGallery"),
  upload.fields([
    { name: "images", maxCount: 20 },
    { name: "mainImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { category, description } = req.body;

      if (!category) {
        return res.status(400).json({ message: "Category is required" });
      }

      const existingGallery = await Gallery.findOne({ category });

      // Upload new gallery images (if any)
      let uploadedImages = [];
      if (req.files?.images?.length > 0) {
        const uploadPromises = req.files.images.map((file) => {
          const bufferStream = Readable.from(file.buffer);
          return new Promise((resolve, reject) => {
            const stream = cloudinaryV2.uploader.upload_stream(
              {
                resource_type: "image",
                folder: "gallery",
              },
              (error, result) => {
                if (error) return reject(error);
                resolve({
                  url: result.secure_url,
                  public_id: result.public_id,
                });
              }
            );
            bufferStream.pipe(stream);
          });
        });

        uploadedImages = await Promise.all(uploadPromises);
      }

      // Upload main image (if provided)
      let uploadedMainImage = null;
      if (req.files?.mainImage?.length > 0) {
        const mainFile = req.files.mainImage[0];
        const bufferStream = Readable.from(mainFile.buffer);
        uploadedMainImage = await new Promise((resolve, reject) => {
          const stream = cloudinaryV2.uploader.upload_stream(
            {
              resource_type: "image",
              folder: "gallery/main",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve({
                imageUrl: result.secure_url,
                publicId: result.public_id,
              });
            }
          );
          bufferStream.pipe(stream);
        });
      }

      // Build update fields
      const updateFields = {};
      if (uploadedImages.length > 0) {
        updateFields.$push = { images: { $each: uploadedImages } };
      }
      if (description !== undefined) {
        updateFields.description = description;
      }
      if (uploadedMainImage) {
        updateFields.mainImage = uploadedMainImage;
      }

      const updatedGallery = await Gallery.findOneAndUpdate(
        { category },
        updateFields,
        { new: true, upsert: true } // Create new gallery if doesn't exist
      );

      res.status(200).json({
        message: "Gallery updated successfully",
        gallery: updatedGallery,
      });
    } catch (error) {
      console.error("Error updating gallery:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.put(
  "/api/gallery/reorder",
  requirePermission("ManageGallery"),
  async (req, res) => {
    const { category, images } = req.body;

    if (!category || !Array.isArray(images)) {
      return res
        .status(400)
        .json({ message: "Category and image array required." });
    }

    try {
      const gallery = await Gallery.findOneAndUpdate(
        { category },
        { images }, // Replace existing array with new one
        { new: true }
      );

      if (!gallery) {
        return res.status(404).json({ message: "Gallery not found" });
      }

      res.status(200).json({ message: "Gallery reordered", gallery });
    } catch (error) {
      console.error("Error reordering images:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.delete(
  "/api/gallery",
  requirePermission("ManageGallery"),
  async (req, res) => {
    try {
      const { category } = req.body;

      if (!category) {
        return res.status(400).json({ message: "Category is required" });
      }

      const deletedGallery = await Gallery.findOneAndDelete({ category });

      if (!deletedGallery) {
        return res.status(404).json({ message: "Gallery category not found" });
      }

      // Optionally, delete all images from Cloudinary
      for (const image of deletedGallery.images) {
        await cloudinaryV2.uploader.destroy(image.public_id);
      }

      res.status(200).json({
        message: "Gallery deleted successfully",
        gallery: deletedGallery,
      });
    } catch (error) {
      console.error("Error deleting gallery:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.delete(
  "/api/gallery/image",
  requirePermission("ManageGallery"),
  async (req, res) => {
    try {
      const { category, public_id } = req.body;

      if (!category || !public_id) {
        return res
          .status(400)
          .json({ message: "category and public_id are required" });
      }

      // Delete from Cloudinary
      await cloudinaryV2.uploader.destroy(public_id);

      // Remove image from the array in the gallery document
      const updatedGallery = await Gallery.findOneAndUpdate(
        { category },
        { $pull: { images: { public_id } } },
        { new: true }
      );

      if (!updatedGallery) {
        return res.status(404).json({ message: "Gallery category not found" });
      }

      res.status(200).json({
        message: "Image deleted successfully",
        gallery: updatedGallery,
      });
    } catch (error) {
      console.error("Image delete error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.post("/api/gallery-tagline", async (req, res) => {
  try {
    const { tagline } = req.body;
    if (!tagline) {
      return res.status(400).json({ message: "Tagline is required" });
    }
    const existing = await MainGallery.findOne({});
    if (existing) {
      existing.tagline = tagline;
      await existing.save();
      return res
        .status(200)
        .json({ message: "Tagline updated successfully", tagline: existing });
    }
  } catch (error) {
    console.log("Error while saving tagline:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/gallery-tagline", async (req, res) => {
  try {
    const gallery = await MainGallery.findOne({});
    if (!gallery || !gallery.tagline) {
      return res.status(404).json({ message: "Tagline not found" });
    }
    res.status(200).json({
      message: "Tagline fetched successfully",
      tagline: gallery.tagline,
    });
  } catch (error) {
    console.log("Error while fetching tagline:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/role", requirePermission("AddRole"), async (req, res) => {
  try {
    const { role, password, permissions } = req.body;
    if (!role || !password) {
      return res
        .status(400)
        .json({ message: "Role and password are required" });
    }

    const existingRole = await UserAccess.findOne({ role });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const newRole = await UserAccess.create({
      role,
      password,
      permissions,
    });

    res.status(201).json({ message: "Role created successfully", newRole });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/roles", async (req, res) => {
  try {
    const roles = await UserAccess.find({}).select("-password");
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/role/:id", async (req, res) => {
  try {
    const role = await UserAccess.findById(req.params.id).select("-password");
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.status(200).json(role);
  } catch (error) {
    console.error("Error fetching role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get(
  "/api/admin/roles",
  requirePermission("ViewRoles"),
  async (req, res) => {
    try {
      const roles = await UserAccess.find({});
      res.status(200).json(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.put("/api/role/:id", requirePermission("ViewRoles"), async (req, res) => {
  try {
    const { role, password } = req.body;

    if (!role || !password) {
      return res
        .status(400)
        .json({ message: "Role and password are required" });
    }

    const updatedRole = await UserAccess.findByIdAndUpdate(
      req.params.id,
      { role, password }, // Password should be hashed in production
      { new: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({ message: "Role updated successfully", updatedRole });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /role/:id
app.put(
  "/api/admin/role/:id",
  requirePermission("ViewRoles"),
  async (req, res) => {
    try {
      const { role, password, permissions } = req.body;

      if (!role || !password) {
        return res
          .status(400)
          .json({ message: "Role and password are required." });
      }

      const updatedRole = await UserAccess.findByIdAndUpdate(
        req.params.id,
        { role, password, permissions },
        { new: true }
      );

      if (!updatedRole) {
        return res.status(404).json({ message: "Role not found." });
      }

      res
        .status(200)
        .json({ message: "Role updated successfully", updatedRole });
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.delete(
  "/api/role/:id",
  requirePermission("ViewRoles"),
  async (req, res) => {
    try {
      const deletedRole = await UserAccess.findByIdAndDelete(req.params.id);

      if (!deletedRole) {
        return res.status(404).json({ message: "Role not found" });
      }

      res
        .status(200)
        .json({ message: "Role deleted successfully", deletedRole });
    } catch (error) {
      console.error("Error deleting role:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.use("/api/auth", router);

app.post(
  "/api/menu",
  requirePermission("AddMenu"),
  upload.single("menu-image"),
  async (req, res) => {
    try {
      const { category } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No image provided" });
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinaryV2.uploader.upload_stream(
          {
            folder: "menu-images",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      const newMenu = await Menu.create({
        category,
        imageUrl: result.secure_url,
      });

      res.status(201).json(newMenu);
    } catch (error) {
      console.error("Error uploading menu:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.get("/api/menu", async (req, res) => {
  try {
    const menus = await Menu.find({});
    res.status(200).json(menus);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ error });
  }
});

app.delete("/api/menu/:id", requirePermission("Menu"), async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Delete image from Cloudinary if it exists
    if (menu.imageUrl) {
      const publicId = menu.imageUrl.split("/").pop().split(".")[0];
      await cloudinary.v2.uploader.destroy(publicId, {
        resource_type: "image",
      });
    }

    // Delete the menu item from MongoDB
    await Menu.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Menu delete error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put(
  "/api/menu/:id",
  requirePermission("Menu"),
  upload.single("menu-image"),
  async (req, res) => {
    try {
      const { category } = req.body;
      const file = req.file;

      if (!category) {
        return res.status(400).json({ message: "Category is required" });
      }

      // Find existing menu item first
      const existingMenu = await Menu.findById(req.params.id);
      if (!existingMenu) {
        return res.status(404).json({ message: "Menu item not found" });
      }

      let imageUrl = existingMenu.imageUrl; // default to existing

      // If a new file is uploaded, upload to Cloudinary
      if (file) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinaryV2.uploader.upload_stream(
            {
              folder: "menu-images",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });

        imageUrl = result.secure_url; // override with new image URL
      }

      const updatedMenu = await Menu.findByIdAndUpdate(
        req.params.id,
        { category, imageUrl },
        { new: true }
      );

      res.status(200).json(updatedMenu);
    } catch (error) {
      console.error("Error updating menu:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.post("/api/mail", async (req, res) => {
  try {
    const { email, pass } = req.body;
    if (!email || !pass) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingMail = await Mail.findOne({ email });
    if (existingMail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newMail = await Mail.create({
      email,
      pass,
    });

    res.status(201).json({ message: "Mail created successfully", newMail });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/mail", async (req, res) => {
  try {
    const mail = await Mail.findOne();
    if (!mail) {
      return res.status(404).json({ message: "Mail credentials not found" });
    }
    res.status(200).json(mail);
  } catch (error) {
    console.error("Error fetching mail credentials:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/mail", async (req, res) => {
  try {
    const { email, pass } = req.body;
    if (!email || !pass) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const updatedMail = await Mail.findOneAndUpdate(
      {},
      { email, pass },
      { new: true, upsert: true }
    );
    res
      .status(200)
      .json({ message: "Mail credentials updated successfully", updatedMail });
  } catch (error) {
    console.error("Error updating mail credentials:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    const newSubscriber = await Subscriber.create({
      email,
    });

    await sendEmailNotification(
      "Subscriber",
      email,
      "New Subscription",
      `New subscriber: ${email}`
    );

    await sendEmail(
      email,
      "Subscription Confirmation",
      "Thank you for subscribing!"
    );

    res.status(201).json({
      message: "Subscription successful",
      subscriber: newSubscriber,
    });
  } catch (error) {
    console.error("Error subscribing:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/subscribers", async (req, res) => {
  try {
    const subscribers = await Subscriber.find({});
    res.status(200).json(subscribers);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET single contact
app.get("/api/contactus", async (req, res) => {
  try {
    const doc = await Contactus.findOne();
    if (!doc) return res.status(404).json({ message: "Contact not set yet." });
    res.json(doc);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch contact.", error: err.message });
  }
});

// CREATE single contact (fails if one already exists)
app.post("/api/contactus", async (req, res) => {
  try {
    const count = await Contactus.countDocuments();
    if (count > 0) {
      const existing = await Contactus.findOne().select("_id updatedAt");
      return res.status(409).json({
        message: "A contact document already exists.",
        id: existing?._id,
      });
    }
    const created = await Contact.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create contact.", error: err.message });
  }
});

// REPLACE/UPSERT the single contact (idempotent)
app.put("/api/contactus", async (req, res) => {
  try {
    const updated = await Contactus.findOneAndUpdate(
      {}, // singleton
      req.body, // full replacement payload
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );
    res.json(updated);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to upsert contact.", error: err.message });
  }
});

// PARTIAL UPDATE the single contact
app.patch("/api/contactus", async (req, res) => {
  try {
    const updated = await Contactus.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Contact not set yet." });
    res.json(updated);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update contact.", error: err.message });
  }
});

// DELETE the single contact (removes any accidental duplicates too)
app.delete("/api/contactus", async (req, res) => {
  try {
    const result = await Contact.deleteMany({});
    res.json({
      message: "Deleted contact document(s).",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete contact.", error: err.message });
  }
});

app.post("/api/admin/posts", upload.single("image"), async (req, res) => {
  try {
    const { linkUrl } = req.body;
    if (!linkUrl)
      return res.status(400).json({ message: "linkUrl is required" });
    if (!req.file)
      return res.status(400).json({ message: "image file is required" });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinaryV2.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_FOLDER || "app_posts",
          resource_type: "image",
          overwrite: false,
        },
        (err, uploaded) => (err ? reject(err) : resolve(uploaded))
      );
      stream.end(req.file.buffer);
    });

    const doc = await Post.create({
      linkUrl,
      image: {
        publicId: result.public_id,
        imageUrl: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: "Failed to create post", error: err.message });
  }
});

app.get("/api/admin/posts", async (_req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch posts", error: err.message });
  }
});

// DELETE a post (and Cloudinary image)
app.delete("/api/admin/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await cloudinary.uploader.destroy(post.image.publicId, {
      resource_type: "image",
    });
    await Post.deleteOne({ _id: post._id });

    res.json({ message: "Post deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete post", error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Listening at port: ${process.env.PORT}.`);
  connectDB();
});
