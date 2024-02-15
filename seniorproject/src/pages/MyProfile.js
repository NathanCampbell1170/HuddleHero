import React from "react";
import { useState, useEffect } from "react";
import { db, auth, signInWithGoogle } from "../Firebase-config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import Card from 'react-bootstrap/Card';

function MyProfile() {
const [userDisplayName, setUserDisplayName] = useState("")
const [user, setUser] = useState("")

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
       
       setUser(currentUser)

       if (user) {
              console.log(localStorage.getItem('Displayname'));
              setUserDisplayName(localStorage.getItem('Displayname'))
       }
       else {
        setUserDisplayName("")
       }
        })})





    return <> <div> <section style={{display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '10px'}}> </section> </div>
    
    <Card style={{ width: '18rem', backgroundColor: "lightgray", border: "ridge", justifyContent: 'center', alignItems: 'center', alignContent: 'center'   }} >
        <Card.Body>
            <Card.Title style = {{ paddingTop: "10px"}}>Current User: {userDisplayName}</Card.Title>
            <Card.Text>
                This is where user profile information will be displayed.
            </Card.Text>
        
        </Card.Body>
    </Card>





    </>
}



export default MyProfile;