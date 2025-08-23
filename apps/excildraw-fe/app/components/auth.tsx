"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Auth({ mode }: { mode: "signup" | "signin" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "signup") {
        await axios.post("http://localhost:3001/api/v1/signup", {
          name,
          email,
          password,
        });
        router.push("/signin");
      } else {
        await axios.post("http://localhost:3001/api/v1/signin", {
          email,
          password,
        });
        router.push("/dashboard");
      }
    } catch (err) {
      // Simple logging, works for both Axios and normal errors
      console.error(err);
      alert("Authentication failed. Check console for details.");
    }
  };

  return (
    <form onSubmit={handleAuth} className="flex flex-col gap-2 max-w-md">
      {mode === "signup" && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-2 border rounded"
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="p-2 border rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        {mode === "signup" ? "Sign Up" : "Sign In"}
      </button>
    </form>
  );
}
