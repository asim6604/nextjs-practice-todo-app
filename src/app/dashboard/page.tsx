import { cookies } from "next/headers";

interface Note {
    _id: string;
    title: string;
    description: string;
}

export default async function NotesPage() {
    // Fetch data on the server
    const cookieStore =  await cookies();
    const token = cookieStore.get("token")?.value;

    let notes: Note[] = [];

    if (token) {
        try {
            // Fetch notes from the API route
            const res = await fetch("http://localhost:3000/api/auth/getnotes", {
                headers: {
                    Cookie: `token=${token}`, // Pass the token cookie
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch notes");
            }

            const data = await res.json();
            notes = data.notes || []; // Ensure notes is an array
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Your Notes</h1>
            {notes.length === 0 ? (
                <p className="text-gray-500">No notes found.</p>
            ) : (
                <ul className="space-y-4">
                    {notes.map((note) => (
                        <li key={note._id} className="bg-white shadow-md p-4 rounded-md">
                            <h3 className="text-lg font-semibold">{note.title}</h3>
                            <p className="text-gray-600">{note.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}