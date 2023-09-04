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

const AddAdvertiseAPI = async (advertise) => {
  let fImageUrl = 'Nil';
  try {
    const { title, desc, link, imgUrl, comName, startDate, endDate, createdAt } = advertise;
    if (imgUrl !== 'Nil') {
      fImageUrl = await myUploadFile(imgUrl, 'newAdvertise');
    }

    const dbRef = collection(DB, 'advertises');
    const data = {
      title,
      desc,
      link,
      imgUrl: fImageUrl,
      comName,
      startDate,
      endDate,
      createdAt,
    };
    const res = await addDoc(dbRef, data);
    return res;
  } catch (error) {
    return null;
  }
};

const UpdateAdvertiseAPI = async (advertise) => {
  try {
    // if (advertise.imgUrl === 'Published') {
    //   await shareToSocialMedia(advertise.title, advertise.imgUrl, '');
    // }
    const advertisesRef = doc(collection(DB, 'advertises'), advertise.id);
    const res = await setDoc(advertisesRef, advertise);
    return res;
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

export { getAdvertisesAPI, AddAdvertiseAPI, UpdateAdvertiseAPI, DeleteAdvertiseAPI };
