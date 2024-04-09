import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, arrayRemove, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase-config'  // Import your Firebase config
import seasonPlayersData from '../NFLStats/SeasonStatsPlayers.json';
import week1PlayersData from '../NFLStats/week1PlayersData.json'
import  Card  from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown';
import MyHuddleHero from './MyHuddleHero';

const weekData = {
  'Week 1': week1PlayersData,
  'Season': seasonPlayersData
};



const Matchup = ({ selectedLeague, user, beginnerMode }) => {
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('Week 1');
  const [opponentTeamPlayers, setOpponentTeamPlayers] = useState([]);
  const [opponentDisplayName, setOpponentDisplayName] = useState('');



  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // Get a reference to the current league's document
        const leagueSnapshot = await getDocs(query(collection(db, 'leagues'), where('id', '==', selectedLeague.id)));
        const leagueDoc = leagueSnapshot.docs[0];
  
        // Determine the opponent's email address
        const members = selectedLeague.members;
        const userIndex = members.indexOf(user.email);
        const opponentIndex = (userIndex % 2 === 0) ? userIndex + 1 : userIndex - 1;
        const opponentEmail = members[opponentIndex];
        

        // Fetch the display name of the opponent
        const opponentDisplayName = await getDisplayName(opponentEmail);
        setOpponentDisplayName(opponentDisplayName);
  
        // Get a reference to the team documents with owner fields matching the user's and opponent's email
        const teamsRef = collection(leagueDoc.ref, 'teams');
        const userTeamSnapshot = await getDocs(query(teamsRef, where('owner', '==', user.email)));
        const opponentTeamSnapshot = await getDocs(query(teamsRef, where('owner', '==', opponentEmail)));
  
        const userTeamDoc = userTeamSnapshot.docs[0];
        const opponentTeamDoc = opponentTeamSnapshot.docs[0];
  
        // Set up the real-time listeners
        const unsubscribeUser = onSnapshot(userTeamDoc.ref, async (snapshot) => {
          const teamData = snapshot.data();
          if (teamData && teamData.players) {
            // Get the player data for each player in the team
            const teamPlayersData = playersData.filter(player => teamData.players.includes(player.PlayerID));
            setTeamPlayers(teamPlayersData);
          }
        });
  
        const unsubscribeOpponent = onSnapshot(opponentTeamDoc.ref, async (snapshot) => {
          const teamData = snapshot.data();
          if (teamData && teamData.players) {
            // Get the player data for each player in the team
            const teamPlayersData = playersData.filter(player => teamData.players.includes(player.PlayerID));
            setOpponentTeamPlayers(teamPlayersData);  // You'll need to create this state variable
          }
        });
  
        // Clean up the listeners when the component is unmounted
        return () => {
          unsubscribeUser();
          unsubscribeOpponent();
        };
      } catch (error) {
        console.error("Error fetching teams: ", error);
      }
    };
    fetchTeams();
  }, []);
  

  const getDisplayName = async (email) => {
    const userRef = collection(db, 'users');
    const q = query(userRef, where('email', '==', email));
  
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data().displayName;
    } else {
      return null;
    }
  };
  
  // Calculate the maximum number of players
  const maxPlayers = selectedLeague && selectedLeague.settings 
    ? Object.values(selectedLeague.settings.rosterSettings).reduce((a, b) => a + b, 0)
    : 0;

  // Determine which data to use based on the selected week
  const playersData = weekData[selectedWeek]



  const statMapping = {
    'passTD': 'PassingTouchdowns',
    'passYRD': 'PassingYards',
    'interception': 'PassingInterceptions',
    'recTD': 'ReceivingTouchdowns',
    'recYRD': 'ReceivingYards',
    'reception': 'Receptions',
    'rushTD': 'RushingTouchdowns',
    'rushYRD': 'RushingYards',
    'fumble': 'Fumbles',
    'fumbleLost': 'FumblesLost',
    'FGMiss': ['FieldGoalsAttempted', 'FieldGoalsMade'],
    'FG0_39': ['FieldGoalsMade0to19', 'FieldGoalsMade20to29', 'FieldGoalsMade30to39'],
    'FG40_49': 'FieldGoalsMade40to49',
    'FG50Plus': 'FieldGoalsMade50Plus',
    'extraPoint': 'ExtraPointsMade',
    'blockedKick': 'BlockedKicks',
    'defInterception': 'Interceptions',
    'fumblerecovery': 'FumblesRecovered',
    'points14_20': 'PointsAllowed', 
    'points1_6': 'PointsAllowed',
    'points21_27': 'PointsAllowed',
    'points28_34': 'PointsAllowed',
    'points35Plus': 'PointsAllowed',
    'points7_13': 'PointsAllowed',
    'returnTD': ['DefensiveTouchdown', 'SpecialTeamsTouchdown'], // Assuming 'KickReturnTouchdowns' represents return touchdowns
    'sack': 'Sacks',
    'safety': 'Safeties',
    'shutout': 'PointsAllowed'
  };
  
  
  const calculateProjectedPoints = (playerWeekData, scoringSettings) => {
    if (!scoringSettings) {
      return 0;
    }
    let projectedPoints = 0;
  
    // Iterate over each category in the scoring settings
    for (const [category, settings] of Object.entries(scoringSettings)) {
      // Iterate over each setting in the category
      for (const [setting, value] of Object.entries(settings)) {
        // Get the corresponding stat
        const stat = statMapping[setting];
  
        // If the player has the stat and the setting exists, add the product to the projected points
        if (Array.isArray(stat)) {
          // If the stat is an array, sum the values for each stat
          stat.forEach((s, i) => {
            if (playerWeekData[s] && value) {
              if (s === 'FieldGoalsAttempted' || s === 'ExtraPointsAttempted') {
                // Special handling for missed field goals and extra points
                const made = playerWeekData[stat[i+1]] || 0; // Corresponding 'FieldGoalsMade' or 'ExtraPointsMade'
                const attempted = playerWeekData[s];
                const missed = attempted - made;
                projectedPoints += missed * value;
              } else {
                projectedPoints += playerWeekData[s] * value;
              }
            }
          });
        } else if (playerWeekData[stat] && value) {
          // Special handling for points allowed
          if (stat === 'PointsAllowed') {
            if ((setting === 'points1_6' && playerWeekData[stat] >= 1 && playerWeekData[stat] <= 6) ||
                (setting === 'points7_13' && playerWeekData[stat] >= 7 && playerWeekData[stat] <= 13) ||
                (setting === 'points14_20' && playerWeekData[stat] >= 14 && playerWeekData[stat] <= 20) ||
                (setting === 'points21_27' && playerWeekData[stat] >= 21 && playerWeekData[stat] <= 27) ||
                (setting === 'points28_34' && playerWeekData[stat] >= 28 && playerWeekData[stat] <= 34) ||
                (setting === 'points35Plus' && playerWeekData[stat] >= 35) ||
                (setting === 'shutout' && playerWeekData[stat] === 0)) {
              projectedPoints += value;
            }
          } else {
            projectedPoints += playerWeekData[stat] * value;
          }
        }
      }
    }
  
    return projectedPoints;
  };
  
  
  
  
  


  return (
    <div>
      <Dropdown onSelect={setSelectedWeek}>
        <Dropdown.Toggle variant="success" id="dropdown-basic" disabled>
          {selectedWeek}
        </Dropdown.Toggle>
  
        <Dropdown.Menu>
          <Dropdown.Item eventKey="Week 1">Week 1</Dropdown.Item>
          <Dropdown.Item eventKey="Season">Season</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
  
      <h2>Your Team</h2>
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
              <div className="player-details">
                <Card.Title className="player-name">{player.Name}</Card.Title>
                <Card.Text className="player-card-text"> Position: {player.Position}</Card.Text>
                <Card.Text className="player-card-text"> Team: {player.Team}</Card.Text>
                <Card.Text className="player-card-text">
                  Projected Points: {selectedLeague && calculateProjectedPoints(playerWeekData, selectedLeague.settings.scoringSettings).toFixed(2)}
                </Card.Text>

                
              </div>
            </Card.Body>
          </Card>
        );
      })}
  
      <h2>{opponentDisplayName}'s Team</h2>

      {opponentTeamPlayers.map((player, index) => {
        // Get the player's data for the selected week
        let playerWeekData = weekData[selectedWeek].find(p => p.PlayerID === player.PlayerID);
  
        // If the player does not exist in the selected week, use their data from the all season data file
        if (!playerWeekData) {
          playerWeekData = weekData['Season'].find(p => p.PlayerID === player.PlayerID);
          // Set all stats to 0
          playerWeekData = { ...playerWeekData, PassingYards: 0, PassingTouchdowns: 0, PassingInterceptions: 0, RushingYards: 0, RushingTouchdowns: 0, ReceivingYards: 0, ReceivingTouchdowns: 0, Receptions: 0, FieldGoalsAttempted: 0, FieldGoalsMade: 0, ExtraPointsMade: 0, PointsAllowed: 0, Sacks: 0, Interceptions: 0, FumblesForced: 0 };
        }

        
  
        return (
          <Card className="opponent-team-card" key={index}>
            <Card.Body className="card-body d-flex align-items-center">
              <div className="player-details">
                <Card.Title className="player-name">{player.Name}</Card.Title>
                <Card.Text className="player-card-text"> Position: {player.Position}</Card.Text>
                <Card.Text className="player-card-text"> Team: {player.Team}</Card.Text>
                <Card.Text className="player-card-text">
                  Projected Points: {selectedLeague && calculateProjectedPoints(playerWeekData, selectedLeague.settings.scoringSettings).toFixed(2)}
                </Card.Text>

              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
  
};

export default Matchup;