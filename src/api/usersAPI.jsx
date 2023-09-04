import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, addDoc, orderBy, query } from 'firebase/firestore';
import { firebase } from '../config';

const DB = getFirestore(firebase);

const getUsersAPI = async () => {
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
    return null;
  }
};

const InsertUserAPI = async (event) => {
  try {
    const eventsRef = collection(DB, 'events');
    await addDoc(eventsRef, event);
  } catch (error) {
    return null;
  }
};

const UpdateUserAPI = async (event) => {
  try {
    const eventsRef = doc(collection(DB, 'events'), event.id);
    await setDoc(eventsRef, event);
  } catch (error) {
    return null;
  }
};

const DeleteUserAPI = async (id) => {
  try {
    const eventsRef = doc(collection(DB, 'events'), id);
    await deleteDoc(eventsRef);
  } catch (error) {
    return null;
  }
};

export { getUsersAPI, InsertUserAPI, UpdateUserAPI, DeleteUserAPI };
