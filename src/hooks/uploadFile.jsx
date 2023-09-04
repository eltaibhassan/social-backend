import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { uid } from 'uid';
import { storage } from '../config';

export const updattoFireBase = async (file, foldorName) => {
  if (!file) {
    alert('Please choose a file first!');
  }
  const storageRef = ref(storage, `/${foldorName}/${uid(16)}`);
  //  const storageRef = ref(storage, `/${foldorName}/${file.name}`);
  const snapshot = await uploadBytesResumable(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};
