"use client";

import Link from "next/link";
import { RxCross1 } from "react-icons/rx";
import { useState } from "react";
import axios from "axios";
import GoogleButton from "./GoogleButton";
import { useAppContext } from "@/context/AppContext";

const SignUp = ({ setLoginisOpen, setSignUpisOpen }) => {
  const {fetchUserData} = useAppContext()
  const [formNumber, setFormNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const startCountdown = () => {
    setResendDisabled(true);
    let seconds = 60;
    setCountdown(seconds);

    const timer = setInterval(() => {
      seconds -= 1;
      setCountdown(seconds);

      if (seconds <= 0) {
        clearInterval(timer);
        setResendDisabled(false);
      }
    }, 1000);
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/verification/send-code", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      
      const json = await response.json();

      if (response.ok) {
        setFormNumber(2);
        startCountdown();
      } else {
        setError(json.error || "خطا در ارسال کد");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/verification/verify-code", {
        method: "POST",
        body: JSON.stringify({ code, email }),
        headers: { "Content-Type": "application/json" },
      });

      const json = await response.json();

      if (response.ok) {
        setFormNumber(3);
      } else {
        setError(json.error || "کد وارد شده صحیح نیست");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/user/send-code", { email });
      startCountdown();
    } catch (err) {
      setError("خطا در ارسال مجدد کد");
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/signup", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const json = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(json));
        fetchUserData()
        setSignUpisOpen(false);
      } else {
        setError(json.error || "خطا در ساخت حساب");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* فرم شماره ۱: وارد کردن ایمیل */}
      {formNumber === 1 && (
        <div className="bg-white text-black rounded-2xl p-8 flex flex-col gap-6 w-[350px] max-sm:w-[90%] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ">
          <RxCross1
            onClick={() => setSignUpisOpen(false)}
            className="w-5 h-5 cursor-pointer absolute top-4 right-4 text-black/40"
          />

          <p className="text-center font-[600]">Sign up to QuickCart</p>
          <p className="text-black/40 text-[15px] text-center">
            Welcome! please sign up to continue
          </p>

          <div className="mx-auto"><GoogleButton /></div>
          
          <div className="h-[1px] bg-black/20 w-[100%]"></div>
          <p className="text-black/40 text-center">or</p>

          <div>
            <label className="text-[15px]">Email address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              placeholder="enter your email address"
              className="border-[1px] border-black/40 py-1 px-2 rounded-[7px] w-[100%] mb-2"
            />
          </div>

          <button
            onClick={handleContinue}
            className="bg-black/80 cursor-pointer text-white rounded-[7px] py-1"
          >
            Continue
          </button>

          <div className="text-center flex items-center justify-center">
            <p className="text-black/40 text-[15px]">already have an account?</p>{" "}
            <p className="cursor-pointer"
              onClick={() => {
                setLoginisOpen(true), setSignUpisOpen(false);
              }}
            >
              Log in
            </p>
          </div>
        </div>
      )}

      {/* فرم شماره ۲: وارد کردن کد تأیید */}
      {formNumber === 2 && (
        <div className="bg-white text-black rounded-2xl p-8 flex flex-col gap-6 w-[350px] max-sm:w-[90%] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ">
          <RxCross1
            onClick={() => setSignUpisOpen(false)}
            className="w-5 h-5 cursor-pointer absolute top-4 right-4 text-black/40"
          />

          <p className="text-center font-[600]">Sign up to QuickCart</p>
          <p className="text-black/40 text-[15px] text-center">
            Enter the verification code
          </p>

          <div className="h-[1px] bg-black/20 w-[100%]"></div>

          <div>
            <label className="text-[15px]">Verification Code</label>
            <input
              onChange={(e) => setCode(e.target.value)}
              value={code}
              type="number"
              placeholder="enter verification code"
              className="border-[1px] border-black/40 py-1 px-2 rounded-[7px] w-[100%] mb-2"
            />
          </div>

          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendDisabled || loading}
            className="text-orange-500"
          >
            {resendDisabled ? `Resend (${countdown})` : "Resend Code"}
          </button>

          <button
            onClick={handleCodeSubmit}
            className="bg-black/80 cursor-pointer text-white rounded-[7px] py-1"
          >
            Submit code
          </button>
        </div>
      )}

            {/* فرم شماره ۳: ساخت حساب */}
      {formNumber === 3 && (
        <div className="bg-white text-black rounded-2xl p-8 flex flex-col gap-6 w-[350px] max-sm:w-[90%] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ">
          <RxCross1
            onClick={() => setSignUpisOpen(false)}
            className="w-5 h-5 cursor-pointer absolute top-4 right-4 text-black/40"
          />

          <p className="text-center font-[600]">Sign up to QuickCart</p>
          <p className="text-black/40 text-[15px] text-center">
            Welcome! please sign up to continue
          </p>

          <div className="h-[1px] bg-black/20 w-[100%]"></div>

          <div>
            <label className="text-[15px]">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="enter your password"
              className="border-[1px] border-black/40 py-1 px-2 rounded-[7px] w-[100%] mb-2"
            />
            <label className="text-[15px]">Username</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
              placeholder="enter your username"
              className="border-[1px] border-black/40 py-1 px-2 rounded-[7px] w-[100%]"
            />
          </div>

          <button
            onClick={createAccount}
            className="bg-black/80 cursor-pointer text-white rounded-[7px] py-1"
          >
            Create account
          </button>

          {error && (
            <p className="text-red-500 text-center text-sm">{error}</p>
          )}

          <div className="text-center flex items-center justify-center">
            <p className="text-black/40 text-[15px]">already have an account?</p>{" "}
            <p className="cursor-pointer"
              onClick={() => {
                setLoginisOpen(true), setSignUpisOpen(false);
              }}
            >
              Log in
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
