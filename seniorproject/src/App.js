import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import { auth, db } from "./Firebase-config";
import Logo from './Images/Logo.jpeg';
import LoadingWrapper from "./components/LoadingWrapper";
import NavProfile from "./components/NavProfile";
import ResetPassword from "./components/ResetPassword";
import Home from './pages/Home';
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import Social from "./pages/Social";

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
          <Route path="/" element={<LoadingWrapper><Home /></LoadingWrapper>} />
          <Route path="/MyProfile" element={<LoadingWrapper><MyProfile /></LoadingWrapper>} />
          <Route path="/login" element={<LoadingWrapper><Login /></LoadingWrapper>} />
          <Route path="/Social" element={<LoadingWrapper><Social /></LoadingWrapper>} />

        </Routes>
        <div>

        </div>
      </Router>
    );


  } else if (!user) {
    return (
      <Router>
        <nav>
          <img src={Logo} alt="Logo" className="logo" />
          <Button variant="primary" onClick={handleShow} className="login-button">
            Log In/Sign Up
          </Button>
          <Modal show={show} onHide={handleClose} className="login-modal">
            <Modal.Header closeButton className="login-modal-header">
              <Modal.Title>Log In/Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body className="login-modal-body">
              <Login /> {/* Your Login component goes here */}
            </Modal.Body>
            <Modal.Footer className="login-modal-footer">
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    );
  }
}
export default App;
