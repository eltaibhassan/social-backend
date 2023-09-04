import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, addDoc, orderBy, query } from 'firebase/firestore';
import { firebase } from '../config';

const DB = getFirestore(firebase);

const getAssociationsAPI = async () => {
  try {
    const res = [];
    const associationsRef = collection(DB, 'associations');
    const q = query(associationsRef, orderBy('createdAt', 'desc'));
    const docRefs = await getDocs(q);
    docRefs.forEach((association) => {
      res.push({ id: association.id, ...association.data() });
    });
    return res;
  } catch (error) {
    return null;
  }
};

const InsertAssociationAPI = async (association) => {
  try {
    const associationsRef = collection(DB, 'associations');
    await addDoc(associationsRef, association);
  } catch (error) {
    return null;
  }
};

const UpdateAssociationAPI = async (association) => {
  try {
    const associationsRef = doc(collection(DB, 'associations'), association.id);
    await setDoc(associationsRef, association);
  } catch (error) {
    return null;
  }
};

const DeleteAssociationAPI = async (id) => {
  try {
    const associationsRef = doc(collection(DB, 'associations'), id);
    await deleteDoc(associationsRef);
  } catch (error) {
    return null;
  }
};

export { getAssociationsAPI, InsertAssociationAPI, UpdateAssociationAPI, DeleteAssociationAPI };
