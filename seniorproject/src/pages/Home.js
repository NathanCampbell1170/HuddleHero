import { useEffect, useState } from 'react';
import { auth, db } from "../Firebase-config";
import { addDoc, collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";


function Home() {
  const [user, setUser] = useState(null);
  const userCollection = collection(db, "users");
  const [displayName, setDisplayName] = useState("")

  async function fetchUser(user) {
    const fetchUserQuery = query(userCollection, where("email", '==', user.email));
            const querySnapshot = await getDocs(fetchUserQuery);
            const userSettingsDocument = querySnapshot.docs[0];
            setDisplayName(userSettingsDocument.data().displayName)
  }

  useEffect(() => {
    document.title = "HuddleHero | Home";
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
      fetchUser(user)
    }
  

    });
    return () => unsubscribe();
  }, []);

  if (user) {
  return (
   <></> 
  )
  }
  else {
    <div>
      <h1 style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px'}}>
      Welcome to HuddleHero
      </h1>
    </div>
  }
}



export default Home;