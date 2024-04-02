import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import {auth, db} from "../Firebase-config";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import {Row, Col} from 'react-bootstrap'
import "../styles/LeagueCards.css";
import EditLeagueSettings from './EditLeagueSettings';
import LeagueChat from './LeagueChat'
import AddFreeAgents from './AddFreeAgents';
import MyTeam from "./MyTeam"
import DraftPlayers from './DraftPlayers';
import LeagueSettings from "./LeagueSettings";


function LeagueCards({ user }) {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const scoringSettingsOrder = ['Passing', 'Rushing', 'Receiving', 'Defence', 'Kicking']
  const isUserCommissioner = selectedLeague && selectedLeague.commissioner === user.email;

  

  useEffect(() => {
    const fetchLeagues = () => {
      const leaguesRef = collection(db, 'leagues');
      const q = query(leaguesRef, where('members', 'array-contains', user.email));
  
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const leaguesData = await Promise.all(querySnapshot.docs.map(async doc => {
          const league = doc.data();
          // Fetch the display names of the members
          league.memberDisplayNames = await Promise.all(league.members.map(getDisplayName));
          return league;
        }));
        setLeagues(leaguesData);
      });
  
      // Clean up the listener when the component is unmounted
      return () => unsubscribe();
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
    <>
        
        {leagues.map((league, index) => (
          <Card key={index} className='league-card'>
            <Card.Body>
              <Card.Title>{league.leagueName}</Card.Title>
              <Card.Text>
                Created by: {league.creator}
                {/* Add more league details here */}
              </Card.Text>
              <Button className="button-modern" variant="primary" onClick={() => setSelectedLeague(league)}>
                View League
              </Button>
            </Card.Body>
          </Card>
          ))}
     

      {/* Modal for displaying league details */}
      <Modal show={selectedLeague !== null} onHide={() => setSelectedLeague(null)} size="xl" dialogClassName="leagueModal">
  <Modal.Header closeButton className="league-title">
    <Modal.Title>League: <strong>{selectedLeague?.leagueName}</strong></Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Tabs defaultActiveKey="myTeam" id="uncontrolled-tab-example" className="customTabs">
      {(selectedLeague?.commissioner === user.email || selectedLeague?.draftStatus) && (
        <Tab eventKey="draft" title="Draft" className="customTabContent">
          {/* Content for Draft tab */}
          <DraftPlayers selectedLeague={selectedLeague} user={user}/>
        </Tab>
      )}
      <Tab eventKey="myTeam" title="My Team" className="customTabContent">
        {/* Content for My Team tab */}
        <MyTeam selectedLeague={selectedLeague} user={user} />
      </Tab>
      <Tab eventKey="matchup" title="Matchup" className="customTabContent">
        {/* Content for Matchup tab */}
      </Tab>
      <Tab eventKey="addPlayers" title="Add Players" className="customTabContent">
        {/* Content for Add Players tab */}
        <AddFreeAgents selectedLeague={selectedLeague} user={user} orderByField="AverageDraftPosition" />
      </Tab>
      <Tab eventKey="leagueChat" title="League Chat" className="customTabContent">
        {/* Content for League Chat tab */}
        <LeagueChat selectedLeague={selectedLeague} user={user} />
      </Tab>
      <Tab eventKey="leagueSettings" title="League Settings" className="customTabContent">
        {/* Content for League Settings tab 
        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>League Members</Card.Title>
            {selectedLeague?.memberDisplayNames.map((displayName, index) => (
              <Card.Text key={index}>
                {displayName}
              </Card.Text>
            ))}
            {selectedLeague?.amountofPlayers && selectedLeague?.members && Array(Math.max(0, selectedLeague?.amountofPlayers - selectedLeague?.members.length)).fill().map((_, index) => (
              <Card.Text key={index + selectedLeague?.members.length}>
                <em>Empty Team Slot</em>
              </Card.Text>
            ))}
          </Card.Body>
        </Card>
        <Card style={{ width: '100%' }}>
          <Card.Body>
            <Card.Title>Scoring Settings</Card.Title>
            {scoringSettingsOrder.map((category, index) => {
              const settings = selectedLeague?.settings?.scoringSettings[category];
              if (!settings) return null;  // Skip if the category doesn't exist in the settings
              return (
                <div key={index} className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h4>{category}</h4> <br></br>
                      <div className="row">
                        {Object.entries(settings).map(([key, value], i) => (
                          <div className="col-6" key={i}>
                            <div className="card">
                              <div className="card-body">
                                <Card.Text>
                                  <strong>{keyMapping[key] || key}:</strong> {value}
                                </Card.Text>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Card.Body>
        </Card>
        */}
        <LeagueSettings selectedLeague = {selectedLeague}/>
      </Tab>
      {isUserCommissioner && 
        <Tab eventKey="leagueDetails" title="Edit League Settings">
          <EditLeagueSettings selectedLeague={selectedLeague} user={user} />
        </Tab>
      }
    </Tabs>
  </Modal.Body>
  <Modal.Footer className="league-footer">
    {/* Modal footer */}
  </Modal.Footer>
</Modal>

    
    </>
  );
}

export default LeagueCards;
