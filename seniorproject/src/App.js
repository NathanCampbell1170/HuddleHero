import { useEffect, useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { Auth } from "firebase/auth";
import Home from './pages/Home'
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import { auth, db } from "./Firebase-config";
import Spinner from 'react-bootstrap/Spinner';
import { addDoc, collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore"; 
import LoadingWrapper from "./components/LoadingWrapper"
import Logo from './images/Logo.jpeg'

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const userCollection = collection(db, "users");

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
            setDisplayName(userSettingsDocument.data().displayName)
  }

  const [displayName, setDisplayName] = useState("")
  
  
   if (user) {
    return (
        <Router>
          <nav style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={Logo} alt="Logo" className="logo" />
            <Link to="/"> Home </Link>
            {/*<Link to="/createpost"> CreatePost </Link>*/}
            <Link to="/myprofile">My Profile</Link>
            </nav>
          <Routes>
          <Route path="/" element={<LoadingWrapper><Home /></LoadingWrapper>}/>

            
            <Route path="/MyProfile" element ={<LoadingWrapper><MyProfile /></LoadingWrapper>}/>
            <Route path="/login" element={<LoadingWrapper><Login /></LoadingWrapper>}/>
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
            <Link to="/login"> Login </Link>
          </nav>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
          </Routes>
        </Router>

    );
  }
}
export default App;
