import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, addDoc, orderBy, query } from 'firebase/firestore';
import { firebase } from '../config';

const DB = getFirestore(firebase);

const getProductsAPI = async () => {
  try {
    const res = [];
    const productsRef = collection(DB, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const docRefs = await getDocs(q);
    docRefs.forEach((product) => {
      res.push({ id: product.id, ...product.data() });
    });
    return res;
  } catch (error) {
    return null;
  }
};

const InsertProductAPI = async (product) => {
  try {
    const productsRef = collection(DB, 'products');
    await addDoc(productsRef, product);
  } catch (error) {
    return null;
  }
};

const UpdateProductAPI = async (product) => {
  try {
    const productsRef = doc(collection(DB, 'products'), product.id);
    await setDoc(productsRef, product);
  } catch (error) {
    return null;
  }
};

const DeleteProductAPI = async (id) => {
  try {
    const productsRef = doc(collection(DB, 'products'), id);
    await deleteDoc(productsRef);
  } catch (error) {
    return null;
  }
};

export { getProductsAPI, InsertProductAPI, UpdateProductAPI, DeleteProductAPI };
