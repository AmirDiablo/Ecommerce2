import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../../../../models/UserModel";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const trimer = (value) => {
  return validator.trim(validator.escape(value).replace(" ", ""));
};

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const newEmail = trimer(email);
    const newPassword = trimer(password);

    const account = await User.login(newEmail, newPassword);
    const token = createToken(account._id);

    return NextResponse.json({ id: account._id, token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
