import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { db, auth, signInWithGoogle } from "../Firebase-config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignInToast from "../toasts/SignInToast";
import Toast from 'react-bootstrap/Toast';

//import fetchUserDisplayName from "../functions/fetchUserDisplayName";
function Login() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setloginEmail] = useState("");
  const [loginPassword, setloginPassword] = useState("");
  const [userName, setUserName] = useState("")
  const [userDisplayName, setUserDisplayName] = useState("")
  const [user, setUser] = useState("")
  const userCollection = collection(db, "users");
  const [show, setShow] = useState(false);

  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false)
  const [passwordTooShort, setPasswordTooShort] = useState(false)
  const [badSignIn, setBadSignIn] = useState(false)

  const [signInToast, setSignInToast] = useState(false);

  const [beginnerMode,setBeginnerMode] = useState(false);


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
          localStorage.setItem('UserID', user.uid)
          console.log(localStorage.getItem('Displayname'));

          

   }
   else {
    setUserDisplayName("")
   }
    })})
 

  const createFullUser = async () => { 
    await addDoc(userCollection, {
    email: registerEmail,
    displayName: userName,
    beginnerMode: beginnerMode,
    userUID: localStorage.getItem('UserID'),
    leagueCount: 0
  })
}
  
  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      console.log(user);
      createFullUser()
      } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
          //console.log ("Nathan, that email is already in use. Good Test")
          setEmailAlreadyExists(true)
          console.log(error.message)
        }
      if (error.code === 'auth/weak-password') {
          setPasswordTooShort(true)
          console.log(error.message);
      }
      console.log(error.message)
    }
  };

  const handleCheckboxChange = (event) => {
    setBeginnerMode(event.target.checked);
  };

  
  const logIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log(user);
      setSignInToast(true)
      setTimeout(() => setSignInToast(false), 5000)
      } catch (error) {
        if (error.code === 'auth/invalid-credential') {
          console.log('invalid log in')
          setBadSignIn(true)
        }
        console.log(error.message);
      }
  };

  const toggleSignInToast = () => setSignInToast(!signInToast)

  const logOut = async () => {
    await setUserDisplayName("")
    await signOut(auth);
    localStorage.clear()
    window.location.reload();
  
    
  };

    return <> <div>  </div>
    
    { userDisplayName === "" && ( <>
        <h3> Register User </h3> 
        <input placeholder="Email..." onChange={(event) => {setRegisterEmail(event.target.value)}} />
        <input type="password" placeholder="Password..." onChange={(event) => {setRegisterPassword(event.target.value)}} />
        <input placeholder="DisplayName" onChange={(event) => {setUserName(event.target.value)}} />
        <button onClick={register}> Register </button>
        <br></br>
        <label>
          <input type="checkbox" checked={beginnerMode} onChange={handleCheckboxChange}/> {"Enable Fantasy Football Tutorial (for novice players)"}
        </label>
        {emailAlreadyExists === true && ( <>
          <Alert variant='danger' onClose={() => setEmailAlreadyExists(false)} dismissible>
            Account with this email address already exists.
          </Alert>
        </>)}
        {passwordTooShort === true && ( <>
          <Alert variant='danger' onClose={() => setPasswordTooShort(false)} dismissible>
            Passwords must be 6 characters long at minimum.
          </Alert>
         </>)}
        </> )}

      <div>
      {userDisplayName === "" && ( <> 
        <h3> Log in </h3>
        <input placeholder="Email..." onChange={(event) => {setloginEmail(event.target.value)}} />
        <input type="password" placeholder="Password..."onChange={(event) => {setloginPassword(event.target.value)}} />

        <button onClick={logIn}> Log in </button>
        {badSignIn === true && ( <>
          <Alert variant='danger' onClose={() => setBadSignIn(false)} dismissible>
            Email/password was incorrect.
          </Alert>
         </>)}

      

        </> )}
       {/* <SignInToast show={signInToast} toggleShow={toggleSignInToast} /> */}
        
      </div>


      <div>
      {userDisplayName !== "" && (
  <h4>
    Welcome back, {userDisplayName}!
  </h4>
)}
        <button onClick={logOut}> Log out </button>

    </div> 
    
    {SignInToast}
    </>
  ;

    

}



export default Login