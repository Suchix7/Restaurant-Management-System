import jwt from "jsonwebtoken";
import UserAccess from "../models/useraccess.model.js";

export const protectRoute = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // optional: attach user info to request
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    return res.status(401).json({ message: "Unauthorized - Token error" });
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
