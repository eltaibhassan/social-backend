import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  addDoc,
  orderBy,
  query,
  limit,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { firebase } from '../config';

const DB = getFirestore(firebase);

const getNewsAPI = async () => {
  try {
    const res = [];
    const newsRef = collection(DB, 'news');
    const q = query(newsRef, orderBy('createdAt', 'desc'));
    const docRefs = await getDocs(q);
    docRefs.forEach((item) => {
      res.push({ id: item.id, ...item.data() });
    });
    return res;
  } catch (error) {
    return null;
  }
};

const InsertNewsAPI = async (item) => {
  try {
    const newsRef = collection(DB, 'news');
    await addDoc(newsRef, item);
  } catch (error) {
    return null;
  }
};

const UpdateNewsAPI = async (item) => {
  try {
    const newsRef = doc(collection(DB, 'news'), item.id);
    await setDoc(newsRef, item);
  } catch (error) {
    return null;
  }
};

const DeleteNewsAPI = async (id) => {
  try {
    const newsRef = doc(collection(DB, 'news'), id);
    await deleteDoc(newsRef);
  } catch (error) {
    return null;
  }
};

export { getNewsAPI, InsertNewsAPI, UpdateNewsAPI, DeleteNewsAPI };
