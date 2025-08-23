"use client"; 

import { useEffect, useState } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "../config";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [rooms, setRooms] = useState<unknown[]>([]);
  const [slug, setSlug] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    async function fetchRooms() {
      try {
        const res = await axios.get(`http://localhost:3001/api/v1/room`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(res.data.rooms);
      } catch (err) {
        console.error(err);
      }
    }

    fetchRooms();
  }, [router]);

  async function createRoom() {
  try {
    const token = localStorage.getItem("token");
    if (!slug.trim()) {
      alert("Please enter a room name.");
      return;
    }

    const res = await axios.post(
      `${HTTP_BACKEND}/room`,
      { slug },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Create room raw response:", res.data);

    const newRoom = {
      id: res.data,
      slug,
    };

    setRooms((prev) => [...prev, newRoom]);
    setSlug("");

    window.location.href = `http://localhost:3002/canvas/${newRoom.id}`;
  } catch (err: unknown) {
    console.error("Create room error:", err.response?.data || err.message);
    alert("Failed to create room. Check console for details.");
  }
}

  function joinRoom() {
    if (joinRoomId) {
      router.push(`/canvas/${joinRoomId}`);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    router.push("/signin");
  }

  return (
  <div className="flex min-h-screen bg-gray-100">
  {/* Sidebar */}
  <aside className="w-72 bg-white shadow-lg flex flex-col">
    <div className="p-4 border-b">
      <h2 className="text-xl font-bold">Your Rooms</h2>
    </div>

    <ul className="flex-1 bg-gray-50 p-2 overflow-y-auto">
      {rooms.length > 0 ? (
        rooms.map((room) => (
          <li
            key={room.id}
            className="p-3 mb-2 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-blue-100 hover:shadow-md transition"
            onClick={() => router.push(`/canvas/${room.id}`)}
          >
            <span className="font-medium text-gray-700">{room?.slug ?? "No slug"}</span>
            <p className="text-xs text-gray-500">ID: {room.id}</p>
          </li>
        ))
      ) : (
        <li className="text-gray-500 text-center py-4">No rooms yet</li>
      )}
    </ul>

    <div className="p-4 border-t">
      <button
        onClick={logout}
        className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  </aside>

  {/* Main Content */}
  <main className="flex-1 flex flex-col p-8">
    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

    <div className="flex flex-col gap-4 max-w-md">
      {/* Create Room */}
      <div className="flex gap-2">
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Room name"
          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={createRoom}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Create
        </button>
      </div>

      {/* Join Room */}
      <div className="flex gap-2">
        <input
          value={joinRoomId}
          onChange={(e) => setJoinRoomId(e.target.value)}
          placeholder="Enter room ID"
          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={joinRoom}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Join
        </button>
      </div>
    </div>
  </main>
</div>
  )
}