import React from "react";
import { useState, useEffect, useRef } from "react";
import { db, auth, signInWithGoogle } from "../Firebase-config";
import { addDoc, collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { storage } from "../Firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import defaultImage from '../images/DefaultPFPExperienced.jpeg';

import '../styles/MyProfile.css';


import Card from 'react-bootstrap/Card';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';







function MyProfile() {


const [beginnerModeDefaultToggle, setbeginnerModeDefaultToggle] = useState(false)
const isFirstRender = useRef(true); // This will be true only for the first render

async function fetchUserSettings() {
    const fetchUserQuery = query(userCollection, where("email", '==', user.email));
    const querySnapshot = await getDocs(fetchUserQuery);
    const userSettingsDocument = querySnapshot.docs[0];
    setDisplayName(userSettingsDocument.get("displayName"));

    if (isFirstRender.current) { // Only run on the first render
        if (userSettingsDocument.data().beginnerMode == true) {
            setBeginnerModeSetting("Enabled");
            setbeginnerModeDefaultToggle(true);
        } else {
            setBeginnerModeSetting("Disabled");
            setbeginnerModeDefaultToggle(false);
        }
        isFirstRender.current = false; // Set to false after running
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
    const imageRef = ref(storage, `ProfilePictures/${user.uid}`);
    const fetchUserQuery = query(userCollection, where("email", '==', user.email));
            const querySnapshot = await getDocs(fetchUserQuery);
            const userSettingsDocument = querySnapshot.docs[0];

            const userRef = doc(db, 'users', userSettingsDocument.id)
    try {
        const url = await getDownloadURL(imageRef);
        if (!url) {
            throw new Error('Image not found');
        }
        setImageUrl(url);
        
    } catch (error) {
    
        const defaultImageRefBeginner = ref(storage, 'ProfilePictures/DefaultPFPBeginner.jpeg');
        const defaultImageRefExperienced = ref(storage, 'ProfilePictures/DefaultPFPExperienced.jpeg');
        if (userSettingsDocument.data().beginnerMode == true) {
            console.log("reached checkpoint 1")
        const url = await getDownloadURL(defaultImageRefBeginner)
        setImageUrl(url); // Replace with your placeholder image URL
        try {
            await updateDoc(userRef, { profilePicture: imageUrl });
        } catch (error) {
            console.error(error)
        }
    } else if (userSettingsDocument.data().beginnerMode == false) {
            console.log("reached checkpoint 2")
        const url = await getDownloadURL(defaultImageRefExperienced)
        setImageUrl(url); // Replace with your placeholder image URL
        try {
            await updateDoc(userRef, { profilePicture: imageUrl });
        } catch (error) {
            console.error(error)
        }
    }
            try {
                await updateDoc(userRef, { profilePicture: imageUrl });
            } catch (error) {
                console.error(error)
            }
        }
    
}




    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
       
       setUser(currentUser)

       if (user) {
              setUserDisplayName(localStorage.getItem('Displayname'))
              fetchUserSettings()
              fetchImage()
              
       }
       else {
        setUserDisplayName("")
       }
        })})

        const uploadProfilePicture = (event) => {
            const file = event.target.files[0];
            const userId = localStorage.getItem("UserID");
            const imageRef = ref(storage, `ProfilePictures/${userId}`);
            // check if the file is an image
            if (file.type.startsWith("image/")) {
              // check if the file size is below 2.5 MB
              if (file.size < 2.5 * 1024 * 1024) {
                // upload the image
                uploadBytes(imageRef, file).then(() => {
                  console.log("picture uploaded");
                  window.location.reload();
                });
              } else {
                // throw an error for large file size
                alert("File size exceeds 2.5 MB");
              }
            } else {
              // throw an error for non-image file
              alert("File is not an image");
            }
          };
          

      
          const [changeBeginnerMode,setChangeBeginnerMode] = useState(false);
        const [finalNameChange,setFinalNameChange] = useState(false);
        const handleCheckboxChange = (event) => {
            setbeginnerModeDefaultToggle(event.target.checked);
            setChangeBeginnerMode(event.target.checked)
          };
        


        const [changeDisplayName, setChangeDisplayName] = useState("")
        
        const updateUserProfile = async () => {
            const fetchUserQuery = query(userCollection, where("email", '==', user.email));
            const querySnapshot = await getDocs(fetchUserQuery);
            const userSettingsDocument = querySnapshot.docs[0];
        
            const userRef = doc(db, 'users', userSettingsDocument.id);
            let updateData = { beginnerMode: changeBeginnerMode };
        
            // Only add displayName to updateData if changeDisplayName is not an empty string
            if (changeDisplayName !== "") {
                updateData.displayName = changeDisplayName;
                localStorage.setItem("Displayname", changeDisplayName);
            }
        
            try {
                await updateDoc(userRef, updateData);
                window.location.reload();
            } catch (error) {
                console.error("Error updating user: ", error);
            }
        };
        
        



          const logOut = async () => {
            await setUserDisplayName("")
            await signOut(auth);
            localStorage.clear()
            window.location.href = "/";
          
          };
          if (user) {
    return <> <div> 
    

    <Tabs defaultActiveKey="profile" id = "myProfile" fill className="customTabs">
        <Tab eventKey="profile" title="Profile">
        <div className="profileTab">
            <Card style={{ width: '18rem', backgroundColor: "lightgray", border: "ridge", borderWidth:"5px", textAlign: "center"   }} >
                <Card.Body>
                    <Card.Img variant="top" src={imageUrl} /> 
                    <Card.Title style = {{ paddingTop: "10px"}}>Current User: {displayName}</Card.Title>
                    <Card.Text style={{textAlign: "center"}}>
                        <label>Email: </label> {user.email}
                        <label> Beginner Mode: </label> {beginnerModeSetting}
                        <label> Display Name: </label> {displayName}
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
                    Display Name: <input placeholder={displayName} onChange={(event) => {setChangeDisplayName(event.target.value)}}/>
                    <input type="checkbox" checked={beginnerModeDefaultToggle} onChange={handleCheckboxChange}/> {"Beginner Mode"}
                    <button onClick={updateUserProfile} >Upload Changes</button>
           </Card>
           </div>
        </Tab>
    </Tabs>

    

      

     </div>



    </>
          } else {
            return (<></>)
          }
}



export default MyProfile;