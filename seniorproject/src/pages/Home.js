import { useEffect, useState } from 'react';
import { auth, db } from "../Firebase-config";
import { addDoc, collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import CreateLeague from './CreateLeague';
import LeagueCards from '../components/LeagueCards';
import LeagueInvites from '../components/LeagueInvites';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion'

import MyHuddleHero from '../components/MyHuddleHero'
import HuddleHero from "../Images/Logo.jpeg"




function Home() {
  const [user, setUser] = useState(null);
  const userCollection = collection(db, "users");
  const [displayName, setDisplayName] = useState("")
  const [showComponent, setShowComponent] = useState(false);
  const [selectedLeague, setSelectedLeague] =useState(null)
  const [beginnerMode, setBeginnerMode] = useState(false);

  const handleClick = () => {
    setShowComponent(!showComponent);
  };

  async function fetchUser(user) {
    const fetchUserQuery = query(userCollection, where("email", '==', user.email));
            const querySnapshot = await getDocs(fetchUserQuery);
            const userSettingsDocument = querySnapshot.docs[0];
            setDisplayName(userSettingsDocument.data().displayName)
            console.log(userSettingsDocument.data().beginnerMode)
            setBeginnerMode(userSettingsDocument.data().beginnerMode)
  }

  useEffect(() => {
    document.title = "HuddleHero | Home";
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
      fetchUser(user)
    }
  

    });
    return () => unsubscribe();
  }, []);



  if (user) {
  return (

    <div className="main-content">

<Container fluid>
  <Row className="justify-content-md-center">
    <div className='welcome-message'>
    <h1>Welcome to HuddleHero, {displayName}</h1>
    {beginnerMode && (
      <MyHuddleHero imageSrc={HuddleHero}>
      Test My Huddle Hero
      </MyHuddleHero>
    )}
    </div>
  </Row>
  <hr />
  <Row>
    <Col md={6}>
      <div className="invite-cards">

      <LeagueInvites className="invite-card" /> {/* Use the LeagueInvites component here */}
        
      </div>
    </Col>

    {/* Right side - Existing Leagues */}
    <Col md={6}>
      <div className="league-cards">
        <CreateLeague beginnerMode={beginnerMode} />
        <LeagueCards user={user} beginnerMode={beginnerMode} setSelectedLeague={setSelectedLeague} className="league-card" />
      </div>
    </Col>
  </Row>
</Container>

{/* 
<Modal show={selectedLeague !== null} onHide={() => setSelectedLeague(null)}>
  <Modal.Header closeButton>
    <Modal.Title>{selectedLeague?.leagueName}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {/* Display league details here 
    Creator: {selectedLeague?.creator}
    {/* Add more league details 
  </Modal.Body>
</Modal>
*/}




</div>

);
  }
  else {
    return (
      <Container fluid>
      <Row className="justify-content-md-center">
        <div className='welcome-message'>
        <h1>Welcome to HuddleHero</h1>
        </div>
      </Row>
      <hr />
      <Row>
        {/* Left side - Dummy Invite Cards */}
        <Accordion className="About" defaultActiveKey="0">
      <Accordion.Item eventKey="1">
        <Accordion.Header>What is HuddleHero?</Accordion.Header>
        <Accordion.Body>
        HuddleHero is .........
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Why Choose HuddleHero?</Accordion.Header>
        <Accordion.Body>
        HuddleHero is .........
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header>What is HuddleHero?</Accordion.Header>
        <Accordion.Body>
        HuddleHero is .........
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4">
        <Accordion.Header>What is HuddleHero?</Accordion.Header>
        <Accordion.Body>
        HuddleHero is .........
        </Accordion.Body>
      </Accordion.Item>
      </Accordion>

        {/* Right side - Existing Leagues */}
        <Col md={6}>
          
          
        </Col>
      </Row>
    </Container>
    )
  }
}



export default Home;