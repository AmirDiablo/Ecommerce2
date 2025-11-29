import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../../../../models/UserModel";
import axios from "axios";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const trimer = (value) => {
  return validator.trim(validator.escape(value).replace(" ", ""));
};

export async function POST(req) {
  try {
    const { email, password, captchaToken } = await req.json();

    // بررسی وجود توکن کپچا
    if (!captchaToken) {
      return NextResponse.json(
        { error: "Captcha token is missing" },
        { status: 400 }
      );
    }

    // اعتبارسنجی کپچا با گوگل
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;

    const { data } = await axios.post(verifyUrl);

    if (!data.success) {
      return NextResponse.json(
        { error: "Captcha verification failed" },
        { status: 400 }
      );
    }

    // ادامه لاگین اگر کپچا معتبر بود
    const newEmail = trimer(email);
    const newPassword = trimer(password);

    const account = await User.login(newEmail, newPassword);
    const token = createToken(account._id);

    return NextResponse.json({ id: account._id, token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
