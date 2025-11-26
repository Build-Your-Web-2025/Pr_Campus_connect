import { useState } from 'react';
import './CreateEvent.css';

const CreateEvent = ({ onCreateEvent }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await onCreateEvent(formData);
    if (result.success) {
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        department: ''
      });
      setShowForm(false);
    }
    setLoading(false);
  };

  if (!showForm) {
    return (
      <div className="create-event-toggle">
        <button onClick={() => setShowForm(true)} className="toggle-button">
          ➕ Create New Event
        </button>
      </div>
    );
  }

  return (
    <div className="create-event-card">
      <div className="create-event-header">
        <h3>Create New Event</h3>
        <button onClick={() => setShowForm(false)} className="close-button">✕</button>
      </div>
      
      <form onSubmit={handleSubmit} className="create-event-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Spring Career Fair"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              placeholder="e.g., Computer Science"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Event details..."
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date & Time *</label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Main Auditorium"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => setShowForm(false)} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;

