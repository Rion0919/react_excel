import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, deleteDoc, doc, getDocs, collection } from 'firebase/firestore';

// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAXUmPRiXSiql1UkbcK_xFzTqlS-iI-tL8",
  authDomain: "moneygement-e31fa.firebaseapp.com",
  projectId: "moneygement-e31fa",
  storageBucket: "moneygement-e31fa.appspot.com",
  messagingSenderId: "15844401282",
  appId: "1:15844401282:web:964a12b300d21d8a1c549b",
  measurementId: "G-C2SMLZCRVG"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// get documents
export async function getDatas(){
  const datas = []
  const res = await getDocs(collection(db, 'data'))
  res.forEach((d) => {
    datas.push(d.data())
  })
  return datas
}

// add new document
export async function addData(id, title, date, price){
  const createdDoc = doc(db, 'data', id)
  const data = {
    id: id,
    title: title,
    date: date,
    price: price
  }
  await setDoc(createdDoc, data);
  console.log('new document name: ', id);
}

// delete document
export async function deleteData(id){
  await deleteDoc(doc(db, 'data', id))
  console.log("Deleted data of ", id)
}