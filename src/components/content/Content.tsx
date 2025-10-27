import React from 'react'
import './Content.css'

interface Note {
  id: string;
  title: string;
  body: string;
  lastEdited: number;
}

interface ContentProps {
  note?: Note;
  onTitleChange?: (title: string) => void;
  onBodyChange?: (body: string) => void;
}

const Content: React.FC<ContentProps> = ({ note, onTitleChange, onBodyChange }) => {
  return (
    <main className="content">
        <div className="content-header">
      <textarea 
        name="note-heading" 
        id="note-heading-area" 
        placeholder="Add Title"
        value={note?.title ?? ''}
        maxLength={40}
        onChange={(e) => onTitleChange?.(e.target.value)}
      />
        </div>
        <textarea 
            name="note" 
            id="note-body-area" 
            placeholder="start typing...."
            value={note?.body || ''}
            onChange={(e) => onBodyChange?.(e.target.value)}
        />
    </main>
  )
}

export default Content