import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, addDoc, orderBy, query } from 'firebase/firestore';
import { firebase } from '../config';

const DB = getFirestore(firebase);

const getNewsCatsAPI = async () => {
  try {
    const res = [];
    const newsCatsRef = collection(DB, 'newsCats');
    const q = query(newsCatsRef, orderBy('createdAt', 'desc'));
    const docRefs = await getDocs(q);
    docRefs.forEach((nCat) => {
      res.push({ id: nCat.id, ...nCat.data() });
    });
    return res;
  } catch (error) {
    return null;
  }
};

const InsertNewsCatsAPI = async (nCat) => {
  try {
    const newsCatsRef = collection(DB, 'newsCats');
    await addDoc(newsCatsRef, nCat);
  } catch (error) {
    return null;
  }
};

const UpdateNewsCatsAPI = async (nCat) => {
  try {
    const newsCatsRef = doc(collection(DB, 'newsCats'), nCat.id);
    await setDoc(newsCatsRef, nCat);
  } catch (error) {
    return null;
  }
};

const DeleteNewsCatsAPI = async (id) => {
  try {
    const newsCatsRef = doc(collection(DB, 'newsCats'), id);
    await deleteDoc(newsCatsRef);
  } catch (error) {
    return null;
  }
};
export { getNewsCatsAPI, InsertNewsCatsAPI, UpdateNewsCatsAPI, DeleteNewsCatsAPI };
