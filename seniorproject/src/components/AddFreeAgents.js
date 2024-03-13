import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, where, startAfter, limit, getDocs, arrayUnion, doc, updateDoc, getDoc, onSnapshot, documentId } from 'firebase/firestore';
import {db} from "../Firebase-config";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "../styles/AddPlayers.css"

import playersData from '../NFLStats/SeasonStatsPlayers.json'

const AddFreeAgents = ({ selectedLeague, user }) => {
  const [players, setPlayers] = useState([]);
  const [position, setPosition] = useState('All Positions');
  const [fetchedCount, setFetchedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlayers = async (position) => {
    setIsLoading(true);

    // Get the current league's document using selectedLeague.id
    const leagueSnapshot = await getDocs(query(collection(db, 'leagues'), where('id', '==', selectedLeague.id)));
    const leagueDoc = leagueSnapshot.docs[0];

    // Get a reference to the teams subcollection
    const teamsRef = collection(leagueDoc.ref, 'teams');

    // Fetch all teams in the current league
    const teamsSnapshot = await getDocs(teamsRef);

    // Gather all player IDs from these teams
    let takenPlayerIDs = [];
    teamsSnapshot.docs.forEach(doc => {
      const teamData = doc.data();
      takenPlayerIDs.push(...teamData.players);
    });

    let newPlayers = playersData;

    // If position is not "all", filter by position
    if (position && position !== 'All Positions') {
      newPlayers = newPlayers.filter(player => player.Position === position);
    }

    // Filter out players who are in the selectedLeague
    newPlayers = newPlayers.filter(player => !takenPlayerIDs.includes(player.PlayerID));

    // Get the next 10 players starting from fetchedCount
    const nextPlayers = newPlayers.slice(fetchedCount, fetchedCount + 10);
    setPlayers(prevPlayers => [...prevPlayers, ...nextPlayers]);

    // Update fetchedCount
    setFetchedCount(prevCount => prevCount + nextPlayers.length);

    setIsLoading(false);
  };

  useEffect(() => {
    const fetchLeagueAndPlayers = async () => {
      // Get the current league's document using selectedLeague.id
      const leagueSnapshot = await getDocs(query(collection(db, 'leagues'), where('id', '==', selectedLeague.id)));
      const leagueDoc = leagueSnapshot.docs[0];
  
      // Get a reference to the teams subcollection
      const teamsRef = collection(leagueDoc.ref, 'teams');
  
      // Set up the real-time listener
      const unsubscribe = onSnapshot(teamsRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" || change.type === "modified") {
            // If a team is added or modified, remove the taken players from the players array
            const teamData = change.doc.data();
            setPlayers(prevPlayers => prevPlayers.filter(player => !teamData.players.includes(player.PlayerID)));
          }
        });
      });
  
      // Fetch the players initially
      await fetchPlayers(position);
  
      // Clean up the listener when the component is unmounted or `position` changes
      return () => unsubscribe();
    };
  
    fetchLeagueAndPlayers();
  }, [position]);

  const addPlayer = async (player) => {
    // Get a reference to the current league's document
    const leagueRef = collection(db, 'leagues');
    const leagueSnapshot = await getDocs(query(leagueRef, where('id', '==', selectedLeague.id)));
    const leagueDoc = leagueSnapshot.docs[0];
  
    // Get a reference to the team document with an owner field matching the user's email
    const teamsRef = collection(leagueDoc.ref, 'teams');
    const teamsSnapshot = await getDocs(query(teamsRef, where('owner', '==', user.email)));
    const teamDoc = teamsSnapshot.docs[0];
    const teamData = teamDoc.data();
  
    // Calculate the maximum roster size
    let maxRosterSize = 0;
    if (selectedLeague && selectedLeague.rosterSettings) {
      maxRosterSize = Object.values(selectedLeague.rosterSettings).reduce((a, b) => a + b, 0);
    }
  
    // Check if the current player's roster is full
    if (teamData.players && teamData.players.length >= maxRosterSize) {
      alert('Your roster is full!');
      return;
    }
    
    // Add the player's PlayerID field to the players array inside of the team document
    await updateDoc(teamDoc.ref, {
      players: arrayUnion(player.PlayerID)
    });
  };
  

  const loadMore = () => {
    if (!isLoading) {  // Only fetch more players if not currently loading
      console.log('Load more triggered');
      fetchPlayers(position);
    }
  };

  const handlePositionChange = (event) => {
    console.log('Position changed:', event.target.value);
    const newPosition = event.target.value;
    setPosition(newPosition);
    setPlayers([]);  // Reset players
    setFetchedCount(0);  // Reset fetchedCount
  };

  return (
    <div>
      <Form>
        <Form.Control as="select" value={position} onChange={handlePositionChange}>
          {['All Positions', 'QB', 'RB', 'WR', 'TE', 'K', 'DEF'].map((position) => (
            <option key={position} value={position}>{position}</option>
          ))}
        </Form.Control>
      </Form>
      <div className='free-agents'>
            {players.map((player, index) => (
        <Card key={index}>
          <Card.Body className="card-body">
          <div className="free-agent-card" key={index}>
              <div className="card-body">
                <div className="free-agent-details">
              <Button variant="primary" className="button" onClick={() => addPlayer(player)}>+</Button>
              <strong><Card.Text className="player-name">{player.Name}</Card.Text></strong>
              {(player.Position === 'DEF') &&<strong><Card.Text className="player-name">{player.Team}</Card.Text></strong>}
              <Card.Text> Position: {player.Position}</Card.Text>
              {(player.Position != 'DEF') &&<Card.Text> Team: {player.Team}</Card.Text>}
              {(player.Position === 'QB') && player.PassingYards && <Card.Text>PassYRD: {player.PassingYards}</Card.Text>}
              {(player.Position === 'QB') && player.PassingTouchdowns && <Card.Text>PassTD: {player.PassingTouchdowns}</Card.Text>}
              {(player.Position === 'QB') && player.PassingInterceptions && <Card.Text>INT: {player.PassingInterceptions}</Card.Text>}
              {(player.Position === 'QB' || player.Position === 'RB') && player.RushingYards && <Card.Text>RushYRD: {player.RushingYards}</Card.Text>}
              {(player.Position === 'QB' || player.Position === 'RB') && player.RushingTouchdowns && <Card.Text>RushTD: {player.RushingTouchdowns}</Card.Text>}
              {(player.Position === 'RB' || player.Position === 'WR' || player.Position === 'TE') && player.ReceivingYards && <Card.Text>ReceivingYRD: {player.ReceivingYards}</Card.Text>}
              {(player.Position === 'RB' || player.Position === 'WR' || player.Position === 'TE') && player.ReceivingTouchdowns && <Card.Text>ReceivingTD: {player.ReceivingTouchdowns}</Card.Text>}
              {player.Position === 'K' && <Card.Text>FG Attempted: {player.FieldGoalsAttempted}</Card.Text>}
              {player.Position === 'K' && player.FieldGoalsMade && <Card.Text>FG Made: {player.FieldGoalsMade}</Card.Text>}
              {player.Position === 'K' && player.ExtraPointsMade && <Card.Text>Extra Points Made: {player.ExtraPointsMade}</Card.Text>}
              {player.Position === 'DEF' && player.PointsAllowed && <Card.Text>Points Allowed: {player.PointsAllowed}</Card.Text>}
              {player.Position === 'DEF' && player.Sacks && <Card.Text>Sacks: {player.Sacks}</Card.Text>}
              {player.Position === 'DEF' && player.Interceptions && <Card.Text>Interceptions: {player.Interceptions}</Card.Text>}
              {player.Position === 'DEF' && player.FumblesForced && <Card.Text>Fumbles Forced: {player.FumblesForced}</Card.Text>}
              </div>
              </div>
            </div>
            
          </Card.Body>
        </Card>
      ))}
      </div>
      <button onClick={loadMore}>Load More</button>
    </div>
  );
};

export default AddFreeAgents;