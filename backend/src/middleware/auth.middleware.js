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
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded || !decoded.userId) {
    throw new Error("Invalid token");
  }

  const user = await UserAccess.findById(decoded.userId);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const requirePermission = (permission) => async (req, res, next) => {
  try {
    const user = await getUserFromToken(req);

    const roleDoc = await UserAccess.findOne({ role: user.role });

    if (
      !roleDoc ||
      !Array.isArray(roleDoc.permissions) ||
      !roleDoc.permissions.includes(permission)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error("Error in requirePermission:", err.message);

    if (
      err.message === "No token provided" ||
      err.message === "Invalid token" ||
      err.name === "JsonWebTokenError" ||
      err.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};
