import UserAccess from "../models/useraccess.model.js";
import { generateToken } from "../lib/util.js";
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

    const token = generateToken(userAccess._id, res);

    res.status(200).json({
      message: "Login successful",
      role: userAccess.role,
      token,
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
