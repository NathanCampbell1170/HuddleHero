import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, limit, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth, storage } from '../Firebase-config';
import "../styles/LeagueChats.css";
import Card from 'react-bootstrap/Card';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const LeagueChat = ({ selectedLeague }) => {
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState(null); // Initialize user state
    const [messages, setMessages] =useState([]);


    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);


    // Get league messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedLeague) {
                // Query the 'leagues' collection to find the document with the field 'id' equal to selectedLeague.id
                const leaguesQuery = query(collection(db, 'leagues'), where('id', '==', selectedLeague.id));
                const leaguesSnapshot = await getDocs(leaguesQuery);
    
                if (!leaguesSnapshot.empty) {
                    // Get the actual ID of the document
                    const leagueDocId = leaguesSnapshot.docs[0].id;
    
                    // Now you can create a reference to the 'messages' subcollection
                    const messagesRef = collection(db, 'leagues', leagueDocId, 'messages');
    
                    // Query the 'messages' subcollection to get the most recent 100 messages
                    const messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'), limit(100));
    
                    // Listen for real-time updates to the 'messages' subcollection
                    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
                        const newMessages = snapshot.docs.map((doc) => doc.data());
                        setMessages(newMessages); // Update the messages state
                    });
    
                    // Clean up the subscription when the component unmounts
                    return () => unsubscribe();
                } else {
                    console.log('No league document found with the given id.');
                }
            }
        };
    
        fetchMessages();
    }, [selectedLeague]); // Re-run this effect when selectedLeague changes
    
    

    //const messagesRef = collection(db, 'leagues', selectedLeague.id, 'messages');

    useEffect(() => {
        // Listen for changes in authentication state
        const unsubscribe = auth.onAuthStateChanged((user) => {
            // Set the user state when the authentication state changes
            setUser(user);
        });

        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
    }, []); // Empty dependency array ensures this effect runs only once

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage === '') return;
    
        if (user) {
            // Get the authenticated user's email
            const userEmail = user.email;
    
            // Query the 'users' collection to get the user's document
            const userQuery = query(collection(db, 'users'), where('email', '==', userEmail));
            const querySnapshot = await getDocs(userQuery);
    
            if (!querySnapshot.empty) {
                // Get the user's display name and profile picture from the user's document
                const userDocument = querySnapshot.docs[0].data();
                const { displayName, profilePicture, beginnerMode } = userDocument;
            
                // Query the 'leagues' collection to find the document with the field 'id' equal to selectedLeague.id
                const leaguesQuery = query(collection(db, 'leagues'), where('id', '==', selectedLeague.id));
                const leaguesSnapshot = await getDocs(leaguesQuery);
            
                if (!leaguesSnapshot.empty) {
                    // Get the actual ID of the document
                    const leagueDocId = leaguesSnapshot.docs[0].id;
            
                    // Now you can create a reference to the 'messages' subcollection
                    const messagesRef = collection(db, 'leagues', leagueDocId, 'messages');
                    let defaultPicture;
                    if (beginnerMode === true && !profilePicture) {
                        const defaultPFP = ref(storage, 'ProfilePictures/DefaultPFPBeginner.jpeg');
                        defaultPicture = await getDownloadURL(defaultPFP);
                    } else if (beginnerMode === false && !profilePicture) {
                        const defaultPFP = ref(storage, 'ProfilePictures/DefaultPFPExperienced.jpeg');
                        defaultPicture = await getDownloadURL(defaultPFP);
                    }
            
                    // And add a document to the subcollection
                    await addDoc(messagesRef, {
                        text: newMessage,
                        createdAt: serverTimestamp(),
                        user: displayName,
                        league: selectedLeague.id,
                        picture: profilePicture ? profilePicture : defaultPicture,
                    });
                    setNewMessage("");
                } else {
                    console.log('No league document found with the given id.');
                }
            } else {
                console.log('User document not found.');
            }
        } else {
            console.log('User not authenticated.');
        }
    };
    
    

    return (
        <div>
         
            <br />
            <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {messages.slice().reverse().map((message, index) => (
                <Card key={index} className="mb-2">
                    <Card.Body>
                        <div className="d-flex">
                            <Card.Img variant="left" src={message.picture} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                            <div style={{ marginLeft: '10px' }}>
                            <Card.Text style={{ overflowWrap: 'break-word', wordBreak: 'break-all' }}>
                                <strong>{message.user}:</strong> {message.text}
                                <br />
                                <small>{message.createdAt ? new Date(message.createdAt.seconds * 1000).toLocaleString() : ''}</small>
                            </Card.Text>

                            </div>
                        </div>
                    </Card.Body>
                </Card>
            ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={newMessage}
                    className="new-message-input"
                    placeholder="Type your message here..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={1} // Set the initial number of rows
                    style={{ resize: 'none', width: '100%', height: '15%' }} // Prevent manual resizing
                />
                <button type="submit" className="send-button">
                    Send
                </button>
            </form>
        </div>
    );
};

export default LeagueChat;
