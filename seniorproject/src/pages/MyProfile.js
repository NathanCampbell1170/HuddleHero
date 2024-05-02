import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { Carousel, Offcanvas } from "react-bootstrap";
import { auth, db, storage } from "../Firebase-config";


import '../styles/MyProfile.css';


import Card from 'react-bootstrap/Card';

import Button from 'react-bootstrap/Button';


import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const images = require.context('../Images/HuddleHeroes', true, /\.jpe?g$/);
const imageList = images.keys().map(image => images(image));


function MyProfile() {


    const [beginnerModeDefaultToggle, setbeginnerModeDefaultToggle] = useState(null)
    const [showTutorial, setShowTutorial] = useState(false);
    const isFirstRender = useRef(true); // This will be true only for the first render
    const handleClose = () => setShowTutorial(false);
    const handleShow = () => setShowTutorial(true);

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
        const fetchUserQuery = query(userCollection, where("email", '==', user.email));
        const querySnapshot = await getDocs(fetchUserQuery);
        const userSettingsDocument = querySnapshot.docs[0];
        console.log(userSettingsDocument)
        setPfp(userSettingsDocument.data().profilePicture)
        console.log(pfp)

        const userRef = doc(db, 'users', userSettingsDocument.id)


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
        })
    })

    const uploadProfilePicture = async (event) => {
        const file = event.target.files[0];
        const userId = localStorage.getItem("UserID");
        const imageRef = ref(storage, `ProfilePictures/${userId}`);
        // check if the file is an image
        if (file.type.startsWith("image/")) {
            // check if the file size is below 2.5 MB
            if (file.size < 2.5 * 1024 * 1024) {
                // upload the image
                await uploadBytes(imageRef, file);
                console.log("picture uploaded");

                // get the download URL
                const link = await getDownloadURL(imageRef);
                console.log("Download URL: ", link);
                await updatePFP(link)

                // save the URL to your database
                // ...

                //window.location.reload();
            } else {
                // throw an error for large file size
                alert("File size exceeds 2.5 MB");
            }
        } else {
            // throw an error for non-image file
            alert("File is not an image");
        }
        window.location.reload();
    };


    const updatePFP = async (link) => {
        try {
            console.log(link)
            const fetchUserQuery = query(userCollection, where("email", '==', user.email));
            const querySnapshot = await getDocs(fetchUserQuery);
            const userSettingsDocument = querySnapshot.docs[0];

            const userRef = doc(db, 'users', userSettingsDocument.id);
            await updateDoc(userRef, { profilePicture: link });
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };




    const [changeBeginnerMode, setChangeBeginnerMode] = useState(null);
    const [finalNameChange, setFinalNameChange] = useState(false);



    const handleCheckboxChange = (event) => {
        const newBeginnerMode = event.target.checked;
        setbeginnerModeDefaultToggle(newBeginnerMode);
        setChangeBeginnerMode(newBeginnerMode);

    };





    const [changeDisplayName, setChangeDisplayName] = useState("")

    const updateUserProfile = async () => {
        const fetchUserQuery = query(userCollection, where("email", '==', user.email));
        const querySnapshot = await getDocs(fetchUserQuery);
        const userSettingsDocument = querySnapshot.docs[0];

        const userRef = doc(db, 'users', userSettingsDocument.id);
        let updateData = {};

        // Only update beginnerMode if the checkbox value has changed and is not null
        if (changeBeginnerMode !== null && changeBeginnerMode !== userSettingsDocument.data().beginnerMode) {
            updateData.beginnerMode = changeBeginnerMode;
        } else {
            // If checkbox value hasn't changed or is null, retain the original value
            updateData.beginnerMode = userSettingsDocument.data().beginnerMode;
        }

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
        return <>
            <div className="my-profile-container">
                <Tabs defaultActiveKey="profile" id="myProfile" fill className="my-profile-customTabs">
                    <Tab eventKey="profile" title="Profile" className="my-profile-profileTab">
                        <Card className="my-profile-profileCard">
                            <Card.Body>
                                <Card.Img variant="top" src={pfp} className="my-profile-profileImage" />
                                <Card.Title className="my-profile-cardTitle">Current User: {displayName}</Card.Title>
                                <Card.Text className="my-profile-cardText">
                                    <div><label>Email: </label> {user.email}</div>
                                    <div><label> Beginner Mode: </label> {beginnerModeSetting}</div>
                                    <div><label> Display Name: </label> {displayName}</div>
                                    <button onClick={logOut} className="my-profile-logoutButton">Log Out</button>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Tab>
                    <Tab eventKey="updateProfile" title="Update Profile Information" className="my-profile-updateProfileTab">
                        <Card className="my-profile-profileCard">
                            <Card.Body>
                                <div className="my-profile-Changepfp">
                                    <label>Change Profile Picture:</label>
                                    <input type="file" accept="image/*" onChange={uploadProfilePicture} className="my-profile-fileInput" />
                                </div>
                                <Card.Img variant="top" src={pfp} className="my-profile-profileImage" />
                                <div className="my-profile-inputGroup">
                                    <label>Display Name:</label>
                                    <input placeholder={displayName} onChange={(event) => { setChangeDisplayName(event.target.value) }} className="my-profile-inputField" />
                                </div>
                                <div className="my-profile-checkboxGroup">
                                    <input type="checkbox" checked={beginnerModeDefaultToggle} onChange={handleCheckboxChange} id="beginnerModeCheckbox" />
                                    <label htmlFor="beginnerModeCheckbox">Enable My HuddleHero Beginner Mode</label>
                                    <Button onClick={handleShow} style={{ backgroundColor: 'grey', color: 'white', borderRadius: '50%', width: '20px', height: '20px', marginLeft: "2px", textAlign: 'center', padding: '0', fontSize: '0.8rem', fontWeight: 'bold' }}>?</Button>
                                </div>
                                <button onClick={updateUserProfile} className="my-profile-uploadChangesButton">Upload Changes</button>
                            </Card.Body>
                        </Card>
                    </Tab>
                </Tabs>


                <Offcanvas show={showTutorial} onHide={handleClose}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Beginner Mode</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        The "My HuddleHero" feature is designed to make fantasy football more accessible for beginners. Many traditional fantasy football systems can be overwhelming for new players, often requiring assistance from more experienced peers. This can hinder the enjoyment of the game for both beginners and their friends or family members.

                        "My HuddleHero" aims to alleviate this issue by allowing novice users to keep pace with more experienced players. This feature provides a more user-friendly experience, reducing the need for constant guidance from others and enabling beginners to enjoy the game at their own pace. This is recommended for users who are new to fantasy football or those who prefer a more guided experience.

                        When the "My HuddleHero" feature is enabled, you will see a Huddle Hero on various pages of the site. Clicking on this Hero will give you more explanation on the function of a page, tutorials, suggestions, and more. This interactive guide will help you navigate the site and understand the various features and functionalities at your own pace.
                        <br></br>
                        <br></br>
                        <h1 style={{ textAlign: 'center' }}>Introducing the Huddle Heroes!</h1>
                        <Carousel indicators={false}>
                            {imageList.map((src, index) => (
                                <Carousel.Item interval={2000} key={index}>
                                    <img
                                        className="d-block w-100"
                                        src={src}
                                        alt={`Slide ${index}`}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
        </>
    } else {
        return (<></>)
    }



}



export default MyProfile;