import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { db, auth, signInWithGoogle } from "../Firebase-config";
import { addDoc, collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth";
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignInToast from "../toasts/SignInToast";
import Toast from 'react-bootstrap/Toast';
import Spinner from 'react-bootstrap/Spinner';
import { getStorage } from "firebase/storage";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab"

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

  const [confirmRegisterPassword, setConfirmRegisterPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);



  async function fetchUserDisplayName() {
    const displayNameQuery = query(userCollection, where("email", '==', user.email))
    const querySnapshot = await getDocs(displayNameQuery);
    const displayNameDocument = querySnapshot.docs[0];
    setUserDisplayName(displayNameDocument.get("displayName"));
    localStorage.setItem('BeginnerMode', displayNameDocument.get("beginnerMode"))
    if (querySnapshot.userUID == null)
    {
      console.log("No user UID")
      const userRef = doc(db, 'users', displayNameDocument.id)
      await updateDoc(userRef, { userUID: user.uid })
    }
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
      leagueCount: 0
    })
  }
    
  const register = async () => {
    if (registerPassword !== confirmRegisterPassword) {
      setPasswordsMatch(false);
      return;
    }
  
    try {
      const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      console.log(user);
        
      if (user) {
        // User logged in already or has just logged in.
        console.log(user.uid);
      }
  
      // Call the createFullUser function here, after the user is created
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setEmailAlreadyExists(true)
        console.log(error.message)
      }
      if (error.code === 'auth/weak-password') {
        setPasswordTooShort(true)
        console.log(error.message);
      }
      console.log(error.message)
    }
    finally {
      await createFullUser()
    }
  };
  
  
  

  const handleCheckboxChange = (event) => {
    setBeginnerMode(event.target.checked);
  };

  
  const logIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      window.location.href = "/"
      //setSignInToast(true)
      //setTimeout(() => setSignInToast(false), 5000)
      } catch (error) {
        if (error.code === 'auth/invalid-credential') {
          console.log('invalid log in')
          setBadSignIn(true)
        }
        console.log(error.message);
      }
  };

  const sendResetEmail = () => {
    sendPasswordResetEmail(auth, loginEmail)
      .then(() => {
        // Email sent.
        alert('Password reset email sent!');
      })
      .catch((error) => {
        // An error occurred.
        console.error(error);
      });
  };

  const toggleSignInToast = () => setSignInToast(!signInToast)

  const logOut = async () => {
    await setUserDisplayName("")
    await signOut(auth);
    localStorage.clear()
    window.location.href = "/";
  
    
  };
  if (!user) {
    return (
      <>
        <div>  </div>  
        { userDisplayName === "" && ( 
          <Tabs defaultActiveKey="login" id="uncontrolled-tab-example">
            <Tab eventKey="login" title="Sign In">
              <h3> Log in </h3>
              <input placeholder="Email..." onChange={(event) => {setloginEmail(event.target.value)}} />
              <input type="password" placeholder="Password..." onChange={(event) => {setloginPassword(event.target.value)}} />
              <button onClick={logIn}> Log in </button>
              <button onClick={sendResetEmail}> Forgot Password? </button>
              {badSignIn === true && (
                <Alert variant='danger' onClose={() => setBadSignIn(false)} dismissible>
                  Email/password was incorrect.
                </Alert>
              )}
            </Tab>
            <Tab eventKey="register" title="Sign Up">
              <h3> Register User </h3> 
              <input placeholder="Email..." onChange={(event) => {setRegisterEmail(event.target.value.toLowerCase())}} />
              <input type="password" placeholder="Password..." onChange={(event) => {setRegisterPassword(event.target.value)}} />
              <input type="password" placeholder="Confirm Password..." onChange={(event) => {setConfirmRegisterPassword(event.target.value)}} />
              {!passwordsMatch && (
                <Alert variant='danger' onClose={() => setPasswordsMatch(true)} dismissible>
                  Passwords do not match.
                </Alert>
              )}
              <input placeholder="DisplayName" onChange={(event) => {setUserName(event.target.value)}} />
              <button onClick={register}> Register </button>
              <br></br>
              <label>
                <input type="checkbox" checked={beginnerMode} onChange={handleCheckboxChange}/> {"Enable Fantasy Football Tutorial (for novice players)"}
              </label>
              {emailAlreadyExists === true && ( 
                <Alert variant='danger' onClose={() => setEmailAlreadyExists(false)} dismissible>
                  Account with this email address already exists.
                </Alert>
              )}
              {passwordTooShort === true && ( 
                <Alert variant='danger' onClose={() => setPasswordTooShort(false)} dismissible>
                  Passwords must be 6 characters long at minimum.
                </Alert>
              )}
            </Tab>
          </Tabs>
        )}
        <div>
        </div> 
      </>
    );
}

else if (user) {
  return <> <div>  </div>  
    <div>
    {userDisplayName !== "" && (
<h4>
  Welcome back, {userDisplayName}!
</h4>
)}
      <button onClick={logOut}> Log out </button>
  </div> 
  </>
;
} else {
  return (
    <>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </>
  );
}
}

export default Login