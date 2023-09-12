import { getFirestore, collection, doc, getDocs, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { firebase } from '../config';
import { myUploadFile } from './pubFunction';

const DB = getFirestore(firebase);

const getAdvertisesAPI = async () => {
  try {
    const res = [];
    const advertisesRef = collection(DB, 'advertises');
    const advertiseDocs = await getDocs(advertisesRef);
    advertiseDocs.forEach((advertise) => {
      res.push({ id: advertise.id, ...advertise.data() });
    });
    return res;
  } catch (error) {
    return null;
  }
};

const InsertAdvertiseAPI = async (advertise) => {
  try {
    const advertiseRef = collection(DB, 'advertises');
    return addDoc(advertiseRef, advertise);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const UpdateAdvertiseAPI = async (id, advertise) => {
  try {
    const advertisesRef = doc(collection(DB, 'advertises'), id);
    return await setDoc(advertisesRef, advertise);
  } catch (error) {
    return null;
  }
};

const DeleteAdvertiseAPI = async (id) => {
  try {
    const advertisesRef = doc(collection(DB, 'advertises'), id);
    const res = await deleteDoc(advertisesRef);
    return res;
  } catch (error) {
    return null;
  }
};

export { getAdvertisesAPI, InsertAdvertiseAPI, UpdateAdvertiseAPI, DeleteAdvertiseAPI };
