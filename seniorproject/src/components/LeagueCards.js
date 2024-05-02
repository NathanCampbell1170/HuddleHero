import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { db } from "../Firebase-config";
import "../styles/LeagueCards.css";
import AddFreeAgents from './AddFreeAgents';
import DraftPlayers from './DraftPlayers';
import EditLeagueSettings from './EditLeagueSettings';
import LeagueChat from './LeagueChat';
import LeagueSettings from "./LeagueSettings";
import Matchup from './Matchup';
import MyTeam from "./MyTeam";

import MyHuddleHero from './MyHuddleHero';

import { AddFreeAgentsContent, DraftContent, EditLeagueSettingsContent, LeagueChatContent, LeagueSettingsContent, MatchupContent, MyTeamContent } from './MyHuddleHeroTutorials';



function LeagueCards({ user, beginnerMode }) {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const scoringSettingsOrder = ['Passing', 'Rushing', 'Receiving', 'Defence', 'Kicking']
  const isUserCommissioner = selectedLeague && selectedLeague.commissioner === user.email;
  const [activeTab, setActiveTab] = useState("myTeam")



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
          <Modal.Title >League: <strong>{selectedLeague?.leagueName}</strong></Modal.Title>
          {beginnerMode && (<MyHuddleHero className="myHuddleHero-LeagueHeader" applyClassToImage>
            {activeTab === 'myTeam' && <MyTeamContent />}
            {activeTab === 'matchup' && <MatchupContent />}
            {activeTab === 'addPlayers' && <AddFreeAgentsContent />}
            {activeTab === 'leagueChat' && <LeagueChatContent />}
            {activeTab === 'leagueSettings' && <LeagueSettingsContent />}
            {activeTab === 'draft' && <DraftContent />}
            {activeTab === 'leagueDetails' && <EditLeagueSettingsContent />}
          </MyHuddleHero>
          )}


        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="myTeam" id="uncontrolled-tab-example" className="customTabs" onSelect={(k) => setActiveTab(k)}>
            {(selectedLeague?.commissioner === user.email || selectedLeague?.draftStatus) && (
              <Tab eventKey="draft" title="Draft" className="customTabContent">
                {/* Content for Draft tab */}
                <DraftPlayers selectedLeague={selectedLeague} beginnerMode={beginnerMode} user={user} />
              </Tab>
            )}
            <Tab eventKey="myTeam" title="My Team" className="customTabContent">
              {/* Content for My Team tab */}
              <MyTeam selectedLeague={selectedLeague} user={user} />
            </Tab>
            <Tab eventKey="matchup" title="Matchup" beginnerMode={beginnerMode} className="customTabContent">
              <Matchup selectedLeague={selectedLeague} user={user} beginnerMode={beginnerMode} />
              {/* Content for Matchup tab */}
            </Tab>
            <Tab eventKey="addPlayers" title="Add Players" className="customTabContent">
              {/* Content for Add Players tab */}
              <AddFreeAgents selectedLeague={selectedLeague} user={user} beginnerMode={beginnerMode} orderByField="AverageDraftPosition" />
            </Tab>
            <Tab eventKey="leagueChat" title="League Chat" className="customTabContent">
              {/* Content for League Chat tab */}
              <LeagueChat selectedLeague={selectedLeague} beginnerMode={beginnerMode} user={user} />
            </Tab>
            <Tab eventKey="leagueSettings" title="League Settings" className="customTabContent">
              <LeagueSettings selectedLeague={selectedLeague} beginnerMode={beginnerMode} />
            </Tab>
            {isUserCommissioner &&
              <Tab eventKey="leagueDetails" title="Edit League Settings">
                <EditLeagueSettings selectedLeague={selectedLeague} beginnerMode={beginnerMode} user={user} />
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
