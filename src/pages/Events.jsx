import { useState, useEffect } from 'react';
import { getEvents, createEvent, rsvpToEvent, getEventsByDepartment } from '../firebase/events';
import { getUserProfile } from '../firebase/auth';
import EventCard from '../components/EventCard';
import CreateEvent from '../components/CreateEvent';
import SearchBar from '../components/SearchBar';
import './Events.css';

const Events = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  useEffect(() => {
    loadUserProfile();
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedDept]);

  const loadUserProfile = async () => {
    const result = await getUserProfile(user.uid);
    if (result.success) {
      setIsAdmin(result.data.isAdmin || false);
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    const result = selectedDept
      ? await getEventsByDepartment(selectedDept)
      : await getEvents();
    if (result.success) {
      setEvents(result.events);
    }
    setLoading(false);
  };

  const filterEvents = () => {
    let filtered = [...events];

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  const handleCreateEvent = async (eventData) => {
    const result = await createEvent(
      eventData.title,
      eventData.description,
      eventData.date,
      eventData.location,
      eventData.department,
      user.uid
    );
    if (result.success) {
      loadEvents();
    }
    return result;
  };

  const handleRSVP = async (eventId) => {
    await rsvpToEvent(eventId, user.uid, user.displayName);
    loadEvents();
  };

  const departments = [...new Set(events.map(e => e.department).filter(Boolean))];

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>Campus Events</h1>
        <p>Discover and RSVP to upcoming events</p>
      </div>

      <div className="events-controls">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search events..."
        />

        <div className="department-filters">
          <button
            className={`dept-filter ${selectedDept === '' ? 'active' : ''}`}
            onClick={() => {
              setSelectedDept('');
              loadEvents();
            }}
          >
            All Departments
          </button>
          {departments.map(dept => (
            <button
              key={dept}
              className={`dept-filter ${selectedDept === dept ? 'active' : ''}`}
              onClick={() => {
                setSelectedDept(dept);
                loadEvents();
              }}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {isAdmin && <CreateEvent onCreateEvent={handleCreateEvent} />}

      {loading ? (
        <div className="loading-events">Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="empty-state">
          <p>No events found. {isAdmin && 'Create one to get started!'}</p>
        </div>
      ) : (
        <div className="events-list">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              currentUserId={user.uid}
              onRSVP={handleRSVP}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;

