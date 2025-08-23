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
    } catch (err: any) {
      console.error("Auth failed:", err.response?.data || err.message, err);
      alert("Auth failed");
    }
  };

  return (
    <form onSubmit={handleAuth}>
      {mode === "signup" && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">{mode === "signup" ? "Sign Up" : "Sign In"}</button>
    </form>
  );
}
