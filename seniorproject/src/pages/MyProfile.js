import React from "react";
import { useState, useEffect } from "react";
import { db, auth, signInWithGoogle } from "../Firebase-config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { storage } from "../Firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL} from "firebase/storage";

import Card from 'react-bootstrap/Card';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';





function MyProfile() {
const [userDisplayName, setUserDisplayName] = useState("")
const [user, setUser] = useState("")

const [imageUpload, setImageUpload] = useState(null);

const [imageUrl, setImageUrl] = useState("");

const [pfp, setPfp] = useState(null);

const fetchImage = async () => {
    const userId = localStorage.getItem("UserID");
    const imageRef = ref(storage, `ProfilePictures/${userId}`);
    try {
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
    } catch (error) {
        setImageUrl("holder.js/100px180"); // Replace with your placeholder image URL
    }
}




//const uploadImage = () => {
 //   if (profilePictureUpload == null) return;
 //   const imageRef = ref(storage, 'profilepicture/'+)

//};


    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
       
       setUser(currentUser)

       if (user) {
              console.log(localStorage.getItem('Displayname'));
              setUserDisplayName(localStorage.getItem('Displayname'))
              console.log( "The current user is " + localStorage.getItem("UserID"))
       }
       else {
        setUserDisplayName("")
       }
        })})

        const uploadProfilePicture = (event) => {
            const file = event.target.files[0];
            const userId = localStorage.getItem("UserID");
            const imageRef = ref(storage, `ProfilePictures/${userId}`);
            uploadBytes(imageRef, file).then(() => {
                console.log("picture uploaded");
                window.location.reload();
            });
        }

        useEffect(() => {
            fetchImage();
        }, []);
        

/*
        const imagesListRef = ref(storage, "ProfilePictures/");
        const uploadFile = () => {
          if (imageUpload == null) return;
          const imageRef = ref(storage, `ProfilePictures/${imageUpload.name + localStorage.getItem("UserID")}`);
          uploadBytes(imageRef, imageUpload).then(() => {
            alert("Image Uploaded")
             
            });
        ;
        };

*/


    return <> <div> <section style={{display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '10px'}}>
    
    <Card style={{ width: '18rem', backgroundColor: "lightgray", border: "ridge", borderWidth:"5px", textAlign: "center"   }} >
        <Card.Body>
            <Card.Img variant="top" src={imageUrl} /> 
            <Card.Title style = {{ paddingTop: "10px"}}>Current User: {userDisplayName}</Card.Title>
            <Card.Text style={{textAlign: "center"}}>
                <label>Email: </label> {user.email}
            </Card.Text>
        
        </Card.Body>
    </Card>

    <input
        type="file"
        onChange={uploadProfilePicture}
      />
      

    </section> </div>



    </>
}



export default MyProfile;