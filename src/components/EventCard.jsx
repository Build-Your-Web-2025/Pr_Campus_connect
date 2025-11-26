import './EventCard.css';

const EventCard = ({ event, currentUserId, onRSVP }) => {
  const isRSVPed = event.rsvps?.some(rsvp => rsvp.userId === currentUserId) || false;
  const rsvpCount = event.rsvpCount || event.rsvps?.length || 0;

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="event-card">
      <div className="event-header">
        <h3 className="event-title">{event.title}</h3>
        {event.department && (
          <span className="event-department">{event.department}</span>
        )}
      </div>

      <div className="event-details">
        <div className="event-detail">
          <span className="detail-icon">📅</span>
          <span>{formatDate(event.date)}</span>
        </div>
        {event.location && (
          <div className="event-detail">
            <span className="detail-icon">📍</span>
            <span>{event.location}</span>
          </div>
        )}
      </div>

      {event.description && (
        <p className="event-description">{event.description}</p>
      )}

      <div className="event-footer">
        <div className="rsvp-count">
          <span className="rsvp-icon">👥</span>
          <span>{rsvpCount} {rsvpCount === 1 ? 'person' : 'people'} going</span>
        </div>
        <button
          className={`rsvp-button ${isRSVPed ? 'rsvped' : ''}`}
          onClick={() => onRSVP(event.id)}
        >
          {isRSVPed ? '✓ Going' : 'RSVP'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;

