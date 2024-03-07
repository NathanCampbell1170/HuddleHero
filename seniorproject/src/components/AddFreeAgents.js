import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, where, startAfter, limit, getDocs } from 'firebase/firestore';
import {db} from "../Firebase-config";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "../styles/AddPlayers.css"

const AddFreeAgents = (selectedLeague) => {
  const [players, setPlayers] = useState([]);
  const [lastPlayer, setLastPlayer] = useState(null);
  const [position, setPosition] = useState('');

  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };

// Load the first page
useEffect(() => {
  const loadPlayers = async () => {
    // Reset lastPlayer when position changes
    setLastPlayer(null);

    let baseQuery = collection(db, 'players');
    let q;
    if (position) {
      q = query(baseQuery, where('Position', '==', position), where('AverageDraftPosition', '!=', null), orderBy('AverageDraftPosition'), limit(10));
    } else {
      q = query(baseQuery, where('AverageDraftPosition', '!=', null), orderBy('AverageDraftPosition'), limit(10));
    }
    const querySnapshot = await getDocs(q);
    let players = [];
    querySnapshot.forEach((doc) => {
      let player = doc.data();
      players.push(player);
    });
    setPlayers(players);
    if (players.length > 0) {
      setLastPlayer(players[players.length - 1]);
    }
  };
  loadPlayers();
}, [position]);

// Load the next page
const loadMore = async () => {
  if (!lastPlayer) return;
  let baseQuery = collection(db, 'players');
  let q;
  if (position) {
    q = query(baseQuery, where('Position', '==', position), where('AverageDraftPosition', '!=', null), orderBy('AverageDraftPosition'), startAfter(lastPlayer['AverageDraftPosition']), limit(10));
  } else {
    q = query(baseQuery, where('AverageDraftPosition', '!=', null), orderBy('AverageDraftPosition'), startAfter(lastPlayer['AverageDraftPosition']), limit(10));
  }
  const querySnapshot = await getDocs(q);
  let newPlayers = [];
  querySnapshot.forEach((doc) => {
    let player = doc.data();
    newPlayers.push(player);
  });
  setPlayers([...players, ...newPlayers]);
  if (newPlayers.length > 0) {
    setLastPlayer(newPlayers[newPlayers.length - 1]);
  }
};


const addPlayer = async (player) => {
  if (user) {
    leagueRef = collection(db, "leagues")
    const leaguesQuery = query(collection(db, 'leagues'), where('id', '==', selectedLeague.id));
    const leaguesSnapshot = await getDocs(leaguesQuery);

    if (!leaguesSnapshot.empty) {
      // Get the actual ID of the document
      const leagueDocId = leaguesSnapshot.docs[0].id;

      // Now you can create a reference to the 'teams' subcollection
      const teamRef = collection(db, 'leagues', leagueDocId, 'teams');
      await updateDoc(teamRef)
    
  }

}

  return (
    <div>
      <Form>
        <Form.Control as="select" value={position} onChange={handlePositionChange}>
          <option value="">All Positions</option>
          {['QB', 'RB', 'WR', 'TE', 'K', 'DEF'].map((position) => (
            <option key={position} value={position}>{position}</option>
          ))}
        </Form.Control>
      </Form>
      {players.map((player, index) => (
        <Card key={index} style={{ width: '100%', height: '15vh' }}>
          <Card.Body className="card-body">
            <div className="player-details">
            <Button variant="primary" className="button" onClick={addPlayer(player)}>+</Button>
              <strong><Card.Text className="player-name">{player.Name}</Card.Text></strong>
              Postion:<Card.Text>{player.Position}</Card.Text>
              Team:<Card.Text>{player.Team}</Card.Text>
              PassYRD:<Card.Text>{player.PassingYards}</Card.Text>
              PassTD:<Card.Text>{player.PassingTouchdowns}</Card.Text>
              INT:<Card.Text>{player.PassingInterceptions}</Card.Text>
              RushYRD:<Card.Text>{player.RushingYards}</Card.Text>
              RushTD:<Card.Text>{player.RushingTouchdowns}</Card.Text>
              ReceivingYRD:<Card.Text>{player.ReceivingYards}</Card.Text>
              ReceivingTD:<Card.Text>{player.ReceivingTouchdowns}</Card.Text>
            </div>
          </Card.Body>
        </Card>
      ))}
      <button onClick={loadMore}>Load more</button>
    </div>
  );
};

export default AddFreeAgents;
