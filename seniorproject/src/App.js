import { useEffect } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
//import { db } from "./Firebase-config";
//import {collection} from "firebase/firestore"; 
//import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import Home from './pages/Home'
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
function App() {

  useEffect(() => {
    document.title = "HuddleHero | Home";
  }, []);

  //const [user, setUser] = useState("")
  //const [userDisplayName, setUserDisplayName] = useState("")

  //const userCollection = collection(db, "users");


 
  return (
    
  <Router>
    <nav>
      <Link to="/"> Home </Link>
      {false && ( <Link to="/createpost"> CreatePost </Link>  )}
      <Link to="/login"> Login </Link>
      <Link to="/myprofile">My Profile</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/createpost" element={<CreatePost />}/>
      <Route path="/myprofile" element ={<MyProfile />}/>
      <Route path="/login" element={<Login />}/>
    </Routes>
  </Router>
  
  );
}

export default App;