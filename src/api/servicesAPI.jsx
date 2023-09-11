import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, addDoc, orderBy, query } from 'firebase/firestore';
import { firebase } from '../config';

const DB = getFirestore(firebase);

const getServicesAPI = async () => {
  try {
    const res = [];
    const servicesRef = collection(DB, 'services');
    const q = query(servicesRef, orderBy('createdAt', 'desc'));
    const docRefs = await getDocs(q);
    docRefs.forEach((product) => {
      res.push({ id: product.id, ...product.data() });
    });
    return res;
  } catch (error) {
    return null;
  }
};

const InsertServiceAPI = async (product) => {
  try {
    const servicesRef = collection(DB, 'services');
    return addDoc(servicesRef, product);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const UpdateServiceAPI = async (id, product) => {
  try {
    const servicesRef = doc(collection(DB, 'services'), id);
    return setDoc(servicesRef, product);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const DeleteServiceAPI = async (id) => {
  try {
    const servicesRef = doc(collection(DB, 'services'), id);
    return deleteDoc(servicesRef);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { getServicesAPI, InsertServiceAPI, UpdateServiceAPI, DeleteServiceAPI };
