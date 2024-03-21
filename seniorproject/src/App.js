import { useEffect, useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { Auth } from "firebase/auth";
import Home from './pages/Home'
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import NavProfile from "./components/NavProfile"
import Social from "./pages/Social";
import { auth, db } from "./Firebase-config";
import Spinner from 'react-bootstrap/Spinner';
import { addDoc, collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore"; 
import LoadingWrapper from "./components/LoadingWrapper"
import Logo from './Images/Logo.jpeg'
import { Modal, Button } from "react-bootstrap";
import ResetPassword from "./components/ResetPassword";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const userCollection = collection(db, "users");
  const [show, setShow] = useState(false);
  const [userDocument, setUserDocument] = useState(null)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    document.title = "HuddleHero | Home";
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchUser(user)
      } else {
        console.error("No User is logged in")
      }
    });
    //setTimeout(() => setLoading(false), 1000); 
    return () => unsubscribe();
  }, []);

  async function fetchUser(user) {
    const fetchUserQuery = query(userCollection, where("email", '==', user.email));
            const querySnapshot = await getDocs(fetchUserQuery);
            const userSettingsDocument = querySnapshot.docs[0];
            setUserDocument(userSettingsDocument.data())
            setDisplayName(userSettingsDocument.data().displayName)
  }

  const [displayName, setDisplayName] = useState("")
  
  if (user) {
    return (
        <Router>
          <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>

          <img src={Logo} alt="Logo" className="logo" />
            {/*
            <Link to="/"> Home </Link>
            
            <Link to="/myprofile">My Profile</Link>
            <Link to="/Social">Social</Link>
    */}
            <NavProfile user={user} userDocument={userDocument} />
            </nav>
          <Routes>
          <Route path="/" element={<LoadingWrapper><Home /></LoadingWrapper>}/>
            <Route path="/MyProfile" element ={<LoadingWrapper><MyProfile /></LoadingWrapper>}/>
            <Route path="/login" element={<LoadingWrapper><Login /></LoadingWrapper>}/>
            <Route path="/Social" element ={<LoadingWrapper><Social /></LoadingWrapper>}/>

          </Routes>
          <div>
      
    </div>
         </Router> 
    );


  } else if (!user) {
    return (
        <Router>
          <nav>
            <Link to="/"> Home </Link>
            <Button variant="primary" onClick={handleShow}>
              Login
            </Button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Log in/Sign up</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Login /> {/* Your Login component goes here */}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </nav>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/reset-password" element={<ResetPassword />}/>
          </Routes>
        </Router>
    );
  }
}
export default App;
