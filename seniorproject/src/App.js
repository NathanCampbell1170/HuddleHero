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
import Spinner from 'react-bootstrap/Spinner';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = "HuddleHero | Home";
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);


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
            <Route path="/myprofile" element ={<MyProfile />}/>
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
