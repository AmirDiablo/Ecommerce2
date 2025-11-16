// app/api/user/verify-code/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Verification from "../../../../models/verificationModel";

export async function POST(req) {
  try {
    const { email, code } = await req.json();

    const verification = await Verification.findOne({ email });
    if (!verification) {
      return NextResponse.json({ error: "کد منقضی شده یا وجود ندارد" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(code, verification.code);
    if (!isMatch) {
      return NextResponse.json({ error: "کد وارد شده صحیح نیست" }, { status: 400 });
    }

    await Verification.deleteOne({ email });

    return NextResponse.json({ message: "ایمیل با موفقیت تأیید شد" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطا در تأیید کد" }, { status: 500 });
  }
}
