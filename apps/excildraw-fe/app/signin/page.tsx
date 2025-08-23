"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/v1/signin", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "Signin failed");
        console.error(err.response?.data || err.message);
      } else if (err instanceof Error) {
        alert(err.message);
        console.error(err.message);
      } else {
        alert("Signin failed");
        console.error(err);
      }
    }
  };

  return (
    <form onSubmit={handleSignin} className="flex flex-col gap-2 max-w-sm mx-auto mt-10">
      <h1 className="text-xl font-bold">Sign In</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        Sign In
      </button>
    </form>
  );
}
