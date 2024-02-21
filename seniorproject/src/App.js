import { useEffect, useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { Auth } from "firebase/auth";
import Home from './pages/Home'
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import { auth, db } from "./Firebase-config";
import UserContext from './Functions/UserContext';
import Spinner from 'react-bootstrap/Spinner';
import { addDoc, collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore"; 

function App() {
  const [user, setUser] = useState(null);
  const userCollection = collection(db, "users");

  useEffect(() => {
    document.title = "HuddleHero | Home";
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const [userDisplayName, setUserDisplayName] = useState("")
  

  if (user) {
    return (
      <UserContext.Provider value={user}>
        <Router>
          <nav>
            <Link to="/"> Home </Link>
            {/*<Link to="/createpost"> CreatePost </Link>*/}
            <Link to="/myprofile">My Profile</Link>
          </nav>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/createpost" element={<CreatePost />}/>
            <Route path="/MyProfile" element ={<MyProfile />}/>
            <Route path="/login" element={<Login />}/>
          </Routes>
        </Router>
      </UserContext.Provider>
    );
  } else if (!user) {
    return (
      <UserContext.Provider value={user}>
        <Router>
          <nav>
            <Link to="/"> Home </Link>
            <Link to="/login"> Login </Link>
          </nav>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
          </Routes>
        </Router>
      </UserContext.Provider>
    );
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

export default App;