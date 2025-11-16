// middleware.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { error: "Authorization token required" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.SECRET);
    return NextResponse.next(); // اجازه ادامه درخواست
  } catch (error) {
    return NextResponse.json(
      { error: "Request is not authorized" },
      { status: 401 }
    );
  }
}

// فقط روی مسیرهای خاص اجرا بشه
export const config = {
  matcher: ["/api/protected/:path*"], 
};
