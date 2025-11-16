import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../../../../models/UserModel";

// ساخت توکن
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// پاکسازی ورودی
const trimer = (value) => {
  return validator.trim(validator.escape(value).replace(" ", ""));
};

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    const newUsername = validator.trim(username);
    const newEmail = trimer(email);
    const newPassword = trimer(password);

    const account = await User.signup(newUsername, newEmail, newPassword);
    const token = createToken(account._id);

    return NextResponse.json({ id: account._id, token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
