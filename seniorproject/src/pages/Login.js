import React from "react";
import { useState, useEffect } from "react";
import { db, auth } from "../Firebase-config";
import { addDoc, collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth";
import Alert from 'react-bootstrap/Alert';
import "../styles/Login.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab"
import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Carousel from 'react-bootstrap/Carousel'

function Login() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setloginEmail] = useState("");
  const [loginPassword, setloginPassword] = useState("");
  const [userName, setUserName] = useState("")
  const [userDisplayName, setUserDisplayName] = useState("")
  const [user, setUser] = useState("")
  const userCollection = collection(db, "users");

  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false)
  const [passwordTooShort, setPasswordTooShort] = useState(false)
  const [badSignIn, setBadSignIn] = useState(false)



  const [beginnerMode,setBeginnerMode] = useState(false);

  const [confirmRegisterPassword, setConfirmRegisterPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);


  const [showTutorial, setShowTutorial] = useState(false);

  const handleClose = () => setShowTutorial(false);
  const handleShow = () => setShowTutorial(true);

  const images = require.context('../Images/HuddleHeroes', true, /\.jpe?g$/);
  const imageList = images.keys().map(image => images(image));




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
      return
    }
    try {
      const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);   
      if (user) {
      }
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
       await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      window.location.href = "/"
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
        alert('Password reset email sent!');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const logOut = async () => {
    await setUserDisplayName("")
    await signOut(auth);
    localStorage.clear()
    window.location.href = "/";
  
    
  };
  if (!user) {
    return (
        <div className="Login">  
        { userDisplayName === "" && ( 
      <Tabs defaultActiveKey="login" id="uncontrolled-tab-example">
        <Tab eventKey="login" title="Sign In">
          <h3> Log in </h3>
          <div className="login-inputs">
            <input placeholder="Email..." onChange={(event) => {setloginEmail(event.target.value)}} />
            <input type="password" placeholder="Password..." onChange={(event) => {setloginPassword(event.target.value)}} onKeyDown={event => {if(event.key === 'Enter') logIn()}} />
          </div>
          <div className="login-buttons">
            <button onClick={logIn}> Log in </button>
            <button onClick={sendResetEmail}> Forgot Password? </button>
          </div>
          {badSignIn === true && (
            <Alert variant='danger' onClose={() => setBadSignIn(false)} dismissible>
              Email/password was incorrect.
            </Alert>
          )}
        </Tab>
        <Tab eventKey="register" title="Sign Up">
          <h3> Register User </h3> 
          <div className="register-inputs">
            <input placeholder="Email..." onChange={(event) => {setRegisterEmail(event.target.value.toLowerCase())}} className="sign-up-input" />
            <input type="password" placeholder="Password..." onChange={(event) => {setRegisterPassword(event.target.value)}} className="sign-up-input"/>
            <input type="password" placeholder="Confirm Password..." onChange={(event) => {setConfirmRegisterPassword(event.target.value)}} onKeyDown={event => {if(event.key === 'Enter') register()}} className="sign-up-input" />
            <input placeholder="DisplayName" onChange={(event) => {setUserName(event.target.value)}} className="sign-up-input" maxLength={"20"}/>
          </div>
          <div className="register-checkbox">
  <label>
    <input type="checkbox" checked={beginnerMode} onChange={handleCheckboxChange} className="sign-up-checkbox"/> {"Enable Fantasy Football Tutorial (for novice players)"}
    <Button onClick={handleShow} style={{backgroundColor: 'grey', color: 'white', borderRadius: '50%', width: '20px', height: '20px', marginLeft: "2px", textAlign: 'center', padding: '0', fontSize: '0.8rem', fontWeight: 'bold'}}>?</Button>
  </label>
</div>

<Offcanvas show={showTutorial} onHide={handleClose}>
  <Offcanvas.Header closeButton>
    <Offcanvas.Title>Beginner Mode</Offcanvas.Title>
  </Offcanvas.Header>
  <Offcanvas.Body>
  The "My HuddleHero" feature is designed to make fantasy football more accessible for beginners. Many traditional fantasy football systems can be overwhelming for new players, often requiring assistance from more experienced peers. This can hinder the enjoyment of the game for both beginners and their friends or family members.

  "My HuddleHero" aims to alleviate this issue by allowing novice users to keep pace with more experienced players. This feature provides a more user-friendly experience, reducing the need for constant guidance from others and enabling beginners to enjoy the game at their own pace. This is recommended for users who are new to fantasy football or those who prefer a more guided experience.

  When the "My HuddleHero" feature is enabled, you will see a Huddle Hero on various pages of the site. Clicking on this Hero will give you more explanation on the function of a page, tutorials, suggestions, and more. This interactive guide will help you navigate the site and understand the various features and functionalities at your own pace.
          <br></br>
          <br></br>
          <h1 style={{textAlign: 'center'}}>Introducing the Huddle Heroes!</h1>
  <Carousel indicators={false}>
    {imageList.map((src, index) => (
      <Carousel.Item interval={2000} key={index}>
        <img
          className="d-block w-100"
          src={src}
          alt={`Slide ${index}`}
        />
      </Carousel.Item>
    ))}
  </Carousel>
</Offcanvas.Body>
</Offcanvas>
          <div className="register-button">
            <button onClick={register} className="sign-up-button"> Register </button>
          </div>
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
          {passwordsMatch === false && ( 
            <Alert variant='danger' onClose={() => setPasswordsMatch(true)} dismissible>
              Passwords do not match.
            </Alert>
          )}
        </Tab>
      </Tabs>
    )}

    </div>
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