import { useEffect, useState } from "react";
import API from "../api/api";

function StickyNotes() {
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState("");

  // FETCH NOTES
  useEffect(() => {
    API.get("/sticky-notes").then((res) => setNotes(res.data));
  }, []);

  // ADD NOTE
  const addNote = async () => {
    if (!newNoteText.trim()) return;

    const res = await API.post("/sticky-notes", {
      items: [{ text: newNoteText, done: false }]
    });

    setNotes([...notes, res.data]);
    setNewNoteText("");
  };

  // ADD CHECKLIST ITEM
  const addItem = async (noteId, text) => {
    if (!text.trim()) return;

    const note = notes.find((n) => n._id === noteId);
    const updated = {
      ...note,
      items: [...note.items, { text, done: false }]
    };

    const res = await API.put(`/sticky-notes/${noteId}`, updated);

    setNotes(notes.map((n) => (n._id === noteId ? res.data : n)));
  };

  // TOGGLE CHECK
  const toggleItem = async (noteId, index) => {
    const note = notes.find((n) => n._id === noteId);

    const updated = {
      ...note,
      items: note.items.map((item, i) =>
        i === index ? { ...item, done: !item.done } : item
      )
    };

    const res = await API.put(`/sticky-notes/${noteId}`, updated);
    setNotes(notes.map((n) => (n._id === noteId ? res.data : n)));
  };

  // DELETE NOTE
  const deleteNote = async (id) => {
    await API.delete(`/sticky-notes/${id}`);
    setNotes(notes.filter((note) => note._id !== id));
  };

  return (
    <div>
      <h3>📝 Sticky Notes</h3>

      <input
        placeholder="Write important point..."
        value={newNoteText}
        onChange={(e) => setNewNoteText(e.target.value)}
      />
      <button onClick={addNote}>Add Note</button>

      <div style={styles.grid}>
        {notes.map((note) => (
          <div key={note._id} style={styles.note}>
            <button onClick={() => deleteNote(note._id)}>❌</button>

            {note.items.map((item, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleItem(note._id, index)}
                />
                <span
                  style={{
                    textDecoration: item.done ? "line-through" : "none"
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}

            <AddItemInput onAdd={(text) => addItem(note._id, text)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AddItemInput({ onAdd }) {
  const [text, setText] = useState("");

  return (
    <div>
      <input
        placeholder="Add checklist item"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          if (!text.trim()) return;
          onAdd(text);
          setText("");
        }}
      >
        ➕
      </button>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginTop: "15px"
  },
  note: {
    background: " #E3F2FD",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "2px 2px 6px rgba(0,0,0,0.2)"
  }
};

export default StickyNotes;
