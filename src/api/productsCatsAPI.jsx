import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, addDoc, query } from 'firebase/firestore';
import { firebase } from '../config';

const DB = getFirestore(firebase);

const getProCatsAPI = async () => {
  try {
    // , orderBy('createdAt', 'desc')
    const res = [];
    const proCatsRef = collection(DB, 'proCats');
    const q = query(proCatsRef);
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
    return addDoc(proCatsRef, proCat);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const UpdateProCatAPI = async (id, proCat) => {
  try {
    const proCatsRef = doc(collection(DB, 'proCats'), id);
    return setDoc(proCatsRef, proCat);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const DeleteProCatAPI = async (id) => {
  try {
    const proCatsRef = doc(collection(DB, 'proCats'), id);
    return deleteDoc(proCatsRef);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { getProCatsAPI, InsertProCatAPI, UpdateProCatAPI, DeleteProCatAPI };
