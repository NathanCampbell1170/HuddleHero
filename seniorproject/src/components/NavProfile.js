import react from "react"

import { query, where, getDocs, collection } from "firebase/firestore";
import { auth } from "../Firebase-config";
import { signOut } from "firebase/auth";


import Card from "react-bootstrap/Card"
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown';

import '../styles/NavProfile.css'

import defaultBeginner from "../Images/DefaultPFPBeginner.jpeg"
import defautlExperienced from "../Images/DefaultPFPExperienced.jpeg"


const NavProfile = ({ user, userDocument }) => {


    const showImage1 = userDocument && userDocument.beginnerMode;


    const logOut = async () => {
        await signOut(auth);
        localStorage.clear()
        window.location.href = "/";
      
        
      };

    return (
        <div className="NavProfile">
        <Card>
            <Card.Body>
                                            {/*userDocument.profilePicture*/}
            <Card.Img variant="top" className="profile-img" src={userDocument && userDocument.profilePicture ? userDocument.profilePicture : (showImage1 ? defaultBeginner : defautlExperienced)} />
                <Card.Text>
                </Card.Text>
                <div className="dropdown-container">
                <Dropdown className="profile-dropdown">
                    <Dropdown.Toggle id="profile-options" className="my-dropdown-toggle">
                        {userDocument ? userDocument.displayName : 'Loading...'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="my-dropdown-menu">
                        <Dropdown.Item className="my-dropdown-item" href="/">Home/Leagues</Dropdown.Item>
                        <Dropdown.Item className="my-dropdown-item" href="/myprofile">My Profile</Dropdown.Item>
                        <Dropdown.Item className="my-dropdown-item" href="/social">My Friends</Dropdown.Item>
                        <Dropdown.Item className="my-dropdown-item" onClick={logOut}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>

                </div>
    
            </Card.Body>
    
    
        </Card>
        </div>
    )
    


}

export default NavProfile