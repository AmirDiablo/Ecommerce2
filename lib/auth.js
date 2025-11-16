// lib/auth.js
import jwt from "jsonwebtoken";
import User from "../models/UserModel";
import connectDB from "../config/db";

export async function requireAuth(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("Authorization token required");

  const token = authHeader.split(" ")[1];
  const { _id } = jwt.verify(token, process.env.SECRET);

  await connectDB();
  const user = await User.findById(_id).select("_id");
  if (!user) throw new Error("Request is not authorized");

  return user;
}
