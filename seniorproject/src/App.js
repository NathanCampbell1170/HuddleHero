import { useState, useEffect } from "react";
import './App.css';
import {db, auth} from "./Firebase-config";
import { collection, getDocs } from "firebase/firestore"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
function App() {

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
    <div className="App">
    {/*{users.map((user) => {
      return <div> 
        {" "}
        <h1>First: {user.First_Name}</h1>
        <h1>Last: {user.Last_Name}</h1>
       </div>
    })}
    */}
      <div>
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


      <div>
        <h4> User signed in: </h4>
        {user?.email} &nbsp;
        <button onClick={logOut}> Log out </button>
      </div>

    </div>
  );
}

export default App;
