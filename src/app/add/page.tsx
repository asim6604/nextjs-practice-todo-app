"use client";

import { useState } from "react";

export default function AddNotePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Ensures cookies are sent
        body: JSON.stringify({ title, description }),
    });
    

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
      } else {
        setMessage("Note added successfully!");
        setTitle("");
        setDescription("");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to add note");
    }
  };

  return (
    <div>
      <h1>Add Note</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button type="submit">Add Note</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
