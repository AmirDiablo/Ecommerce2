"use client";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

export default function GoogleButton({setLoginisOpen}) {
  const router = useRouter();
  const {fetchUserData} = useAppContext()

  return (
    <GoogleLogin
      shape="pill"
      onSuccess={async (credentialResponse) => {
        try {
          const decoded = jwtDecode(credentialResponse.credential);

          // ارسال اطلاعات به API Next.js
          const res = await fetch("/api/user/googleSign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              googleId: decoded.sub,
              email: decoded.email,
              username: decoded.name,
            }),
          });

          const data = await res.json();

          if (res.ok) {
            console.log("Server Response:", data);
            localStorage.setItem("user", JSON.stringify(data));
            fetchUserData()
            setLoginisOpen(false)
            router.push("/"); // جایگزین navigate("/")
          } else {
            console.error("Error:", data.error);
          }
        } catch (err) {
          console.error("Login Error:", err);
        }
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
}
