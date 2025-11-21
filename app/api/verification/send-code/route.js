// app/api/user/send-code/route.js
import { NextResponse } from "next/server";
import Verification from "../../../../models/verificationModel";
import bcrypt from "bcryptjs";
import User from "../../../../models/UserModel";
import sendEmail from "../../../../lib/EmailSender";
import dbConnect from "@/config/db";

export async function POST(req) {
  try {
    await dbConnect()
    
    const { email } = await req.json();


    const check = await User.findOne({ email });

    if (check) {
      return NextResponse.json({ error: "این ایمیل قبلاً استفاده شده است" }, { status: 400 });
    }



    await Verification.deleteMany({ email });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const verification = new Verification({ email, code: hashedCode, expiresAt });
    await verification.save();

    await sendEmail({
      to: email,
      subject: "کد تأیید شما",
      text: `کد تأیید شما: ${code}\nاین کد تا 5 دقیقه معتبر است.`,
    });

    return NextResponse.json({ message: "کد تأیید ارسال شد" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
