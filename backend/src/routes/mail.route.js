import express from "express";
import MailConfig from "../models/mailconfig.model.js";

const mailRouter = express.Router();

// POST - Create or Replace the Single MailConfig
mailRouter.post("/", async (req, res) => {
  try {
    const { email, pass } = req.body;

    // Delete any existing config
    await MailConfig.deleteMany({});

    // Create new config
    const config = new MailConfig({ email, pass });
    await config.save();

    res.status(201).json(config);
  } catch (error) {
    res.status(500).json({ error: "Failed to create MailConfig" });
  }
});

// GET - Fetch the current MailConfig
mailRouter.get("/", async (req, res) => {
  try {
    const config = await MailConfig.findOne();
    if (!config)
      return res.status(404).json({ message: "No mail config found" });
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch MailConfig" });
  }
});

// PUT - Update the existing MailConfig
mailRouter.put("/", async (req, res) => {
  try {
    const { email, pass } = req.body;

    const config = await MailConfig.findOne();
    if (!config)
      return res.status(404).json({ message: "MailConfig not found" });

    config.email = email || config.email;
    config.pass = pass || config.pass;

    await config.save();

    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ error: "Failed to update MailConfig" });
  }
});

// DELETE - Remove the MailConfig
mailRouter.delete("/", async (req, res) => {
  try {
    const config = await MailConfig.findOne();
    if (!config)
      return res.status(404).json({ message: "MailConfig not found" });

    await MailConfig.deleteMany({});
    res.status(200).json({ message: "MailConfig deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete MailConfig" });
  }
});

export default mailRouter;
