import React from "react";
import { useState, useEffect } from "react";
import { db, auth, signInWithGoogle } from "../Firebase-config";
import { addDoc, collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { storage } from "../Firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL} from "firebase/storage";

import '../styles/MyProfile.css';


import Card from 'react-bootstrap/Card';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';







function MyProfile() {


    async function fetchUserSettings() {
        const fetchUserQuery = query(userCollection, where("email", '==', user.email))
        const querySnapshot = await getDocs(fetchUserQuery);
        const userSettingsDocument = querySnapshot.docs[0];
        setDisplayName(userSettingsDocument.get("displayName"));
        if (userSettingsDocument.get("beginnerMode") ===true){
            setBeginnerModeSetting("Enabled")
        }
        else {
            setBeginnerModeSetting("Disabled")
        }
    }

    const userCollection = collection(db, "users");

const [beginnerModeSetting, setBeginnerModeSetting] = useState("")
const [displayName, setDisplayName] = useState("")
const [userDisplayName, setUserDisplayName] = useState("")
const [user, setUser] = useState("")

const [imageUrl, setImageUrl] = useState("");

const [pfp, setPfp] = useState(null);

const fetchImage = async () => {
    const userId = localStorage.getItem("UserID");
    const imageRef = ref(storage, `ProfilePictures/${userId}`);
    try {
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
    } catch (error) {
        setImageUrl("holder.js/100px180"); 
    }
}


    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
       
       setUser(currentUser)

       if (user) {
              console.log(localStorage.getItem('Displayname'));
              setUserDisplayName(localStorage.getItem('Displayname'))
              console.log( "The current user is " + localStorage.getItem("UserID"))
              fetchUserSettings()
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
        
        const [changeBeginnerMode,setChangeBeginnerMode] = useState(false);
        const handleCheckboxChange = (event) => {
            setChangeBeginnerMode(event.target.checked);
          };


        const [changeDisplayName, setChangeDisplayName] = useState("")
          const updateUserProfile = async () => {
            if (changeDisplayName==="") {
                setChangeDisplayName(displayName)

            }
            const fetchUserQuery = query(userCollection, where("email", '==', user.email));
            const querySnapshot = await getDocs(fetchUserQuery);
            const userSettingsDocument = querySnapshot.docs[0];

            const userRef = doc(db, 'users', userSettingsDocument.id)

            try {
                await updateDoc(userRef, { displayName: changeDisplayName, beginnerMode: changeBeginnerMode });
                window.location.reload();
            } catch (error) {
                console.error("Error updating user: ", error);
            }
          }



          const logOut = async () => {
            await setUserDisplayName("")
            await signOut(auth);
            localStorage.clear()
            window.location.href = "/";
          
          };
    return <> <div> 
    

    <Tabs defaultActiveKey="profile" id = "myProfile" fill>
        <Tab eventKey="profile" title="profile">
        <div className="profileTab">
            <Card style={{ width: '18rem', backgroundColor: "lightgray", border: "ridge", borderWidth:"5px", textAlign: "center"   }} >
                <Card.Body>
                    <Card.Img variant="top" src={imageUrl} /> 
                    <Card.Title style = {{ paddingTop: "10px"}}>Current User: {displayName}</Card.Title>
                    <Card.Text style={{textAlign: "center"}}>
                        <label>Email: </label> {user.email}
                        <label> Beginner Mode: </label> {beginnerModeSetting}
                        <label> Display Name </label> {displayName}
                        <button onClick={logOut}>Log Out</button>
                    </Card.Text>
                
                </Card.Body>
            </Card>
        </div>
        </Tab>
        <Tab eventKey="updateProfile" title="Update Profile Information">
        <div className="updateProfileTab">
            <Card style={{ width: '25rem', backgroundColor: "lightgray", border: "ridge", borderWidth:"5px", textAlign: "center"   }} >
                <div className="Changepfp">Change Profile Picture :<input type="file" accept="image/*" onChange={uploadProfilePicture}/></div>
                <Card.Img variant="top" src={imageUrl} /> 
                    <Card.Title style = {{ paddingTop: "10px"}}></Card.Title>
                    <Card.Text style={{textAlign: "center"}}>
                        
                    </Card.Text>
                    <input placeholder={displayName} onChange={(event) => {setChangeDisplayName(event.target.value)}}/>
                    <input type="checkbox" checked={changeBeginnerMode} onChange={handleCheckboxChange}/> {"Beginner Mode"}
                    <button onClick={updateUserProfile} >Upload Changes</button>
           </Card>
           </div>
        </Tab>
    </Tabs>

    

      

     </div>



    </>
}



export default MyProfile;