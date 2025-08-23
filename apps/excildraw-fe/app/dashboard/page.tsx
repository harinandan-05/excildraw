"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "../config";
import { useRouter } from "next/navigation";

interface Room {
  id: string;
  slug: string;
}

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [slug, setSlug] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/signin");

    axios
      .get(`${HTTP_BACKEND}/room`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRooms(res.data.rooms))
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch rooms.");
      });
  }, [router]);

  const createRoom = async () => {
    const token = localStorage.getItem("token");
    if (!slug.trim()) return alert("Please enter a room name.");
    try {
      const res = await axios.post(
        `${HTTP_BACKEND}/room`,
        { slug },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newRoom = { id: res.data, slug };
      setRooms((prev) => [...prev, newRoom]);
      setSlug("");
      router.push(`/canvas/${newRoom.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create room.");
    }
  };

  const joinRoom = () => {
    if (joinRoomId) router.push(`/canvas/${joinRoomId}`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

   return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex">

      <aside className="w-80 bg-white shadow-2xl flex flex-col rounded-tr-2xl rounded-br-2xl overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Your Rooms</h2>
        </div>

        <ul className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-3">
          {rooms.length ? (
            rooms.map((room) => (
              <li
                key={room.id}
                onClick={() => router.push(`/canvas/${room.id}`)}
                className="p-3 bg-white rounded-xl shadow-md cursor-pointer hover:shadow-xl hover:bg-blue-100 transition flex flex-col"
              >
                <span className="font-semibold text-gray-700 text-lg">{room.slug}</span>
                <span className="text-xs text-gray-500 mt-1">ID: {room.id}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-400 text-center py-6">No rooms yet</li>
          )}
        </ul>

        <div className="p-6 border-t">
          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>

        <div className="max-w-lg space-y-6">
          <div className="flex gap-3">
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Room name"
              className="flex-1 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
            <button
              onClick={createRoom}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition shadow-md"
            >
              Create
            </button>
          </div>

          <div className="flex gap-3">
            <input
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
              placeholder="Enter room ID"
              className="flex-1 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
            />
            <button
              onClick={joinRoom}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition shadow-md"
            >
              Join
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
