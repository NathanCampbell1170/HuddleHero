import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { db, auth, signInWithGoogle } from "../Firebase-config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import fetchUserDisplayName from "../functions/fetchUserDisplayName";
function Login() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setloginEmail] = useState("");
  const [loginPassword, setloginPassword] = useState("");
  const [userName, setUserName] = useState("")
  const [userDisplayName, setUserDisplayName] = useState("")
  const [user, setUser] = useState("")
  const userCollection = collection(db, "users");

  async function fetchUserDisplayName() {
    const displayNameQuery = query(userCollection, where("email", '==', user.email))
    const querySnapshot = await getDocs(displayNameQuery);
    const displayNameDocument = querySnapshot.docs[0];
    setUserDisplayName(displayNameDocument.get("displayName"));
}

useEffect(() => {
  document.title = "HuddleHero | Login";
}, []);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
   
   setUser(currentUser)
   if (user) {
    fetchUserDisplayName()
          console.log(userDisplayName)
          localStorage.setItem('Displayname', userDisplayName)
          console.log(localStorage.getItem('Displayname'));

          

   }
   else {
    setUserDisplayName("")
   }
    })})
 

  const createFullUser = async () => { 
    await addDoc(userCollection, {
    email: registerEmail,
    displayName: userName
  })
}
  
  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      console.log(user);
      createFullUser()
      } catch (error) {
        console.log(error.message);
      }
      
  };


  
  const logIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log(user);
      } catch (error) {
        console.log(error.message);
      }
  };

  const logOut = async () => {
    await setUserDisplayName("")
    await signOut(auth);
    window.location.reload();
  
    
  };

    return <> <div>  </div>
    
    {userDisplayName === "" && ( <>
        <h3> Register User </h3> 
        <input placeholder="Email..." onChange={(event) => {setRegisterEmail(event.target.value)}} />
        <input type="password" placeholder="Password..." onChange={(event) => {setRegisterPassword(event.target.value)}} />
        <input placeholder="DisplayName" onChange={(event) => {setUserName(event.target.value)}} />
        <button onClick={register}> Register </button>
        </> )}

      <div>
      {userDisplayName === "" && ( <> 
        <h3> Log in </h3>
        <input placeholder="Email..." onChange={(event) => {setloginEmail(event.target.value)}} />
        <input type="password" placeholder="Password..."onChange={(event) => {setloginPassword(event.target.value)}} />

        <button onClick={logIn}> Log in </button>

        </> )}
      </div>


      <div>
      {userDisplayName !== "" && (
  <h4>
    Welcome back, {userDisplayName}!
  </h4>
)}
        <button onClick={logOut}> Log out </button>

    </div> </>
  ;

    

}



export default Login