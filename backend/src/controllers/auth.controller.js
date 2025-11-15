import UserAccess from "../models/useraccess.model.js";
import { generateToken } from "../lib/util.js";
import jwt from "jsonwebtoken";
export const checkAuth = async (req, res) => {
  try {
    const { role, password } = req.body;
    const userAccess = await UserAccess.findOne({ role });
    if (!userAccess) {
      return res.status(404).json({ message: "Role not found" });
    }
    if (!role || !password) {
      return res
        .status(400)
        .json({ message: "Role and password are required" });
    }

    if (userAccess.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: userAccess._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("jwt", token, {
      httpOnly: true, // secure, JS can’t access
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // cross-site support
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.status(200).json({
      id: userAccess._id,
      message: "Login successful",
      role: userAccess.role,
      // token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
