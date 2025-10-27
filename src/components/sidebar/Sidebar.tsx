
import React from 'react'
import './Sidebar.css'
import threeDotsMenu from '../../assets/icons/three-dots-menu.svg'
import downArrow from '../../assets/icons/down.svg'
import newNoteIcon from '../../assets/icons/new-note.svg'
import addIcon from '../../assets/icons/add.svg'
import trashIcon from '../../assets/icons/trash.svg'

interface Note {
  id: string;
  title: string;
  body: string;
  lastEdited: number;
  archived?: boolean;
}


interface SidebarProps {
  notes: Note[];
  selectedNoteId?: string | null;
  onNoteSelect?: (id: string) => void;
  onCreateNote?: () => void;
  onArchiveNote?: (id: string, archive?: boolean) => void;
  onDeleteNote?: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ notes, selectedNoteId, onNoteSelect, onCreateNote, onArchiveNote, onDeleteNote }) => {
  const [menuOpenId, setMenuOpenId] = React.useState<string | null>(null);
  const [archiveOpen, setArchiveOpen] = React.useState<boolean>(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const activeNotes = notes.filter(n => !n.archived);
  const archivedNotes = notes.filter(n => n.archived);

  React.useEffect(() => {
    if (!menuOpenId) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpenId]);

  return (
    <aside className="sidebar">
      <nav>
        <button 
          className="create-note-btn"
          onClick={onCreateNote}
        >
          <img src={newNoteIcon} alt="new" className="icon" />
          <span className="btn-label">New Note</span>
        </button>

        <button
          className={`archive-toggle-btn${archiveOpen ? ' open' : ''}`}
          onClick={() => setArchiveOpen((open) => !open)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src={addIcon} alt="archive" className="icon" />
            <span>Archive</span>
          </div>
          <img
            src={downArrow}
            alt="toggle archive"
            className="icon archive-arrow"
          />
        </button>
        {archiveOpen && archivedNotes.length > 0 && (
          <div className="archive-list">
            {archivedNotes.map(note => (
              <div className="sidebar-note-row archived" key={note.id}>
                <a
                  role="button"
                  className={note.id === selectedNoteId ? 'active' : ''}
                  onClick={() => onNoteSelect?.(note.id)}
                >
                  {note.title.trim() ? note.title : 'Untitled Note'}
                </a>
                <span
                  className="menu-trigger"
                  onClick={() => setMenuOpenId(menuOpenId === note.id ? null : note.id)}
                >
                  <img src={threeDotsMenu} alt="menu" className="icon" />
                </span>
                {menuOpenId === note.id && (
                  <div className="note-menu" ref={menuRef}>
                    <button onClick={() => { setMenuOpenId(null); onArchiveNote?.(note.id, false); }}>
                      <img src={addIcon} alt="unarchive" className="icon" />
                      <span>Unarchive</span>
                    </button>
                    <button onClick={() => { setMenuOpenId(null); onDeleteNote?.(note.id); }}>
                      <img src={trashIcon} alt="delete" className="icon" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeNotes.map(note => (
          <div className="sidebar-note-row" key={note.id}>
            <a
              role="button"
              className={note.id === selectedNoteId ? 'active' : ''}
              onClick={() => onNoteSelect?.(note.id)}
              style={{ width: '100%' }}
            >
              {note.title.trim() ? note.title : 'Untitled Note'}
            </a>
            <span
              className="menu-trigger"
              onClick={() => setMenuOpenId(menuOpenId === note.id ? null : note.id)}
            >
              <img src={threeDotsMenu} alt="menu" className="icon" />
            </span>
            {menuOpenId === note.id && (
              <div className="note-menu" ref={menuRef}>
                <button onClick={() => { setMenuOpenId(null); onArchiveNote?.(note.id, true); }}>
                  <img src={addIcon} alt="archive" className="icon" />
                  <span>Archive</span>
                </button>
                <button onClick={() => { setMenuOpenId(null); onDeleteNote?.(note.id); }}>
                  <img src={trashIcon} alt="delete" className="icon" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar