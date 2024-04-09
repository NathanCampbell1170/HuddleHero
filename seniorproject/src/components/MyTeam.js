import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, arrayRemove, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase-config'  // Import your Firebase config
import seasonPlayersData from '../NFLStats/SeasonStatsPlayers.json';
import week1PlayersData from '../NFLStats/week1PlayersData.json'
import week2PlayersData from '../NFLStats/week2PlayersData.json'
import week3PlayersData from '../NFLStats/week3PlayersData.json'
import week4PlayersData from '../NFLStats/week4PlayersData.json'
import week5PlayersData from '../NFLStats/week5PlayersData.json'
import week6PlayersData from '../NFLStats/week6PlayersData.json'
import week7PlayersData from '../NFLStats/week7PlayersData.json'
import week8PlayersData from '../NFLStats/week8PlayersData.json'
import week9PlayersData from '../NFLStats/week9PlayersData.json'
import week10PlayersData from '../NFLStats/week10PlayersData.json'
import week11PlayersData from '../NFLStats/week11PlayersData.json'
import week12PlayersData from '../NFLStats/week12PlayersData.json'
import week13PlayersData from '../NFLStats/week13PlayersData.json'
import week14PlayersData from '../NFLStats/week14PlayersData.json'
import week15PlayersData from '../NFLStats/week15PlayersData.json'
import week16PlayersData from '../NFLStats/week16PlayersData.json'
import week17PlayersData from '../NFLStats/week17PlayersData.json'
import week18PlayersData from '../NFLStats/week18PlayersData.json'
import  Card  from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown';
import MyHuddleHero from './MyHuddleHero';

const weekData = {
  'Week 1': week1PlayersData,
  'Week 2': week2PlayersData,
  'Week 3': week3PlayersData,
  'Week 4': week4PlayersData,
  'Week 5': week5PlayersData,
  'Week 6': week6PlayersData,
  'Week 7': week7PlayersData,
  'Week 8': week8PlayersData,
  'Week 9': week9PlayersData,
  'Week 10': week10PlayersData,
  'Week 11': week11PlayersData,
  'Week 12': week12PlayersData,
  'Week 13': week13PlayersData,
  'Week 14': week14PlayersData,
  'Week 15': week15PlayersData,
  'Week 16': week16PlayersData,
  'Week 17': week17PlayersData,
  'Week 18': week18PlayersData,
  'Season': seasonPlayersData
};



const MyTeam = ({ selectedLeague, user, beginnerMode }) => {
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('Season');  // New state variable

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
          if (teamData && teamData.players) {
            // Get the player data for each player in the team
            const teamPlayersData = playersData.filter(player => teamData.players.includes(player.PlayerID));
            setTeamPlayers(teamPlayersData);
          }
        });
    
        // Clean up the listener when the component is unmounted
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching team: ", error);
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
      const leagueData = leagueDoc.data();
  
      // Check the draftStatus
      if (leagueData.draftStatus !== 'Finished') {
        alert("You can't drop players until after the draft is completed!");
        return;
      }
  
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
  

  // Calculate the maximum number of players
  const maxPlayers = selectedLeague && selectedLeague.settings 
    ? Object.values(selectedLeague.settings.rosterSettings).reduce((a, b) => a + b, 0)
    : 0;

  // Determine which data to use based on the selected week
  const playersData = weekData[selectedWeek]





   /*let playersData;
  switch (selectedWeek) {
    case 'Week 1':
      playersData = week1PlayersData;
      break;
    case 'Week 2':
      playersData = week2PlayersData;
      break;
    case 'Week 3':
      playersData = week3PlayersData;
      break;
    case 'Week 4':
      playersData = week4PlayersData;
      break;
    case 'Week 5':
      playersData = week5PlayersData;
      break;
    case 'Week 6':
      playersData = week6PlayersData;
      break;
      case 'Week 7':
      playersData = week7PlayersData;
    break;
      case 'Week 8':
      playersData = week8PlayersData;
    break;
      case 'Week 9':
      playersData = week9PlayersData;
    break;
      case 'Week 9':
      playersData = week9PlayersData;
    break;
      case 'Week 10':
      playersData = week10PlayersData;
    break;
      case 'Week 11':
      playersData = week11PlayersData;
    break;
      case 'Week 12':
      playersData = week12PlayersData;
    break;
      case 'Week 13':
      playersData = week13PlayersData;
    break;
      case 'Week 14':
      playersData = week14PlayersData;
    break;
      case 'Week 15':
      playersData = week15PlayersData;
    break;
      case 'Week 16':
      playersData = week16PlayersData;
    break;
      case 'Week 17':
      playersData = week17PlayersData;
    break;
      case 'Week 18':
      playersData = week18PlayersData;
    break;
    case 'Season':
    default:
      playersData = seasonPlayersData;
      break;
  }
*/
  return (
    <div>
      <Dropdown onSelect={setSelectedWeek}>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {selectedWeek}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item eventKey="Week 1">Week 1</Dropdown.Item>
          <Dropdown.Item eventKey="Week 2">Week 2</Dropdown.Item>
          <Dropdown.Item eventKey="Week 3">Week 3</Dropdown.Item>
          <Dropdown.Item eventKey="Week 4">Week 4</Dropdown.Item>
          <Dropdown.Item eventKey="Week 5">Week 5</Dropdown.Item>
          <Dropdown.Item eventKey="Week 6">Week 6</Dropdown.Item>
          <Dropdown.Item eventKey="Week 7">Week 7</Dropdown.Item>
          <Dropdown.Item eventKey="Week 8">Week 8</Dropdown.Item>
          <Dropdown.Item eventKey="Week 9">Week 9</Dropdown.Item>
          <Dropdown.Item eventKey="Week 10">Week 10</Dropdown.Item>
          <Dropdown.Item eventKey="Week 1`">Week 11</Dropdown.Item>
          <Dropdown.Item eventKey="Week 12">Week 12</Dropdown.Item>
          <Dropdown.Item eventKey="Week 13">Week 13</Dropdown.Item>
          <Dropdown.Item eventKey="Week 14">Week 14</Dropdown.Item>
          <Dropdown.Item eventKey="Week 15">Week 15</Dropdown.Item>
          <Dropdown.Item eventKey="Week 16">Week 16</Dropdown.Item>
          <Dropdown.Item eventKey="Week 17">Week 17</Dropdown.Item>
          <Dropdown.Item eventKey="Week 18">Week 18</Dropdown.Item>
          <Dropdown.Item eventKey="Season">Season</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Card className="team-stats-card">
        <Card.Body>
          <Card.Title>Team Stats</Card.Title>
          <Card.Text>Players: {teamPlayers.length} / {maxPlayers}</Card.Text>
        </Card.Body>
      </Card>

      {teamPlayers.map((player, index) => {
  // Get the player's data for the selected week
  let playerWeekData = weekData[selectedWeek].find(p => p.PlayerID === player.PlayerID);

  // If the player does not exist in the selected week, use their data from the all season data file
  if (!playerWeekData) {
    playerWeekData = weekData['Season'].find(p => p.PlayerID === player.PlayerID);
    // Set all stats to 0
    playerWeekData = { ...playerWeekData, PassingYards: 0, PassingTouchdowns: 0, PassingInterceptions: 0, RushingYards: 0, RushingTouchdowns: 0, ReceivingYards: 0, ReceivingTouchdowns: 0, Receptions: 0, FieldGoalsAttempted: 0, FieldGoalsMade: 0, ExtraPointsMade: 0, PointsAllowed: 0, Sacks: 0, Interceptions: 0, FumblesForced: 0 };
  }

        return (
          <Card className="my-team-card" key={index}>
            <Card.Body className="card-body d-flex align-items-center">
              <Button variant="danger" onClick={() => dropPlayer(player)}>Drop</Button>
              <div className="player-details">
                <Card.Title className="player-name">{player.Name}</Card.Title>
                {(player.Position === 'DEF') &&<strong><Card.Text className="player-card-text">{player.Team}</Card.Text></strong>}
                <div className="d-flex flex-wrap">
                  <Card.Text className="player-card-text"> Position: {player.Position}</Card.Text>
                  {(player.Position != 'DEF') &&<Card.Text className="player-card-text"> Team: {player.Team}</Card.Text>}
                  {(player.Position === 'QB') && <Card.Text className="player-card-text">PassYRD: {playerWeekData.PassingYards || 0}</Card.Text>}
                  {(player.Position === 'QB') && <Card.Text className="player-card-text">PassTD: {playerWeekData.PassingTouchdowns || 0}</Card.Text>}
                  {(player.Position === 'QB') && <Card.Text className="player-card-text">INT: {playerWeekData.PassingInterceptions || 0}</Card.Text>}
                  {(player.Position === 'QB' || player.Position === 'RB') && <Card.Text className="player-card-text">RushYRD: {playerWeekData.RushingYards || 0}</Card.Text>}
                  {(player.Position === 'QB' || player.Position === 'RB') && <Card.Text className="player-card-text">RushTD: {playerWeekData.RushingTouchdowns || 0}</Card.Text>}
                  {(player.Position === 'RB' || player.Position === 'WR' || player.Position === 'TE') && <Card.Text className="player-card-text">ReceivingYRD: {playerWeekData.ReceivingYards || 0}</Card.Text>}
                  {(player.Position === 'RB' || player.Position === 'WR' || player.Position === 'TE') && <Card.Text className="player-card-text">ReceivingTD: {playerWeekData.ReceivingTouchdowns || 0}</Card.Text>}
                  {(player.Position === 'RB' || player.Position === 'WR' || player.Position === 'TE') && <Card.Text className="player-card-text">Receptions: {playerWeekData.Receptions || 0}</Card.Text>}
                  {player.Position === 'K' && <Card.Text className="player-card-text">FG Attempted: {playerWeekData.FieldGoalsAttempted || 0}</Card.Text>}
                  {player.Position === 'K' && <Card.Text className="player-card-text">FG Made: {playerWeekData.FieldGoalsMade || 0}</Card.Text>}
                  {player.Position === 'K' && <Card.Text className="player-card-text">Extra Points Made: {playerWeekData.ExtraPointsMade || 0}</Card.Text>}
                  {player.Position === 'DEF' && <Card.Text className="player-card-text">Points Allowed: {playerWeekData.PointsAllowed || 0}</Card.Text>}
                  {player.Position === 'DEF' && <Card.Text className="player-card-text">Sacks: {playerWeekData.Sacks || 0}</Card.Text>}
                  {player.Position === 'DEF' && <Card.Text className="player-card-text">Interceptions: {playerWeekData.Interceptions || 0}</Card.Text>}
                  {player.Position === 'DEF' && <Card.Text className="player-card-text">Fumbles Forced: {playerWeekData.FumblesForced || 0}</Card.Text>}
                </div>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default MyTeam;