
import React from 'react'
import './Sidebar.css'
import threeDotsMenu from '../../assets/icons/three-dots-menu.svg'
import downArrow from '../../assets/icons/down.svg'
import newNoteIcon from '../../assets/icons/new-note.svg'
import archive from '../../assets/icons/archive.svg'
import unarchive from '../../assets/icons/unarchive.svg'
import trashIcon from '../../assets/icons/trash.svg'
import sidebarIcon from '../../assets/icons/sidebar.svg'

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
    const [sidebarVisible, setSidebarVisible] = React.useState<boolean>(true);
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
                <div className="top-controls">
                    <button
                        className="sidebar-toggle-btn icon-btn"
                        onClick={() => {
                            const next = !sidebarVisible;
                            setSidebarVisible(next);
                            const container = document.querySelector('.container');
                            if (container) {
                                if (next) container.classList.remove('sidebar-collapsed');
                                else container.classList.add('sidebar-collapsed');
                            }
                        }}
                        aria-pressed={!sidebarVisible}
                        title={sidebarVisible ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        <img src={sidebarIcon} alt={sidebarVisible ? "Collapse" : "Expand"} className="icon toggle-icon" />
                    </button>

                    <button
                        className="icon-btn"
                        onClick={onCreateNote}
                        aria-label="Create note"
                        title='New Note'
                    >
                        <img src={newNoteIcon} alt="new" className="icon toggle-icon" />
                    </button>
                </div>

                <a
                    className={`archive-toggle-btn${archiveOpen ? ' open' : ''}`}
                    onClick={() => setArchiveOpen((open) => !open)}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={archive} alt="archive" className="icon" />
                        <span>Archive</span>
                    </div>
                    <img
                        src={downArrow}
                        alt="toggle archive"
                        className="icon archive-arrow"
                    />
                </a>
                {archiveOpen && (
                    <div className="archive-list">
                        {archivedNotes.length > 0 ? (
                            archivedNotes.map(note => (
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
                                                <img src={unarchive} alt="unarchive" className="icon" />
                                                <span>Unarchive</span>
                                            </button>
                                            <button onClick={() => { setMenuOpenId(null); onDeleteNote?.(note.id); }}>
                                                <img src={trashIcon} alt="delete" className="icon" />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="archive-empty">Nothing here</div>
                        )}
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
                                    <img src={archive} alt="archive" className="icon" />
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