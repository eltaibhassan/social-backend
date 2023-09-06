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

const InsertUserAPI = async (user) => {
  try {
    const usersRef = collection(DB, 'users');
    return addDoc(usersRef, user);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const UpdateUserAPI = async (user) => {
  try {
    const usersRef = doc(collection(DB, 'users'), user.uid);
    return setDoc(usersRef, user);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const DeleteUserAPI = async (id) => {
  try {
    const eventsRef = doc(collection(DB, 'events'), id);
    return deleteDoc(eventsRef);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { getUsersAPI, InsertUserAPI, UpdateUserAPI, DeleteUserAPI };
