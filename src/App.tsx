import { useState, useEffect } from 'react'
import Sidebar from './components/sidebar/Sidebar'
import Content from './components/content/Content'
import './App.css'

interface Note {
  id: string;
  title: string;
  body: string;
  lastEdited: number;
  archived?: boolean;
}

const sortNotesByLastEdited = (notesArray: Note[]) => {
  return [...notesArray].sort((a, b) => b.lastEdited - a.lastEdited);
};

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) return sortNotesByLastEdited(JSON.parse(savedNotes));

    // initialize with a Getting Started note on first run
    const welcome: Note = {
      id: Date.now().toString(),
      title: 'Getting Started',
      body: `Welcome to JotBook!

Here are a few tips to get you started:
- Click New Note Button to create a note.
- Start writing note — changes are saved automatically.
- Use the three-dot menu to access archive or delete options.
- Archived notes are available under "Archive" and can be unarchived from the three dot menu.

This app works offline (even on reload) and stores your notes locally in your browser using localStorage so they stay between sessions.
Enjoy taking notes!`,
      lastEdited: Date.now()
    };

    return [welcome];
  });
  
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(() => {
    const savedId = localStorage.getItem('selectedNoteId');
    return savedId || notes[0]?.id || null;
  });

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  // Save to localStorage whenever notes or selection changes
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (selectedNoteId) {
      localStorage.setItem('selectedNoteId', selectedNoteId);
    }
  }, [selectedNoteId]);

  const handleCreateNote = () => {
    // Check for any existing empty note (unarchived)
    const emptyNote = notes.find(note => 
      !note.archived && 
      note.title.trim() === '' && 
      note.body.trim() === ''
    );
    
    // If empty note exists, select it instead of creating new
    if (emptyNote) {
      setSelectedNoteId(emptyNote.id);
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      body: '',
      lastEdited: Date.now()
    };
    setNotes(prev => sortNotesByLastEdited([...prev, newNote]));
    setSelectedNoteId(newNote.id);
  };


  const handleTitleChange = (newTitle: string) => {
    if (!selectedNoteId) {
      // Create new note if typing in title with no note selected
      const newNote: Note = {
        id: Date.now().toString(),
        title: newTitle,
        body: '',
        lastEdited: Date.now()
      };
      setNotes(prev => sortNotesByLastEdited([...prev, newNote]));
      setSelectedNoteId(newNote.id);
      return;
    }
    
    setNotes(prevNotes => sortNotesByLastEdited(
      prevNotes.map(note => 
        note.id === selectedNoteId 
          ? { ...note, title: newTitle, lastEdited: Date.now() }
          : note
      )
    ));
  };

  const handleBodyChange = (newBody: string) => {
    if (!selectedNoteId) {
      // Create new note if typing in body with no note selected
      const newNote: Note = {
        id: Date.now().toString(),
        title: '',
        body: newBody,
        lastEdited: Date.now()
      };
      setNotes(prev => sortNotesByLastEdited([...prev, newNote]));
      setSelectedNoteId(newNote.id);
      return;
    }

    setNotes(prevNotes => sortNotesByLastEdited(
      prevNotes.map(note => 
        note.id === selectedNoteId 
          ? { ...note, body: newBody, lastEdited: Date.now() }
          : note
      )
    ));
  };

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId);
  };

  const handleArchiveNote = (noteId: string, archive: boolean = true) => {
    setNotes(prevNotes => prevNotes.map(note =>
      note.id === noteId ? { ...note, archived: archive } : note
    ));
    if (selectedNoteId === noteId && archive) {
      setSelectedNoteId(null);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
    }
  };

  return (
    <div className="container">
      <Sidebar 
        notes={notes} 
        selectedNoteId={selectedNoteId}
        onNoteSelect={handleNoteSelect}
        onCreateNote={handleCreateNote}
        onArchiveNote={handleArchiveNote}
        onDeleteNote={handleDeleteNote}
      />
      <Content 
        note={selectedNote}
        onTitleChange={handleTitleChange}
        onBodyChange={handleBodyChange}
      />
    </div>
  )
}

export default App