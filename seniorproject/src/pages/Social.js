import { useEffect, useState } from 'react';
import { auth, db } from "../Firebase-config";
import { addDoc, collection, getDocs, query, where, doc, updateDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import CreateLeague from './CreateLeague';
import LeagueCards from '../components/LeagueCards';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import "../styles/Social.css"

import FriendChat from '../components/FriendChat';

function Social() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSendRequest = async () => {
    // Add the friend request to Firestore
    const friendRequestsRef = collection(db, 'FriendRequests');
    await addDoc(friendRequestsRef, {
      from: auth.currentUser.email,
      to: email,
      message: message,
      status: 'pending'
    });

    // Close the modal and clear the form
    handleClose();
    setEmail('');
    setMessage('');
  };

  const handleAcceptRequest = async (requestID, fromEmail) => {
    // Get a reference to the friend request document
    const requestDocRef = doc(db, 'FriendRequests', requestID);
  
    // Update the status field
    await updateDoc(requestDocRef, {
      status: 'accepted'
    });
  
    // Get a reference to the Friends collection
    const friendsRef = collection(db, 'Friends');
  
    // Add a new document to the Friends collection
    await addDoc(friendsRef, {
      user1: auth.currentUser.email,
      user2: fromEmail
    });
  };

  const handleDeclineRequest = async (requestID) => {

    const requestDocRef = doc(db, 'FriendRequests', requestID);

    await deleteDoc(requestDocRef)
  }

  useEffect(() => {
    const friendRequestsRef = collection(db, 'FriendRequests');
    const q = query(friendRequestsRef, where("to", "==", auth.currentUser.email), where("status", "==", "pending"));
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      setRequests(requests);
    });
  
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);
  

  useEffect(() => {
    const friendsRef = collection(db, 'Friends');
    const q1 = query(friendsRef, where("user1", "==", auth.currentUser.email));
    const q2 = query(friendsRef, where("user2", "==", auth.currentUser.email));

    const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
      const friends = [];
      querySnapshot.forEach((doc) => {
        friends.push(doc.data().user2);
      });
      setFriends(friends);
    });

    const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
      const friends = [];
      querySnapshot.forEach((doc) => {
        friends.push(doc.data().user1);
      });
      setFriends(prevFriends => [...prevFriends, ...friends]);
    });

    // Clean up the listeners when the component unmounts
    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  return (
    
    <div className="main-content">
        <div className="add-friend-section">
    <Button variant="primary" className="add-friend-button" onClick={handleShow}>
      Add Friend
    </Button>

    <Modal show={show} onHide={handleClose} className="add-friend-modal">
      <Modal.Header closeButton>
        <Modal.Title>Add Friend</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Friend's Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control as="textarea" placeholder='Enter a greeting message here' rows={3} value={message} onChange={e => setMessage(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" className="button-decline" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" className="button-accept"  onClick={handleSendRequest}>
          Send Request
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
      <Container fluid>
        <Row className="justify-content-md-center">
            {requests.length > 0 && (
          <Card>
            <Card.Header><h1 className='friend-header'>Friend Invites</h1></Card.Header>
            <Card.Body className="friend-invite-cards">
              {requests.map((request, index) => (
                <Card key={index} className="friend-invite-card m-2">
                  <Card.Body>
                    <Card.Title>Friend Request</Card.Title>
                    <Card.Text>
                      <strong>From:</strong> {request.from} <br></br>
                      <strong>Message:</strong> {request.message}
                    </Card.Text>
                    <Button variant="primary" onClick={() => handleAcceptRequest(request.id, request.from)}>Accept</Button>
                    <Button variant="secondary" onClick={() => handleDeclineRequest(request.id)}>Decline</Button>
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        )}
        </Row>
        <hr />
        <Row className="justify-content-md-center">
          <Card>
            <Card.Header><h1 className='friend-header'>Friends List</h1></Card.Header>
            <Card.Body className="friend-cards">
              {friends.map((friendEmail, index) => (
                <Card key={index} className="friend-card m-2">
                  <Card.Body>
                    <Card.Title>{friendEmail}</Card.Title>
                    <FriendChat friendEmail={friendEmail} /> {/* Include the FriendChat component for each friend */}
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </div>
  );
  
  
  
  
  
  
}

export default Social;
