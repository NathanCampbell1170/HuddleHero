import { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { db, auth, signInWithGoogle } from "./Firebase-config";
import { collection, getDocs } from "firebase/firestore"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import Home from './pages/Home'
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
function App() {



 /*
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setloginEmail] = useState("");
  const [loginPassword, setloginPassword] = useState("");

  const [user, setUser] = useState("")

  useEffect(() => {
     onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser)
  })})

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      console.log(user);
      } catch (error) {
        console.log(error.message);
      }
  };
  
  const logIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log(user);
      } catch (error) {
        console.log(error.message);
      }
  };

  const logOut = async () => {
    await signOut(auth);
  };
  
 */


  /*const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, 'users')

  useEffect(() => {

    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      console.log(data);
      setUsers(data.docs.map((doc) => ({...doc.data()}) ))
    }
    getUsers()
    
  }, [])
  */
  return ( 
  <Router>
    <nav>
      <Link to="/"> Home </Link>
      <Link to="/createpost"> CreatePost </Link>
      <Link to="/login"> Login </Link>
    </nav>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/createpost" element={<CreatePost />}/>
      <Route path="/login" element={<Login />}/>
    </Routes>
  </Router>
    //<div className="App">

    /*
    {{users.map((user) => {
      return <div> 
        {" "}
        <h1>First: {user.First_Name}</h1>
        <h1>Last: {user.Last_Name}</h1>
       </div>
    })}
    }
    
    */



 /*     <div>
        <h3> Register User </h3>
        <input placeholder="Email..." onChange={(event) => {setRegisterEmail(event.target.value)}} />
        <input placeholder="Password..." onChange={(event) => {setRegisterPassword(event.target.value)}} />

        <button onClick={register}> Register </button>
      </div>

      <div>
        <h3> Log in </h3>
        <input placeholder="Email..." onChange={(event) => {setloginEmail(event.target.value)}} />
        <input placeholder="Password..."onChange={(event) => {setloginPassword(event.target.value)}} />

        <button onClick={logIn}> Log in </button>
      </div>

        <button onClick={signInWithGoogle}> Sign in with Google </button>


      <div>
        <h4> User signed in: </h4>
        {user?.displayName} &nbsp;
        <button onClick={logOut}> Log out </button>
      </div>

    //</div>
  ;

*/
  );
}

export default App;
