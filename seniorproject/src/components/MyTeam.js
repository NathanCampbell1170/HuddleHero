import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, arrayRemove, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase-config'  // Import your Firebase config
import playersData from '../NFLStats/SeasonStatsPlayers.json';
import  Card  from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'

const MyTeam = ({ selectedLeague, user }) => {
  const [teamPlayers, setTeamPlayers] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        // Get a reference to the current league's document
        const leagueSnapshot = await getDocs(query(collection(db, 'leagues'), where('id', '==', selectedLeague.id)));
        const leagueDoc = leagueSnapshot.docs[0];
    
        // Get a reference to the team document with an owner field matching the user's email
        const teamsRef = collection(leagueDoc.ref, 'teams');
        const teamsSnapshot = await getDocs(query(teamsRef, where('owner', '==', user.email)));
        const teamDoc = teamsSnapshot.docs[0];
    
        // Set up the real-time listener
        const unsubscribe = onSnapshot(teamDoc.ref, async (snapshot) => {
          const teamData = snapshot.data();
    
          // Get the player data for each player in the team
          const teamPlayersData = playersData.filter(player => teamData.players.includes(player.PlayerID));
    
          setTeamPlayers(teamPlayersData);
        });
    
        // Clean up the listener when the component is unmounted
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching team: ", error);
        // Handle the error appropriately here
      }
    };
    fetchTeam();
  }, []);

  const dropPlayer = async (player) => {
    // Show a confirmation dialog
    const confirmDrop = window.confirm(`Are you sure you would like to drop ${player.Name}?`);
    
    // If the user clicks "OK", proceed with dropping the player
    if (confirmDrop) {
      // Get a reference to the current league's document
      const leagueRef = collection(db, 'leagues');
      const leagueSnapshot = await getDocs(query(leagueRef, where('id', '==', selectedLeague.id)));
      const leagueDoc = leagueSnapshot.docs[0];
  
      // Get a reference to the team document with an owner field matching the user's email
      const teamsRef = collection(leagueDoc.ref, 'teams');
      const teamsSnapshot = await getDocs(query(teamsRef, where('owner', '==', user.email)));
      const teamDoc = teamsSnapshot.docs[0];
  
      // Remove the player's PlayerID field from the players array inside of the team document
      await updateDoc(teamDoc.ref, {
        players: arrayRemove(player.PlayerID)
      });
    }
  };

  return (
    <div>
      {teamPlayers.map((player, index) => (
        <Card key={index} style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>{player.Name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{player.Position} - {player.Team}</Card.Subtitle>
            {/* Add more player stats here as Card.Text */}
            <Button variant="danger" onClick={() => dropPlayer(player)}>Drop</Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default MyTeam