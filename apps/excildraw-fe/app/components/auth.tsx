"use client";

import { useState } from "react";

export default function AuthPage({ isSignin }: { isSignin: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-[350px] border border-gray-200">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isSignin ? "Welcome Back" : "Create an Account"}
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg p-3 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg p-3 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg p-3 transition-all duration-200"
            onClick={() =>
              console.log(isSignin ? "Signing in" : "Signing up", email, password)
            }
          >
            {isSignin ? "Sign In" : "Sign Up"}
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-4">
          {isSignin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">
            {isSignin ? "Sign up" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}
