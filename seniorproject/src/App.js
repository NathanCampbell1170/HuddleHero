import { useEffect, useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { Auth } from "firebase/auth";
import Home from './pages/Home'
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import { auth } from "./Firebase-config";
import { UserContext } from './functions/UserContext';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = "HuddleHero | Home";
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={user}>
    <Router>
      <nav>
        <Link to="/"> Home </Link>
        {false && ( <Link to="/createpost"> CreatePost </Link>  )}
        { true && ( <Link to="/login"> Login </Link> )}
        {user && (<Link to="/myprofile">My Profile</Link>)}
      </nav>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/createpost" element={<CreatePost />}/>
        <Route path="/myprofile" element ={<MyProfile />}/>
        <Route path="/login" element={<Login />}/>
      </Routes>
    </Router>
    </UserContext.Provider>
  );
}

export default App;
