"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/v1/signup", {
        name,       
        email,
        password,
      });
      router.push("/signin");
    } catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    
    console.error(err.response?.data || err.message);
    alert(err.response?.data?.error || "Signup failed");
  } else if (err instanceof Error) {
    
    console.error(err.message);
    alert(err.message);
  } else {
    console.error(err);
    alert("Signup failed");
  }
}

  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-2 max-w-sm mx-auto mt-10">
      <h1 className="text-xl font-bold">Sign Up</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 rounded"
      />
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
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Sign Up
      </button>
    </form>
  );
}
