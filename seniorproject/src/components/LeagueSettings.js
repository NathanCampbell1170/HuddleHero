import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { db } from "../Firebase-config";

import "../styles/LeagueSettings.css";


const LeagueSettings = ({ selectedLeague, beginnerMode }) => {
  const [leagueData, setLeagueData] = useState(null);

  const scoringSettingsOrder = ['Passing', 'Rushing', 'Receiving', 'Kicking', 'Defence']

  const defenceScoringOrder = ['shutout', 'points1_6', 'points7_13', 'points14_20', 'points21_27', 'points28_34', 'points35Plus', 'sack', 'defInterception', 'fumbleRecovery', 'safety', 'returnTD', 'blockedKick']

  const getDisplayName = async (email) => {
    const userRef = collection(db, 'users');
    const q = query(userRef, where('email', '==', email));

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Assuming each email is unique and there's only one document with the given email
      return querySnapshot.docs[0].data().displayName;
    } else {
      return null; // or some default value
    }
  };

  useEffect(() => {
    if (selectedLeague) {
      const q = query(collection(db, 'leagues'), where('id', '==', selectedLeague.id));

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const leaguesData = await Promise.all(querySnapshot.docs.map(async doc => {
          const league = doc.data();
          // Fetch the display names of the members
          league.memberDisplayNames = await Promise.all(league.members.map(getDisplayName));
          setLeagueData(league);
        }));
      });


      // Clean up the subscription on unmount
      return () => unsubscribe();
    }
  }, [selectedLeague]);


  if (!leagueData) {
    return <div>Loading...</div>;
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
    extraPoint: "Extra Point Made",
    shutout: "0 Points Allowed",
    points1_6: "1-6 Points Allowed",
    points7_13: "7-13 Points Allowed",
    points14_20: "14-20 Points Allowed",
    points21_27: "21-27 Points Allowed",
    points28_34: "28-34 Points Allowed",
    points35Plus: "35+ Points Allowed"



  };

  const rosterSettingsOrder = ['startQB', 'startRB', 'startWR', 'startTE', 'startFLEX', 'startK', 'startDEF', 'bench'];


  return (
    <div className="customTabContent show-league-settings-container">
      <div className="show-league-settings-two-columns">
        <Card className="show-league-settings-card show-league-settings-members-card">
          <Card.Body>
            <Card.Title className="show-league-settings-title">League Members</Card.Title>
            {leagueData.memberDisplayNames?.map((displayName, index) => (
              <Card key={index} className="show-league-settings-subcard show-league-settings-member-subcard">
                <Card.Body>
                  <Card.Text className="show-league-settings-member">
                    <strong>{displayName}</strong>
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
            {leagueData.amountofPlayers && leagueData.members && Array(Math.max(0, leagueData.amountofPlayers - leagueData.members.length)).fill().map((_, index) => (
              <Card key={index + leagueData.members.length} className="show-league-settings-subcard show-league-settings-slot-subcard">
                <Card.Body>
                  <Card.Text className="show-league-settings-slot">
                    <em>Empty Team Slot</em>
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </Card.Body>
        </Card>
        <Card className="show-league-settings-card show-league-settings-roster-card">
          <Card.Body>
            <Card.Title className="show-league-settings-title">Roster Settings</Card.Title>
            {rosterSettingsOrder.map((key, index) => {
              const value = leagueData.settings.rosterSettings[key];
              if (value === undefined) return null; // Skip if the key doesn't exist in the settings
              return (
                <Card key={index} className="show-league-settings-subcard show-league-settings-roster-setting-subcard">
                  <Card.Body>
                    <Card.Text className="show-league-settings-roster-setting">
                      <strong>{key}:</strong> {value}
                    </Card.Text>
                  </Card.Body>
                </Card>
              );
            })}
          </Card.Body>
        </Card>
      </div>
      <Card className="show-league-settings-card show-league-settings-scoring-card">
        <Card.Body>
          <Card.Title className="show-league-settings-title">Scoring Settings</Card.Title>
          <div className="show-league-settings-scoring-flex">
            {scoringSettingsOrder.map((category, index) => {
              const settings = leagueData.settings.scoringSettings[category];
              if (!settings) return null;
              const order = category === 'Defence' ? defenceScoringOrder : Object.keys(settings);
              return (
                <Card key={index} className={`show-league-settings-subcard show-league-settings-scoring-category ${category === 'Defence' ? 'defence-category' : ''}`}>

                  <Card.Body>
                    <Card.Title className="show-league-settings-scoring-title">{category}</Card.Title>
                    {order.map((key, i) => {
                      const value = settings[key];
                      if (value === undefined) return null;
                      return (
                        <Card key={i} className="show-league-settings-subcard show-league-settings-scoring-subcard">
                          <Card.Body>
                            <Card.Text className="show-league-settings-scoring-text">
                              <strong>{keyMapping[key] || key}:</strong> {value}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      );
                    })}
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </Card.Body>
      </Card>
    </div>
  );




};

export default LeagueSettings;
