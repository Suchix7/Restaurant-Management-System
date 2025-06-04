import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import Venue from "./models/venue.model.js";
import cloudinary from "cloudinary";
import multer from "multer";
import Contact from "./models/contact.model.js";
import { sendEmailNotification } from "./lib/mailTemplate.js";
import Event from "./models/events.model.js";
import { Readable } from "stream";
import Gallery from "./models/gallery.model.js";
import UserAccess from "./models/useraccess.model.js";
import { generateToken } from "./lib/util.js";
import router from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

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
    let posterUrl = "";

    if (req.file) {
      const bufferStream = Readable.from(req.file.buffer);
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinaryV2.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "event-posters", // optional Cloudinary folder
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        bufferStream.pipe(stream);
      });

      posterUrl = result.secure_url;
    }

    const event = await Event.create({
      title,
      date,
      time,
      description,
      posterImage: posterUrl,
    });

    res.status(200).json({ message: "Event created successfully", event });
  } catch (error) {
    console.error(error);
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

app.delete("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/gallery", upload.any(), async (req, res) => {
  try {
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
      images: uploadedImages, // array of { url, public_id }
    });

    res.status(200).json({ message: "Gallery created successfully", gallery });
  } catch (error) {
    console.error("Gallery upload error:", error);
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

app.listen(process.env.PORT, () => {
  console.log(`Listening at port: ${process.env.PORT}.`);
  connectDB();
});
