import { db, auth, signInWithGoogle } from "../Firebase-config";

import { addDoc, collection, getDocs, query, where } from "firebase/firestore"; 


const userCollection = collection(db, "users");

async function fetchUserDisplayName(email) {
  const displayNameQuery = query(userCollection, where("email", '==', email))
  const querySnapshot = await getDocs(displayNameQuery);
  const displayNameDocument = querySnapshot.docs[0];
  //setUserDisplayName(displayNameDocument.get("displayName"));
}


export default fetchUserDisplayName;