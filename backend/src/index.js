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

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
dotenv.config();

const upload = multer();

const cloudinaryV2 = cloudinary.v2;
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.post("/api/reserve-venue", upload.single("file"), async (req, res) => {
  try {
    const {
      name,
      email,
      bookingType,
      phone,
      eventType,
      estimatedGuests,
      reserveDate,
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
      estimatedGuests,
      reserveDate,
      startTime,
      endTime,
      specialRequests,
      file: uploadedFileUrl,
    });

    await sendEmailNotification(
      name,
      email,
      "New Venue Reservation",
      `New venue reservation from ${name} (${email}) for ${eventType} on ${reserveDate}.`
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

app.post("/api/events", upload.single("posterImage"), async (req, res) => {
  try {
    const { title, date, time, description } = req.body;
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
    });

    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error uploading event poster:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
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

app.delete("/api/events/:id", async (req, res) => {
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

app.post("/api/gallery", upload.any(), async (req, res) => {
  try {
    const { category } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }
    const uploadPromises = req.files.map((file) => {
      const bufferStream = Readable.from(file.buffer);
      return new Promise((resolve, reject) => {
        const stream = cloudinaryV2.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "gallery", // optional
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
      images: uploadedImages,
    });

    res.status(200).json({ message: "Gallery created successfully", gallery });
  } catch (error) {
    console.error("Gallery upload error:", error);
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

app.delete("/api/gallery/image", async (req, res) => {
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
});

app.post("/api/role", async (req, res) => {
  try {
    const { role, password } = req.body;
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
      password, // In a real application, you should hash the password
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

app.use("/api/auth", router);

app.post("/api/menu", upload.single("menu-image"), async (req, res) => {
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
});

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

app.listen(process.env.PORT, () => {
  console.log(`Listening at port: ${process.env.PORT}.`);
  connectDB();
});
