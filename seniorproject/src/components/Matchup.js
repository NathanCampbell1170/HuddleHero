import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import { db } from '../Firebase-config';
import seasonPlayersData from '../NFLStats/SeasonStatsPlayers.json';
import week1PlayersData from '../NFLStats/week1PlayersData.json';

import "../styles/Matchup.css";

const weekData = {
  'Week 1': week1PlayersData,
  'Season': seasonPlayersData
};

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
  'returnTD': ['DefensiveTouchdown', 'SpecialTeamsTouchdown'],
  'sack': 'Sacks',
  'safety': 'Safeties',
  'shutout': 'PointsAllowed'
};

const positionMapping = {
  'startQB': 'QB',
  'startRB': 'RB',
  'startWR': 'WR',
  'startTE': 'TE',
  'startK': 'K',
  'startDEF': 'DEF',
  'startFLEX': ['RB', 'WR', 'TE']
};
const positionLabelMapping = {
  'startQB': 'QB',
  'startRB': 'RB',
  'startWR': 'WR',
  'startTE': 'TE',
  'startK': 'K',
  'startDEF': 'DEF',
  'startFLEX': 'FLEX'
};


const positionOrder = ['startQB', 'startRB', 'startWR', 'startTE', 'startFLEX', 'startK', 'startDEF'];


const Matchup = ({ selectedLeague, user }) => {
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('Week 1');
  const [opponentTeamPlayers, setOpponentTeamPlayers] = useState([]);
  const [opponentDisplayName, setOpponentDisplayName] = useState('');
  const [userProjectedScore, setUserProjectedScore] = useState(0);
  const [opponentProjectedScore, setOpponentProjectedScore] = useState(0);

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
                const made = playerWeekData[stat[i + 1]] || 0; // Corresponding 'FieldGoalsMade' or 'ExtraPointsMade'
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
  const playersData = weekData[selectedWeek];

  // Sort the players by their projected points
  const sortedPlayers = [...playersData].sort((a, b) => {
    const aPoints = calculateProjectedPoints(a, selectedLeague?.settings?.scoringSettings);
    const bPoints = calculateProjectedPoints(b, selectedLeague?.settings?.scoringSettings);
    return bPoints - aPoints; // Sort in descending order
  });

  // Select the top players for each position
  const selectedPlayers = {};
  if (selectedLeague?.settings?.rosterSettings) {
    for (const [position, count] of Object.entries(selectedLeague.settings.rosterSettings)) {
      selectedPlayers[position] = sortedPlayers.filter(player => player.Position === position).slice(0, count);
    }
  } else {
    console.log('selectedLeague.settings.rosterSettings is undefined or null');
  }


  // Select the top remaining players for the FLEX position
  const remainingPlayers = sortedPlayers.filter(player => !Object.values(selectedPlayers).flat().includes(player));
  const flexCount = selectedLeague?.settings?.rosterSettings.startFLEX;
  selectedPlayers.startFLEX = remainingPlayers.slice(0, flexCount);

  const getSelectedPlayers = (teamPlayers) => {
    // Sort the players by their projected points
    let sortedPlayers = [...teamPlayers].sort((a, b) => {
      const aPoints = calculateProjectedPoints(a, selectedLeague?.settings?.scoringSettings);
      const bPoints = calculateProjectedPoints(b, selectedLeague?.settings?.scoringSettings);
      return bPoints - aPoints; // Sort in descending order
    });

    // Select the top players for each position
    const selectedPlayers = {};
    if (selectedLeague?.settings?.rosterSettings) {
      for (const [setting, count] of Object.entries(selectedLeague.settings.rosterSettings)) {
        const position = positionMapping[setting];
        const playersForPosition = sortedPlayers.filter(player => player.Position === position);
        const selectedForPosition = playersForPosition.slice(0, count);

        // If not enough players to fill the slots, fill with "Empty Player Slot"
        while (selectedForPosition.length < count) {
          selectedForPosition.push({ Name: 'No Player', Position: 'N/A', Team: 'N/A' });
        }

        selectedPlayers[setting] = selectedForPosition;

        // Remove the selected players from the sortedPlayers array
        sortedPlayers = sortedPlayers.filter(player => !selectedForPosition.includes(player));
      }
    } else {
      console.log('selectedLeague.settings.rosterSettings is undefined or null');
    }

    // Select the top remaining players for the FLEX position
    const flexPositions = ['RB', 'WR', 'TE'];
    const remainingPlayers = sortedPlayers.filter(player => flexPositions.includes(player.Position));
    remainingPlayers.sort((a, b) => {
      const aPoints = calculateProjectedPoints(a, selectedLeague?.settings?.scoringSettings);
      const bPoints = calculateProjectedPoints(b, selectedLeague?.settings?.scoringSettings);
      return bPoints - aPoints; // Sort in descending order
    });
    const flexCount = selectedLeague?.settings?.rosterSettings.startFLEX;
    selectedPlayers.startFLEX = remainingPlayers.slice(0, flexCount);

    return selectedPlayers;
  };



  // Calculate selected players for user's team
  const userSelectedPlayers = getSelectedPlayers(teamPlayers);
  // Calculate selected players for opponent's team
  const opponentSelectedPlayers = getSelectedPlayers(opponentTeamPlayers);



  useEffect(() => {
    const calculateProjectedScore = (selectedPlayers) => {
      return Object.values(selectedPlayers).flat().reduce((total, player) => {
        const playerWeekData = weekData[selectedWeek].find(p => p.PlayerID === player.PlayerID) || {};
        return total + calculateProjectedPoints(playerWeekData, selectedLeague?.settings?.scoringSettings);
      }, 0);
    };

    setUserProjectedScore(calculateProjectedScore(userSelectedPlayers));
    setOpponentProjectedScore(calculateProjectedScore(opponentSelectedPlayers));
  }, [userSelectedPlayers, opponentSelectedPlayers]);




  return (
    <div>
      <div className="matchupHeader">
        <Dropdown onSelect={setSelectedWeek}>
          <Dropdown.Toggle className="matchupDropdown" variant="success" id="dropdown-basic" disabled>
            {selectedWeek}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item eventKey="Week 1">Week 1</Dropdown.Item>
            <Dropdown.Item eventKey="Season">Season</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="matchup">
        <Card className="matchupUser-card">
          <Card.Header className='matchup-Team-Owner'>Your Team</Card.Header>
          <Card.Body>
            <h2>Projected Score: {userProjectedScore.toFixed(2)}</h2>
            {positionOrder.map(slot => userSelectedPlayers[slot]?.map((player, index) => {
              // Get the player's data for the selected week
              let playerWeekData = weekData[selectedWeek].find(p => p.PlayerID === player.PlayerID);

              // If the player does not exist in the selected week, use their data from the all season data file
              if (!playerWeekData) {
                playerWeekData = weekData['Season'].find(p => p.PlayerID === player.PlayerID);
                // Set all stats to 0
                playerWeekData = { ...playerWeekData, PassingYards: 0, PassingTouchdowns: 0, PassingInterceptions: 0, RushingYards: 0, RushingTouchdowns: 0, ReceivingYards: 0, ReceivingTouchdowns: 0, Receptions: 0, FieldGoalsAttempted: 0, FieldGoalsMade: 0, ExtraPointsMade: 0, PointsAllowed: 0, Sacks: 0, Interceptions: 0, FumblesForced: 0 };
              }

              return (
                <Card className="matchupUser-playerCard" key={index}>
                  <Card.Header className="matchupUser-playerCard-header">{positionLabelMapping[slot]}</Card.Header>
                  <Card.Body className="matchupUser-playerCard-body">
                    <div className="matchupUser-details">
                      {player.Name !== 'Empty Player Slot' ? (
                        <>
                          <Card.Title className="player-name">
                            {player.Name && player.Name.split(' ').map((namePart, index) => (
                              <div key={index}>{namePart}</div>
                            ))}
                          </Card.Title>
                          <div className="matchupUser-stat">
                            <div className="matchupUser-card-label">Position:</div>
                            <div className="matchupUser-card-text">{player.Position}</div>
                          </div>
                          <div className="matchupUser-stat">
                            <div className="matchupUser-card-label">Team:</div>
                            <div className="matchupUser-card-text">{player.Team}</div>
                          </div>
                          <div className="matchupUser-stat">
                            <div className="matchupUser-card-label">Projected Points:</div>
                            <div className="matchupUser-card-text">
                              {selectedLeague && calculateProjectedPoints(playerWeekData, selectedLeague.settings.scoringSettings).toFixed(2)}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="matchupUser-stat">
                            <div className="matchupUser-card-label">Position:</div>
                            <div className="matchupUser-card-text">N/A</div>
                          </div>
                          <div className="matchupUser-stat">
                            <div className="matchupUser-card-label">Team:</div>
                            <div className="matchupUser-card-text">N/A</div>
                          </div>
                          <div className="matchupUser-stat">
                            <div className="matchupUser-card-label">Projected Points:</div>
                            <div className="matchupUser-card-text">N/A</div>
                          </div>
                        </>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              );
            }))}
          </Card.Body>
        </Card>

        <Card className="matchupOpponent-card">
          <Card.Header className='matchup-Team-Owner'>{opponentDisplayName}'s Team</Card.Header>
          <Card.Body>
            <h2>Projected Score: {opponentProjectedScore.toFixed(2)}</h2>
            {positionOrder.map(slot => opponentSelectedPlayers[slot]?.map((player, index) => {
              // Get the player's data for the selected week
              let playerWeekData = weekData[selectedWeek].find(p => p.PlayerID === player.PlayerID);

              // If the player does not exist in the selected week, use their data from the all season data file
              if (!playerWeekData) {
                playerWeekData = weekData['Season'].find(p => p.PlayerID === player.PlayerID);
                // Set all stats to 0
                playerWeekData = { ...playerWeekData, PassingYards: 0, PassingTouchdowns: 0, PassingInterceptions: 0, RushingYards: 0, RushingTouchdowns: 0, ReceivingYards: 0, ReceivingTouchdowns: 0, Receptions: 0, FieldGoalsAttempted: 0, FieldGoalsMade: 0, ExtraPointsMade: 0, PointsAllowed: 0, Sacks: 0, Interceptions: 0, FumblesForced: 0 };
              }

              return (
                <Card className="matchupOpponent-playerCard" key={index}>
                  <Card.Header className='matchupOpponent-playerCard-header'>{positionLabelMapping[slot]}</Card.Header>
                  <Card.Body className="matchupOpponent-playerCard-body">
                    <div className="matchupOpponent-details">
                      <Card.Title className="player-name">
                        {player.Name && player.Name.split(' ').map((namePart, index) => (
                          <div key={index}>{namePart}</div>
                        ))}
                      </Card.Title>
                      {player.Name !== 'Empty Player Slot' ? (
                        <>
                          <div className="matchupOpponent-stat">
                            <div className="matchupOpponent-card-label">Position:</div>
                            <div className="matchupOpponent-card-text">{player.Position}</div>
                          </div>
                          <div className="matchupOpponent-stat">
                            <div className="matchupOpponent-card-label">Team:</div>
                            <div className="matchupOpponent-card-text">{player.Team}</div>
                          </div>
                          <div className="matchupOpponent-stat">
                            <div className="matchupOpponent-card-label">Projected Points:</div>
                            <div className="matchupOpponent-card-text">
                              {selectedLeague && calculateProjectedPoints(playerWeekData, selectedLeague.settings.scoringSettings).toFixed(2)}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="matchupOpponent-stat">
                            <div className="matchupOpponent-card-label">Position:</div>
                            <div className="matchupOpponent-card-text">N/A</div>
                          </div>
                          <div className="matchupOpponent-stat">
                            <div className="matchupOpponent-card-label">Team:</div>
                            <div className="matchupOpponent-card-text">N/A</div>
                          </div>
                          <div className="matchupOpponent-stat">
                            <div className="matchupOpponent-card-label">Projected Points:</div>
                            <div className="matchupOpponent-card-text">N/A</div>
                          </div>
                        </>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              );
            }))}
          </Card.Body>
        </Card>
      </div>
    </div>
  );



};

export default Matchup;