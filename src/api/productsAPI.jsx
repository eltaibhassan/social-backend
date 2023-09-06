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
    return addDoc(productsRef, product);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const UpdateProductAPI = async (id, product) => {
  try {
    const productsRef = doc(collection(DB, 'products'), id);
    return setDoc(productsRef, product);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const DeleteProductAPI = async (id) => {
  try {
    const productsRef = doc(collection(DB, 'products'), id);
    return deleteDoc(productsRef);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { getProductsAPI, InsertProductAPI, UpdateProductAPI, DeleteProductAPI };
