import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

// Create an event (admin only)
export const createEvent = async (title, description, date, location, department, createdBy) => {
  try {
    const eventRef = await addDoc(collection(db, 'events'), {
      title,
      description,
      date,
      location,
      department,
      createdBy,
      rsvps: [],
      rsvpCount: 0,
      createdAt: serverTimestamp()
    });
    return { success: true, eventId: eventRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all events
export const getEvents = async () => {
  try {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, events };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get events by department
export const getEventsByDepartment = async (department) => {
  try {
    const q = query(
      collection(db, 'events'),
      where('department', '==', department),
      orderBy('date', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, events };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// RSVP to an event
export const rsvpToEvent = async (eventId, userId, userName) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      return { success: false, error: 'Event not found' };
    }
    
    const eventData = eventDoc.data();
    const rsvps = eventData.rsvps || [];
    const isRSVPed = rsvps.some(rsvp => rsvp.userId === userId);
    
    if (isRSVPed) {
      // Cancel RSVP
      await updateDoc(eventRef, {
        rsvps: rsvps.filter(rsvp => rsvp.userId !== userId),
        rsvpCount: rsvps.length - 1
      });
      return { success: true, rsvped: false };
    } else {
      // RSVP
      await updateDoc(eventRef, {
        rsvps: arrayUnion({ userId, userName, rsvpedAt: serverTimestamp() }),
        rsvpCount: rsvps.length + 1
      });
      return { success: true, rsvped: true };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

