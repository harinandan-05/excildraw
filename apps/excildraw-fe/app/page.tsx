
"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 overflow-hidden flex flex-col items-center justify-center px-6">
      
      
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      
  
      <div className="relative z-10 max-w-3xl text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6">
          Welcome to Collab canvas
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Your collaborative whiteboard for creative ideas and team brainstorming. 
          Draw, share, and collaborate in real-time with your rooms.
        </p>

        <Link
          href="/signup"
          className="inline-block bg-green-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-green-600 transition"
        >
          Get Started
        </Link>
      </div>

      <div className="absolute bottom-10 right-10 hidden md:block">
        <img
          src="/landing-illustration.png"
          alt="Illustration"
          className="w-80"
        />
      </div>
    </div>
  );
}
