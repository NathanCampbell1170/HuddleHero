import React, { useState, useEffect } from 'react';
import UserContext from './UserContext';
import { getDocs, query, where, collection } from 'firebase/firestore'; // import Firestore functions
import { auth, db } from "../Firebase-config";

function UserProvider({ children, user }) { // <-- Add user as a prop
  const [userDocument, setUserDocument] = useState(null);
  const userCollection = collection(db, "users"); // <-- Define userCollection

  useEffect(() => {
    async function fetchUserDocument() {
      // Fetch the user document here
      if (user) { // <-- Check if user is not null
        const displayNameQuery = query(userCollection, where("email", '==', user.email))
        const querySnapshot = await getDocs(displayNameQuery);
        const displayNameDocument = querySnapshot.docs[0];
        setUserDocument(displayNameDocument);
      }
    }

    fetchUserDocument();
  }, [user]); // <-- Add user as a dependency

  return (
    <UserContext.Provider value={userDocument}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
