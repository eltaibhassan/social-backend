import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, addDoc, orderBy, query } from 'firebase/firestore';
import { firebase } from '../config';

const DB = getFirestore(firebase);

const getEventsAPI = async () => {
  try {
    const res = [];
    const eventsRef = collection(DB, 'events');
    const q = query(eventsRef, orderBy('createdAt', 'desc'));
    const docRefs = await getDocs(q);
    docRefs.forEach((event) => {
      res.push({ id: event.id, ...event.data() });
    });
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const InsertEventAPI = async (event) => {
  try {
    const eventsRef = collection(DB, 'events');
    return addDoc(eventsRef, event);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const UpdateEventAPI = async (id, event) => {
  try {
    const eventsRef = doc(collection(DB, 'events'), id);
    return setDoc(eventsRef, event);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const DeleteEventAPI = async (id) => {
  try {
    const eventsRef = doc(collection(DB, 'events'), id);
    return deleteDoc(eventsRef);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { getEventsAPI, InsertEventAPI, UpdateEventAPI, DeleteEventAPI };
