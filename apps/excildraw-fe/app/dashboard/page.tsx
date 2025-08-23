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
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-72 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Your Rooms</h2>
        </div>
        <ul className="flex-1 bg-gray-50 p-2 overflow-y-auto">
          {rooms.length ? (
            rooms.map((room) => (
              <li
                key={room.id}
                className="p-3 mb-2 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-blue-100 hover:shadow-md transition"
                onClick={() => router.push(`/canvas/${room.id}`)}
              >
                <span className="font-medium text-gray-700">{room.slug}</span>
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

      <main className="flex-1 flex flex-col p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="flex flex-col gap-4 max-w-md">
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
  );
}
