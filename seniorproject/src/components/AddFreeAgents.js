import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, startAfter, limit, getDocs } from 'firebase/firestore';
import {db} from "../Firebase-config"

const AddFreeAgents = ({ positions, playerName, orderByField }) => {
  const [players, setPlayers] = useState([]);
  const [lastPlayer, setLastPlayer] = useState(null);

  // Load the first page
  useEffect(() => {
    const loadPlayers = async () => {
      let baseQuery = collection(db, 'players');
      if (positions && positions.length > 0) {
        baseQuery = query(baseQuery, where('position', 'in', positions));
      }
      if (playerName) {
        baseQuery = query(baseQuery, where('name', '==', playerName));
      }
      let q = query(baseQuery, orderBy(orderByField), limit(10));
      const querySnapshot = await getDocs(q);
      let players = [];
      querySnapshot.forEach((doc) => {
        players.push(doc.data());
      });
      setPlayers(players);
      setLastPlayer(players[players.length - 1]);
    };
    loadPlayers();
  }, [positions, playerName, orderByField]);

  // Load the next page
  const loadMore = async () => {
    let baseQuery = collection(db, 'players');
    if (positions && positions.length > 0) {
        baseQuery = query(baseQuery, where('position', 'in', positions));
    }
    if (playerName) {
        baseQuery = query(baseQuery, where('name', '==', playerName));
    }
    let q = query(baseQuery, orderBy(orderByField), lastPlayer ? startAfter(lastPlayer[orderByField]) : null, limit(10));
    const querySnapshot = await getDocs(q);
    let newPlayers = [];
    querySnapshot.forEach((doc) => {
      newPlayers.push(doc.data());
    });
    setPlayers([...players, ...newPlayers]);
    setLastPlayer(newPlayers[newPlayers.length - 1]);
  };

  return (
    <div>
      {players.map((player, index) => (
        <div key={index}>
          <h2>{player.name}</h2>
          <p>{player.position}</p>
          {/* other player details */}
        </div>
      ))}
      <button onClick={loadMore}>Load more</button>
    </div>
  );
};

export default AddFreeAgents;
