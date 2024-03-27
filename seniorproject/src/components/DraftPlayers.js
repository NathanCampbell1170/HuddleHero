import { collection, getDocs, query, where, updateDoc, arrayUnion, onSnapshot, doc, getDoc, addDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { db } from '../Firebase-config';
//import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd' 

import playersData from '../NFLStats/SeasonStatsPlayers.json'

const DraftPlayers = ({ selectedLeague, user }) => {
  const [players, setPlayers] = useState([]);
  const [position, setPosition] = useState('All Positions');
  const [fetchedCount, setFetchedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [leagueData, setLeagueData] = useState([]);

  useEffect(() => {
    const fetchLeagueAndPlayers = async () => {
      // Get the current league's document using selectedLeague.id
      const leagueSnapshot = await getDocs(query(collection(db, 'leagues'), where('id', '==', selectedLeague.id)));
      const leagueDoc = leagueSnapshot.docs[0];
      const leagueData = leagueDoc.data();
      setLeagueData(leagueData);
  
      // Get a reference to the teams subcollection
      const teamsRef = collection(leagueDoc.ref, 'teams');
  
      // Set up the real-time listener on the teams
      const unsubscribeTeams = onSnapshot(teamsRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" || change.type === "modified") {
            // If a team is added or modified, remove the taken players from the players array
            const teamData = change.doc.data();
            setPlayers(prevPlayers => prevPlayers.filter(player => !teamData.players.includes(player.PlayerID)));
          }
        });
      });
  
      // Set up the real-time listener on the league
      const unsubscribeLeague = onSnapshot(leagueDoc.ref, (doc) => {
        const updatedLeagueData = doc.data();
        setLeagueData({ ...updatedLeagueData });  // Create a new object when updating leagueData
      });
  
      // Fetch the players initially
      await fetchPlayers(position);
  
      // Clean up the listeners when the component is unmounted or `position` changes
      return () => {
        unsubscribeTeams();
        unsubscribeLeague();
      };
    };
  
    fetchLeagueAndPlayers();
  }, [position]);
  
  

  


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
    console.log(players)

    // Update fetchedCount
    setFetchedCount(prevCount => prevCount + nextPlayers.length);

    setIsLoading(false);
  };

  const draftPlayer = async (player) => {
    // Get a reference to the current league's document
    const leagueRef = collection(db, 'leagues');
    const leagueSnapshot = await getDocs(query(leagueRef, where('id', '==', selectedLeague.id)));
    const leagueDoc = leagueSnapshot.docs[0];
    const leagueData = leagueDoc.data();
  
    // Check if the draft is currently happening
    if (!leagueData.draftStatus=="Not Started") {
      alert('The draft is not currently happening.');
      return;
    }
  
    // Check if it's the current user's turn to draft
    if (leagueData.currentDrafter !== user.email) {
      alert("It's not your turn to draft.");
      return;
    }
  
    // Get a reference to the team document with an owner field matching the user's email
    const teamsRef = collection(leagueDoc.ref, 'teams');
    const teamsSnapshot = await getDocs(query(teamsRef, where('owner', '==', user.email)));
    let teamDoc;
    let teamData;
  
    // Check if a team document for the current user already exists
    if (teamsSnapshot.empty) {
      // If not, create a new document with the specified values
      const docRef = await addDoc(teamsRef, {
        owner: user.email,
        players: []
      });
      teamDoc = docRef;
      teamData = { players: [''] };
    } else {
      // If so, continue as normal
      teamDoc = teamsSnapshot.docs[0];
      teamData = teamDoc.data();
    }
  
    // Calculate the maximum roster size
    let maxRosterSize = 0;
    if (selectedLeague && selectedLeague.settings.rosterSettings) {
      maxRosterSize = Object.values(selectedLeague.settings.rosterSettings).reduce((a, b) => a + b, 0);
      console.log('Max Roster Size:', maxRosterSize);
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
  
    // Move on to the next drafter
    const currentDrafterIndex = leagueData.draftOrder.indexOf(user.email);
    let nextDrafterIndex = (currentDrafterIndex + 1) % leagueData.draftOrder.length;
    let nextDrafter = leagueData.draftOrder[nextDrafterIndex];
  
    // Check if we're at the end of a round
    if (nextDrafterIndex === 0) {
      // Reverse the draft order
      await updateDoc(leagueDoc.ref, {
        draftOrder: leagueData.draftOrder.reverse()
      });
      // Since we reversed the draft order, the next drafter is now at index 0
      nextDrafter = leagueData.draftOrder[0];
    }
  
    // Update the current drafter
    await updateDoc(leagueDoc.ref, {
      currentDrafter: nextDrafter
    });
  
    // Check if all teams are full
    const allTeamsSnapshot = await getDocs(teamsRef);
    let allTeamsAreFull = true;
    allTeamsSnapshot.forEach((doc) => {
      const teamData = doc.data();
      if (!teamData.players || teamData.players.length < maxRosterSize) {
        allTeamsAreFull = false;
      }
    });
  
    // If all teams are full, update the draftStatus to "Finished"
    if (allTeamsAreFull) {
      await updateDoc(leagueDoc.ref, {
        draftStatus: "Finished"
      });
    }
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


  function arraysHaveSameContents(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;

    let sortedArr1 = [...arr1].sort();
    let sortedArr2 = [...arr2].sort();

    for (let i = 0; i < sortedArr1.length; i++) {
        if (sortedArr1[i] !== sortedArr2[i]) return false;
    }

    return true;
}


  const startDraft = async () => {
    
    if (leagueData.members.length !== leagueData.amountofPlayers) {
      alert('The draft cannot start till the league is full!');
      return;
    }

    if (!arraysHaveSameContents(leagueData.draftOrder, leagueData.members)) {
      alert('League members must match the draft order. Please randomize the draft order again before starting the draft');
      return;
    }
  
    // Get a reference to the current league's document
    const leagueRef = collection(db, 'leagues');
    const leagueSnapshot = await getDocs(query(leagueRef, where('id', '==', selectedLeague.id)));
    const leagueDoc = leagueSnapshot.docs[0];
  
    // Get a reference to the 'teams' subcollection
    const teamsRef = collection(leagueDoc.ref, 'teams');
  
    // Create a team document for each member
    for (const memberEmail of selectedLeague.members) {
      // Check if a team document for the current member already exists
      const teamsSnapshot = await getDocs(query(teamsRef, where('owner', '==', memberEmail)));
  
      if (teamsSnapshot.empty) {
        // If not, create a new document with the specified values
        await addDoc(teamsRef, {
          owner: memberEmail,
          players: []
        });
      }
    }
  
    // Fetch the updated league document from Firestore
  const updatedLeagueDoc = await getDoc(leagueDoc.ref);
  const updatedLeagueData = updatedLeagueDoc.data();

  // Set the draftStatus field to true and currentDrafter to the first drafter in the list
  console.log(updatedLeagueData.draftOrder[0]);
  await updateDoc(leagueDoc.ref, {
    draftStatus: "Drafting",
    currentDrafter: updatedLeagueData.draftOrder[0]
  });

  alert('The draft has started!');
};
  

  
// Function to randomize the order
const randomizeOrder = async () => {
  // Always use the current members of the league for the draft order
  let draftOrder = [...leagueData.members];

  for (let i = draftOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [draftOrder[i], draftOrder[j]] = [draftOrder[j], draftOrder[i]];
  }
  console.log(draftOrder)

  // Get a reference to the league document
  const leagueRef = collection(db, 'leagues');
  const leagueSnapshot = await getDocs(query(leagueRef, where('id', '==', leagueData.id)));
  const leagueDoc = leagueSnapshot.docs[0];

  // Update the draftOrder in the league document
  await updateDoc(leagueDoc.ref, { draftOrder });
};



  
  
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(selectedLeague.draftOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
  
    // Update the draftOrder in the league document
    const leagueRef = doc(db, 'leagues', selectedLeague.id);
    await updateDoc(leagueRef, { draftOrder: items });
  };
  

  return (
    
    <div>
        
        {user.email === selectedLeague.commissioner && leagueData.draftStatus === 'Not Started' && (
      <div>
        <button onClick={randomizeOrder}>Randomize Order</button>

        {/*}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="players">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {selectedLeague.members.map((player, index) => (
                  <Draggable key={player} draggableId={player} index={index}>
                    {(provided) => (
                      <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                        {player}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
                    */}
      </div>
    )}
    
    {user.email === selectedLeague.commissioner && leagueData.draftStatus === 'Not Started' && (
        <Button variant="primary" onClick={startDraft}>Start Draft</Button>
      )}

<Card style={{ width: '18rem', margin: '1rem', backgroundColor: leagueData.draftStatus === 'Not Started' ? '#FF7f7F' : leagueData.draftStatus === 'Drafting' ? '#ADFF2F' : 'yellow' }}>
    <Card.Body>
      <Card.Text>
        Draft status: {leagueData.draftStatus}
      </Card.Text>
    </Card.Body>
  </Card>
  
      <h2>Draft Order</h2>
      
      <div className="d-flex flex-wrap">
  

  {leagueData.draftOrder && leagueData.draftOrder.map((userEmail, index) => (
    <Card key={index} style={{ width: '18rem', margin: '1rem', backgroundColor: leagueData && leagueData.currentDrafter && userEmail === leagueData.currentDrafter ? 'lightgreen' : 'white' }}>
      <Card.Body>
        <Card.Title>{selectedLeague.memberDisplayNames[selectedLeague.members.indexOf(userEmail)]}</Card.Title>
        <Card.Text>
          {leagueData && leagueData.currentDrafter && userEmail === leagueData.currentDrafter ? 'Currently Drafting' : 'Waiting for turn'}
        </Card.Text>
      </Card.Body>
    </Card>
  ))}
</div>


  
      
  
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
              <Button variant="primary" className="button" onClick={() => draftPlayer(player)}>+</Button>
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

export default DraftPlayers;
