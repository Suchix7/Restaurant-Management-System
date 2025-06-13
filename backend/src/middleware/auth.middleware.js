import jwt from "jsonwebtoken";
import UserAccess from "../models/useraccess.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserFromToken = async (req) => {
  const token = req.cookies.jwt;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await UserAccess.findOne({ _id: decoded.userId });
  return user;
};
export const requirePermission = (permission) => async (req, res, next) => {
  const user = await getUserFromToken(req); // Use auth token
  const role = await UserAccess.findOne({ role: user.role });
  if (!role.permissions.includes(permission)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
