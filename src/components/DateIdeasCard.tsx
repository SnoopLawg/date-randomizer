import React, { useState } from 'react';
import '../styles/DateIdeasCard.css';

interface DateIdeasCardProps {
  onAddIdea: (idea: string) => void;
  ideas: string[];
  onRemoveIdea: (index: number) => void;
}

const DateIdeasCard: React.FC<DateIdeasCardProps> = ({ onAddIdea, ideas, onRemoveIdea }) => {
  const [newIdea, setNewIdea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIdea.trim()) {
      onAddIdea(newIdea.trim());
      setNewIdea('');
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header" style={{ backgroundColor: 'var(--primary)' }}>
        <h5 className="mb-0 text-white">Custom Date Ideas</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter a date idea..."
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
            />
            <button type="submit" className="btn" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
              Add
            </button>
          </div>
        </form>

        <div className="date-ideas-list">
          {ideas.map((idea, index) => (
            <div key={index} className="date-idea-item d-flex justify-content-between align-items-center mb-2">
              <span>{idea}</span>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onRemoveIdea(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateIdeasCard; 