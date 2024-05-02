import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { auth, db, storage } from "../Firebase-config";
import "../styles/FriendChat.css";


function FriendChat({ friendEmail }) {
  const [show, setShow] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [messages]);

  // Get friend messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (friendEmail) {
        // Query the 'Friends' collection to find the document where the current user's email is 'user1' and friendEmail is 'user2'
        const friendsQuery1 = query(collection(db, 'Friends'), where('user1', '==', auth.currentUser.email), where('user2', '==', friendEmail));
        const friendsSnapshot1 = await getDocs(friendsQuery1);

        // Query the 'Friends' collection to find the document where the current user's email is 'user2' and friendEmail is 'user1'
        const friendsQuery2 = query(collection(db, 'Friends'), where('user1', '==', friendEmail), where('user2', '==', auth.currentUser.email));
        const friendsSnapshot2 = await getDocs(friendsQuery2);

        let friendDocId;
        if (!friendsSnapshot1.empty) {
          // Get the actual ID of the document
          friendDocId = friendsSnapshot1.docs[0].id;
        } else if (!friendsSnapshot2.empty) {
          // Get the actual ID of the document
          friendDocId = friendsSnapshot2.docs[0].id;
        } else {
          console.log('No friend document found with the given emails.');
          return;
        }

        // Now you can create a reference to the 'messages' subcollection
        const messagesRef = collection(db, 'Friends', friendDocId, 'messages');

        // Query the 'messages' subcollection to get the most recent 100 messages
        const messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'), limit(100));

        // Listen for real-time updates to the 'messages' subcollection
        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          const newMessages = snapshot.docs.map((doc) => doc.data());
          setMessages(newMessages); // Update the messages state
        });

        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
      }
    };

    fetchMessages();
  }, [friendEmail]); // Re-run this effect when friendEmail changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === '') return;

    // Query the 'Users' collection to get the current user's document
    const userQuery = query(collection(db, 'users'), where('email', '==', auth.currentUser.email));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      // Get the user's profilePicture and beginnerMode from the user's document
      const userDocument = userSnapshot.docs[0].data();
      let { profilePicture, beginnerMode } = userDocument;

      // If there is no profilePicture, set a default based on beginnerMode
      if (!profilePicture) {
        const defaultPFPRef = ref(storage, beginnerMode ? 'ProfilePictures/DefaultPFPBeginner.jpeg' : 'ProfilePictures/DefaultPFPExperienced.jpeg');
        profilePicture = await getDownloadURL(defaultPFPRef);
      }

      // Query the 'Friends' collection to find the document where the current user's email is 'user1' and friendEmail is 'user2'
      const friendsQuery1 = query(collection(db, 'Friends'), where('user1', '==', auth.currentUser.email), where('user2', '==', friendEmail));
      const friendsSnapshot1 = await getDocs(friendsQuery1);

      // Query the 'Friends' collection to find the document where the current user's email is 'user2' and friendEmail is 'user1'
      const friendsQuery2 = query(collection(db, 'Friends'), where('user1', '==', friendEmail), where('user2', '==', auth.currentUser.email));
      const friendsSnapshot2 = await getDocs(friendsQuery2);

      let friendDocId;
      if (!friendsSnapshot1.empty) {
        // Get the actual ID of the document
        friendDocId = friendsSnapshot1.docs[0].id;
      } else if (!friendsSnapshot2.empty) {
        // Get the actual ID of the document
        friendDocId = friendsSnapshot2.docs[0].id;
      } else {
        console.log('No friend document found with the given emails.');
        return;
      }

      // Now you can create a reference to the 'messages' subcollection
      const messagesRef = collection(db, 'Friends', friendDocId, 'messages');

      // Add a new document to the 'messages' subcollection
      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: new Date(),
        user: userDocument.displayName,
        picture: profilePicture
      });

      // Clear the newMessage state
      setNewMessage('');
    } else {
      console.log('No user document found with the current user\'s email.');
    }
  };


  return (
    <>
      <Button variant="primary" onClick={handleShow} className='friend-chat-button'>
        Message
      </Button>

      <Modal show={show} onHide={handleClose} className='friend-chat-page'>
        <Modal.Header closeButton>
          <Modal.Title>Chat with {friendEmail}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="friend-chat-container">
            {messages.slice().reverse().map((message, index) => (
              <Card key={index} className="friend-chat-card mb-2">
                <Card.Body>
                  <div className="d-flex">
                    <Card.Img variant="left" src={message.picture} className="friend-chat-card-image" />
                    <div className="friend-chat-card-text-container">
                      <Card.Text className="friend-chat-card-text">
                        <strong className="message-user">{message.user}:</strong> {message.text}
                        <br />
                        <small className="message-timestamp">{message.createdAt ? new Date(message.createdAt.seconds * 1000).toLocaleString() : ''}</small>
                      </Card.Text>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <Form onSubmit={handleSubmit} className="friend-chat-form">
            <Form.Control
              as="textarea"
              value={newMessage}
              className="new-friend-message-input"
              placeholder="Type your message here..."
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={1}
            />
            <Button type="submit" className="send-friend-button">
              Send
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );


}

export default FriendChat;
