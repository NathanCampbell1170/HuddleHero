import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {auth, db} from "../Firebase-config";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import {Row, Col} from 'react-bootstrap'
import "../styles/LeagueCards.css";
import EditLeagueSettings from './EditLeagueSettings';
import LeagueChat from './LeagueChat'


function LeagueCards({ user }) {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const scoringSettingsOrder = ['Passing', 'Rushing', 'Receiving', 'Defence', 'Kicking']
  const isUserCommissioner = selectedLeague && selectedLeague.commissioner === user.email;

  useEffect(() => {
    const fetchLeagues = async () => {
      const leaguesRef = collection(db, 'leagues');
      const q = query(leaguesRef, where('members', 'array-contains', user.email));
  
      const querySnapshot = await getDocs(q);
      const leaguesData = await Promise.all(querySnapshot.docs.map(async doc => {
        const league = doc.data();
        // Fetch the display names of the members
        league.members = await Promise.all(league.members.map(getDisplayName));
        return league;
      }));
      setLeagues(leaguesData);
    };
  
    fetchLeagues();
  }, [user]);
  


  async function getDisplayName(email) {
    const userRef = collection(db, 'users');
    const q = query(userRef, where('email', '==', email));
  
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Assuming each email is unique and there's only one document with the given email
      return querySnapshot.docs[0].data().displayName;
    } else {
      return null; // or some default value
    }
  }

  const keyMapping = {
    passYRD: 'Passing Yards',
    passTD: 'Passing Touchdowns',
    interception: 'Interceptions',
    rushYRD: 'Rushing Yards',
    rushTD: "Rushing Touchdowns",
    fumble: "Fumble",
    fumbleLost: "Fumble Lost",
    recYRD: "Receiving Yards",
    reception: "Reception",
    sack: "Sack",
    defInterception: "Interception",
    fumblerecovery: "Fumble Recovery",
    returnTD: "Return Touchdown",
    safety: "Safety",
    blockedKick: "Blocked Kick",
    FG_39: "Field Goal Made 0-39 Yards",
    FG40_49: "Field Goal Made 40-49 Yards",
    FG50Plus: "Field Goal Made 50+ Yards",
    FGMiss: "Field Goal Missed",
    shutout: "0 Points Allowed",
    points1_6: "1-6 Points Allowed",
    points7_13: "7-13 Points Allowed",
    points14_20: "14-20 Points Allowed",
    points21_27: "21-27 Points Allowed",
    points28_34: "28-34 Points Allowed",
    points35Plus: "35+ Points Allowed"



  };
  
  return (
    <div>
      {leagues.map((league, index) => (
        <Card key={index} style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>{league.leagueName}</Card.Title>
            <Card.Text>
              Created by: {league.creator}
              {/* Add more league details here */}
            </Card.Text>
            <Button variant="primary" onClick={() => setSelectedLeague(league)}>
              View Details
            </Button>
          </Card.Body>
        </Card>
      ))}

      {/* Modal for displaying league details */}
      <Modal show={selectedLeague !== null} onHide={() => setSelectedLeague(null)} size="xl" dialogClassName="leagueModal">
                <Modal.Header closeButton>
                <Modal.Title>{selectedLeague?.leagueName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Tabs defaultActiveKey="myTeam" id="uncontrolled-tab-example" className="leagueTab">
                        <Tab eventKey="myTeam" title="My Team">
                        {/* Content for My Team tab */}
                        </Tab>
                        <Tab eventKey="matchup" title="Matchup">
                        {/* Content for Matchup tab */}
                        </Tab>
                        <Tab eventKey="addPlayers" title="Add Players">
                        {/* Content for Add Players tab */}
                        </Tab>
                        <Tab eventKey="leagueChat" title="League Chat">
                        {/* Content for League Chat tab */}
                        <LeagueChat selectedLeague={selectedLeague} user={user} />
                        </Tab>
                        <Tab eventKey="leagueSettings" title="League Settings">
                            {/* Content for League Settings tab */}
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                <Card.Title>League Members</Card.Title>
                                {selectedLeague?.members.map((member, index) => (
                                    <Card.Text key={index}>
                                    {member}
                                    </Card.Text>
                                ))}
                                </Card.Body>
                            </Card>

                            <Card style={{ width: '50rem' }}>
                                <Card.Body>
                                    <Card.Title>Scoring Settings</Card.Title>
                                    {scoringSettingsOrder.map((category, index) => {
                                        const settings = selectedLeague?.settings?.scoringSettings[category];
                                        if (!settings) return null;  // Skip if the category doesn't exist in the settings
                                        return (
                                            <div key={index}>
                                                <hr></hr><br></br><h4>{category}</h4> <br></br>
                                                <Row>
                                                    {Object.entries(settings).map(([key, value], i) => (
                                                        <Col md={6} key={i}>
                                                            <Card.Text>
                                                                <strong>{keyMapping[key] || key}:</strong> {value}
                                                            </Card.Text>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </div>
                                        );
                                    })}
                                </Card.Body>
                            </Card>
                        </Tab>
                        <Tab eventKey="leagueDetails" title="Edit League Settings">
                           <EditLeagueSettings selectedLeague={selectedLeague} user={user} />
                        </Tab>
                    </Tabs>
        </Modal.Body>
            </Modal>
    </div>
  );
}

export default LeagueCards;
