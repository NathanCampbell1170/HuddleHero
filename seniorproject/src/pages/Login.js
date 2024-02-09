import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { db, auth, signInWithGoogle } from "../Firebase-config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

function Login() {
    const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setloginEmail] = useState("");
  const [loginPassword, setloginPassword] = useState("");
  const [userName, setUserName] = useState("")
  const [user, setUser] = useState("")
  const [userDisplayName, setUserDisplayName] = useState("")

  //const UserNameSearch = db.collection('users')
  

  const userCollection = collection(db, "users");


  useEffect(() => {
     onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser)
    //console.log(getUserDisplayName())
    console.log(user.email)
   // setUserDisplayName(getUserDisplayName().email)
   //setUserDisplayName(UserNameSearch.where('email', '==', user.email))
  })})


 /* const getUserDisplayName = async () => {
    query(userCollection, where("email", '==', user.email)) 
  }
*/

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
      } catch (error) {
        console.log(error.message);
      }
      createFullUser()
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
    await signOut(auth);
  };

    return <> <div>  </div>
    
        <h3> Register User </h3>
        <input placeholder="Email..." onChange={(event) => {setRegisterEmail(event.target.value)}} />
        <input placeholder="Password..." onChange={(event) => {setRegisterPassword(event.target.value)}} />
        <input placeholder="DisplayName" onChange={(event) => {setUserName(event.target.value)}} />
        <button onClick={register}> Register </button>
      

      <div>
        <h3> Log in </h3>
        <input placeholder="Email..." onChange={(event) => {setloginEmail(event.target.value)}} />
        <input placeholder="Password..."onChange={(event) => {setloginPassword(event.target.value)}} />

        <button onClick={logIn}> Log in </button>
      </div>

        {/*
        <button onClick={signInWithGoogle}> Sign in with Google </button>
*/}

      <div>
        <h4> Welcome back,   
        {" "+ userDisplayName}!</h4> &nbsp;
        <button onClick={logOut}> Log out </button>

    </div> </>
  ;

    

}



export default Login