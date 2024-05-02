import { collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { auth, db } from '../Firebase-config';

function LeagueInvites() {
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    const leagueInvitesRef = collection(db, 'leagueInvites');
    const q = query(leagueInvitesRef, where("to", "==", auth.currentUser.email), where("status", "==", "pending"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const invites = [];
      querySnapshot.forEach((doc) => {
        invites.push({ id: doc.id, ...doc.data() });
      });
      setInvites(invites);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleAcceptInvite = async (inviteId, leagueId) => {
    // Get a reference to the league invite document
    const inviteDocRef = doc(db, 'leagueInvites', inviteId);

    // Update the status field
    await updateDoc(inviteDocRef, {
      status: 'accepted'
    });

    // Query for the league document
    const leaguesRef = collection(db, 'leagues');
    const q = query(leaguesRef, where("id", "==", leagueId));
    const querySnapshot = await getDocs(q);
    const leagueDoc = querySnapshot.docs[0];

    if (!leagueDoc) {
      console.error('League not found');
      return;
    }

    // Add the current user to the league's members
    const leagueData = leagueDoc.data();
    const newMembers = [...(leagueData.members || []), auth.currentUser.email];
    console.log('New members:', newMembers); // Log the new members

    updateDoc(leagueDoc.ref, {
      members: newMembers
    }).then(async () => {
      console.log('Document updated'); // Log when the document is updated
      console.log("newMembers length: ", newMembers.length)
      console.log("amountofPlayers: ", leagueData.amountofPlayers)
      // Check if the league is full
      if (newMembers.length >= leagueData.amountofPlayers) {
        console.log('League is full'); // Log when the league is full

        // Get all pending invites to the league
        const leagueInvitesRef = collection(db, 'leagueInvites');
        const q = query(leagueInvitesRef, where("leagueId", "==", leagueId), where("status", "==", "pending"));
        const querySnapshot = await getDocs(q);

        // Delete all pending invites
        querySnapshot.forEach((docSnapshot) => {
          console.log('Deleting invite:', docSnapshot.id); // Log the id of the invite being deleted
          deleteDoc(docSnapshot.ref);
        });

      }
    });
  };





  const handleDeclineInvite = async (inviteId) => {
    // Get a reference to the league invite document
    const inviteDocRef = doc(db, 'leagueInvites', inviteId);

    // Delete the invite
    await deleteDoc(inviteDocRef);
  };



  return (
    <div className='invite-cards'>
      <Button variant="primary" disabled className='invite-league-button'><strong>League Invites</strong></Button>
      {invites.map((invite, index) => (
        <Card key={index} className="invite-card">
          <Card.Body>
            <Card.Title>League Invitation</Card.Title>
            <Card.Text>
              You have been invited to join league <strong>{invite.leagueName}</strong> by {invite.from}.
            </Card.Text>
            <Button className="button-accept" variant="primary" onClick={() => handleAcceptInvite(invite.id, invite.leagueId)}>Accept</Button>
            <Button className="button-decline" variant="secondary" onClick={() => handleDeclineInvite(invite.id)}>Decline</Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );



}

export default LeagueInvites;