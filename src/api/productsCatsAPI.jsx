import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, addDoc, orderBy, query } from 'firebase/firestore';
import { firebase } from '../config';

const DB = getFirestore(firebase);

const getProCatsAPI = async () => {
  try {
    const res = [];
    const proCatsRef = collection(DB, 'proCats');
    const q = query(proCatsRef, orderBy('createdAt', 'desc'));
    const docRefs = await getDocs(q);
    docRefs.forEach((proCat) => {
      res.push({ id: proCat.id, ...proCat.data() });
    });
    return res;
  } catch (error) {
    return null;
  }
};

const InsertProCatAPI = async (proCat) => {
  try {
    const proCatsRef = collection(DB, 'proCats');
    await addDoc(proCatsRef, proCat);
  } catch (error) {
    return null;
  }
};

const UpdateProCatAPI = async (proCat) => {
  try {
    const proCatsRef = doc(collection(DB, 'proCats'), proCat.id);
    await setDoc(proCatsRef, proCat);
  } catch (error) {
    return null;
  }
};

const DeleteProCatAPI = async (id) => {
  try {
    const proCatsRef = doc(collection(DB, 'proCats'), id);
    await deleteDoc(proCatsRef);
  } catch (error) {
    return null;
  }
};

export { getProCatsAPI, InsertProCatAPI, UpdateProCatAPI, DeleteProCatAPI };
