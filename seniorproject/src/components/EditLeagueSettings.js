import React, { useState, useEffect } from "react";
import { addDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db, auth } from "../Firebase-config";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';

const EditLeagueSettings = ({ selectedLeague }) => {

  const [user, setUser] = useState(null);
  const [key, setKey] = useState('leagueInfo');
  const [displayName, setDisplayName] = useState("")
  const userCollection = collection(db, "users");

  //League Settings useStates
  const [leagueName, setLeagueName] = useState(selectedLeague?.leagueName || 'Default League Name')
  const [TEAMS, setTEAMS] = useState(10);
  const [QB, setQB] = useState(null);
  const [RB, setRB] = useState(null);
  const [WR, setWR] = useState(null);
  const [TE, setTE] = useState(null);
  const [FLEX, setFLEX] = useState(null);
  const [K, setK] = useState(null);
  const [DEF, setDEF] = useState(null);
  const [BENCH, setBENCH] = useState(null);


  //Scoring Settings UseStates
  const [passYRD, setPassYRD] = useState(.04);
  const [passTD, setPassTD] = useState(4);
  const [interception, setInterception] = useState(-2);
  const [rushYRD, setRushYRD] = useState(.1);
  const [rushTD, setRushTD] = useState(6);
  const [fumble, setFumble] = useState(-1);
  const [fumbleLost, setFumbleLost] = useState(-3);
  const [recYRD, setRecYRD] = useState(.1);
  const [recTD, setRecTD] = useState(6);
  const [reception, setReceptions] = useState(.5);
  const [sack, setSack] = useState(1);
  const [defInterception, setDefInterception] = useState(2);
  const [fumblerecovery, setFumblerecovery] = useState(2);
  const [returnTD, setReturnTD] = useState(6);
  const [safety, setSafety] = useState(2);
  const [blockedKick, setBlockedKick] = useState(2);
  const [FG0_39, setFG0_39] = useState(3);
  const [FG40_49, setFG40_49] = useState(4);
  const [FG50Plus, setFG50Plus] = useState(5);
  const [FGMiss, setFGMiss] = useState(-1);
  const [shutout, setShutout] = useState(10);
  const [points1_6, setPoints1_6] = useState(8);
  const [points7_13, setPoints7_13] = useState(6);
  const [points14_20, setPoints14_20] = useState(4);
  const [points21_27, setPoints21_27] = useState(2);
  const [points28_34, setPoints28_34] = useState(0);
  const [points35Plus, setPoints35Plus] = useState(-2);


  const handleChange = (event) => {
    const value = Number(event.target.value);
    switch (event.target.name) {
        case 'Teams':
            setTEAMS(value);
            break;  
        case 'QB':
            setQB(value);
            console.log(QB)
            break;
        case 'RB':
            setRB(value);
            break;
        case 'WR':
            setWR(value);
            break;
        case 'TE':
            setTE(value);
            break;
        case 'FLEX':
            setFLEX(value);
            break;
        case 'K':
            setK(value);
            break;
        case 'DEF':
            setDEF(value);
            break;
        case 'BENCH':
            setBENCH(value);
            break;
        case 'passYRD':
            setPassYRD(value);
            break;
          case 'passTD':
            setPassTD(value);
            break;
          case 'interception':
            setInterception(value);
            break;
          case 'rushYRD':
            setRushYRD(value);
            break;
          case 'rushTD':
            setRushTD(value);
            break;
          case 'fumble':
            setFumble(value);
            break;
          case 'fumbleLost':
            setFumbleLost(value);
            break;
          case 'recYRD':
            setRecYRD(value);
            break;
          case 'recTD':
            setRecTD(value);
            break;
          case 'reception':
            setReceptions(value);
            break;
          case 'sack':
            setSack(value);
            break;
          case 'defInterception':
            setDefInterception(value);
            break;
          case 'fumblerecovery':
            setFumblerecovery(value);
            break;
          case 'returnTD':
            setReturnTD(value);
            break;
          case 'safety':
            setSafety(value);
            break;
          case 'blockedKick':
            setBlockedKick(value);
            break;
          case 'FG0_39':
            setFG0_39(value);
            break;
          case 'FG40_49':
            setFG40_49(value);
            break;
          case 'FG50Plus':
            setFG50Plus(value);
            break;
          case 'FGMiss':
            setFGMiss(value);
            break;
          case 'shutout':
            setShutout(value);
            break;
          case 'points1_6':
            setPoints1_6(value);
            break;
          case 'points7_13':
            setPoints7_13(value);
            break;
          case 'points14_20':
            setPoints14_20(value);
            break;
          case 'points21_27':
            setPoints21_27(value);
            break;
          case 'points28_34':
            setPoints28_34(value);
            break;
          case 'points35Plus':
            setPoints35Plus(value);
            break;
          default:
            break;
    }
}

const handleEmailChange = (index, event) => {
  const newEmails = [...emails];
  newEmails[index] = event.target.value;
  setEmails(newEmails)
}

  //Invite Users UseStates
  const [emails, setEmails] = useState(Array(TEAMS).fill(""));

  useEffect(() => {
    setEmails(Array(TEAMS).fill(""));
  }, [TEAMS]);

  const handleUpdateLeague = async () => {
    try {
      const leaguesRef = collection(db, 'leagues');
      const q = query(leaguesRef, where('id', '==', selectedLeague.id));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const leagueDoc = querySnapshot.docs[0];
        const currentData = leagueDoc.data();
  
        // Only update if the values are different
        const newData = {
          leagueName: leagueName !== currentData.leagueName ? leagueName : currentData.leagueName,
          settings: {
            rosterSettings: {
              startQB: QB !== currentData.settings.rosterSettings.startQB ? QB : currentData.settings.rosterSettings.startQB,
              startRB: RB !== currentData.settings.rosterSettings.startRB ? RB : currentData.settings.rosterSettings.startRB,
              startWR: WR !== currentData.settings.rosterSettings.startWR ? WR : currentData.settings.rosterSettings.startWR,
              startTE: TE !== currentData.settings.rosterSettings.startTE ? TE : currentData.settings.rosterSettings.startTE,
              startFLEX: FLEX !== currentData.settings.rosterSettings.startFLEX ? FLEX : currentData.settings.rosterSettings.startFLEX,
              startK: K !== currentData.settings.rosterSettings.startK ? K : currentData.settings.rosterSettings.startK,
              startDEF: DEF !== currentData.settings.rosterSettings.startDEF ? DEF : currentData.settings.rosterSettings.startDEF,
              bench: BENCH !== currentData.settings.rosterSettings.bench ? BENCH : currentData.settings.rosterSettings.bench
            },
            scoringSettings: {
              Passing: {
                passYRD: passYRD !== currentData.settings.scoringSettings.Passing.passYRD ? passYRD : currentData.settings.scoringSettings.Passing.passYRD,
                passTD: passTD !== currentData.settings.scoringSettings.Passing.passTD ? passTD : currentData.settings.scoringSettings.Passing.passTD,
                interception: interception !== currentData.settings.scoringSettings.Passing.interception ? interception : currentData.settings.scoringSettings.Passing.interception
              },
              Rushing: {
                rushYRD: rushYRD !== currentData.settings.scoringSettings.Rushing.rushYRD ? rushYRD : currentData.settings.scoringSettings.Rushing.rushYRD,
                rushTD: rushTD !== currentData.settings.scoringSettings.Rushing.rushTD ? rushTD : currentData.settings.scoringSettings.Rushing.rushTD,
                fumble: fumble !== currentData.settings.scoringSettings.Rushing.fumble ? fumble : currentData.settings.scoringSettings.Rushing.fumble,
                fumbleLost: fumbleLost !== currentData.settings.scoringSettings.Rushing.fumbleLost ? fumbleLost : currentData.settings.scoringSettings.Rushing.fumbleLost
              },
              Receiving: {
                recYRD: recYRD !== currentData.settings.scoringSettings.Receiving.recYRD ? recYRD : currentData.settings.scoringSettings.Receiving.recYRD,
                recTD: recTD !== currentData.settings.scoringSettings.Receiving.recTD ? recTD : currentData.settings.scoringSettings.Receiving.recTD,
                reception: reception !== currentData.settings.scoringSettings.Receiving.reception ? reception : currentData.settings.scoringSettings.Receiving.reception
              },
              Defence: {
                sack: sack !== currentData.settings.scoringSettings.Defence.sack ? sack : currentData.settings.scoringSettings.Defence.sack,
                defInterception: defInterception !== currentData.settings.scoringSettings.Defence.defInterception ? defInterception : currentData.settings.scoringSettings.Defence.defInterception,
                fumblerecovery: fumblerecovery !== currentData.settings.scoringSettings.Defence.fumblerecovery ? fumblerecovery : currentData.settings.scoringSettings.Defence.fumblerecovery,
                returnTD: returnTD !== currentData.settings.scoringSettings.Defence.returnTD ? returnTD : currentData.settings.scoringSettings.Defence.returnTD,
                safety: safety !== currentData.settings.scoringSettings.Defence.safety ? safety : currentData.settings.scoringSettings.Defence.safety,
                blockedKick: blockedKick !== currentData.settings.scoringSettings.Defence.blockedKick ? blockedKick : currentData.settings.scoringSettings.Defence.blockedKick,
                shutout: shutout !== currentData.settings.scoringSettings.Defence.shutout ? shutout : currentData.settings.scoringSettings.Defence.shutout,
                points1_6: points1_6 !== currentData.settings.scoringSettings.Defence.points1_6 ? points1_6 : currentData.settings.scoringSettings.Defence.points1_6,
                points7_13: points7_13 !== currentData.settings.scoringSettings.Defence.points7_13 ? points7_13 : currentData.settings.scoringSettings.Defence.points7_13,
                points14_20: points14_20 !== currentData.settings.scoringSettings.Defence.points14_20 ? points14_20 : currentData.settings.scoringSettings.Defence.points14_20,
                points21_27: points21_27 !== currentData.settings.scoringSettings.Defence.points21_27 ? points21_27 : currentData.settings.scoringSettings.Defence.points21_27,
                points28_34: points28_34 !== currentData.settings.scoringSettings.Defence.points28_34 ? points28_34 : currentData.settings.scoringSettings.Defence.points28_34,
                points35Plus: points35Plus !== currentData.settings.scoringSettings.Defence.points35Plus ? points35Plus : currentData.settings.scoringSettings.Defence.points35Plus
              },
              Kicking: {
                FG0_39: FG0_39 !== currentData.settings.scoringSettings.Kicking.FG0_39 ? FG0_39 : currentData.settings.scoringSettings.Kicking.FG0_39,
                FG40_49: FG40_49 !== currentData.settings.scoringSettings.Kicking.FG40_49 ? FG40_49 : currentData.settings.scoringSettings.Kicking.FG40_49,
                FG50Plus: FG50Plus !== currentData.settings.scoringSettings.Kicking.FG50Plus ? FG50Plus : currentData.settings.scoringSettings.Kicking.FG50Plus,
                FGMiss: FGMiss !== currentData.settings.scoringSettings.Kicking.FGMiss ? FGMiss : currentData.settings.scoringSettings.Kicking.FGMiss
              }
            }
          }
        };
  
        await updateDoc(leagueDoc.ref, newData);
        console.log('League document updated successfully!');
      } else {
        console.log('League not found.');
      }
    } catch (error) {
      console.error('Error updating league document:', error);
    }
  };
  

  if (!selectedLeague) {
    return <p>No league selected.</p>;
  }
  // Display the league ID
  return (
    <div>
      <Card>
      <Card.Body>
        <Card.Title>{leagueName}</Card.Title>
        <Card.Text>
          <strong>Commissioner:</strong> {selectedLeague.commissioner} {"--->"} {selectedLeague.creator}
        </Card.Text>
      </Card.Body>
    </Card>
      {/* Display other relevant league details */}

 
        <Modal.Header closeButton>
          <Modal.Title>Edit League Settings</Modal.Title>
        </Modal.Header>

        <Tabs activeKey={key} onSelect={(k) => setKey(k)} id="createLeague">
          <Tab eventKey="leagueInfo" title="League Info">
    
              <p>This is league info</p>
              <label>League Name:</label> <input value={leagueName} onChange={(event) => {setLeagueName(event.target.value)}}></input>
              {/*<label>Number of Teams</label> <select name="Teams" value={TEAMS} onChange={handleChange}> <option value="2">2</option><option value="4">4</option><option value="6">6</option><option value="8">8</option><option value="10">10</option><option value="12">12</option><option value="16">16</option></select>
              */}<br></br>
              <hr></hr>
              <label>Roster Settings</label>
              <br></br>

                <label>QB</label> <select name="QB" value={QB || selectedLeague?.settings?.rosterSettings?.startQB || 1} onChange={handleChange}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>
                <label>RB</label> <select name="RB" value={RB || selectedLeague?.settings?.rosterSettings?.startRB || 2} onChange={handleChange}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>
                <label>WR</label> <select name="WR" value={WR || selectedLeague?.settings?.rosterSettings?.startWR || 2} onChange={handleChange}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>
                <label>TE</label> <select name="TE" value={TE || selectedLeague?.settings?.rosterSettings?.startTE || 1} onChange={handleChange}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>
                <label>FLEX</label> <select name="FLEX" value={FLEX || selectedLeague?.settings?.rosterSettings?.startFLEX || 2} onChange={handleChange}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>
                <label>K</label> <select name="K" value={K || selectedLeague?.settings?.rosterSettings?.startK || 1} onChange={handleChange}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>
                <label>DEF</label> <select name="DEF" value={DEF || selectedLeague?.settings?.startDEF || 1} onChange={handleChange}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>
                <label>BENCH</label> <select name="BENCH" value={BENCH || selectedLeague?.settings?.rosterSettings?.bench || 5} onChange={handleChange}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>

              <Button onClick={() => setKey('scoringSettings')}>Next</Button>

          </Tab>
          <Tab eventKey="scoringSettings" title="Scoring Settings">

              <p>Scoring Settings</p>
              <br></br>
              <h4><label>Passing</label></h4> <br></br> 
                <label>Pass YRD</label> 
                <input type="number" name="passYRD" value={passYRD} onChange={(e) => setPassYRD(Number(e.target.value))} />

                <label>Pass TD</label>  
                <input type="number" name="passTD" value={passTD} onChange={(e) => setPassTD(Number(e.target.value))} />

                <label>Interception</label> 
                <input type="number" name="interception" value={interception} onChange={(e) => setInterception(Number(e.target.value))} /> <br></br> 

                <h4><label>Rushing</label></h4> <br></br> 
                <label>Rush YRD</label> 
                <input type="number" name="rushYRD" value={rushYRD} onChange={(e) => setRushYRD(Number(e.target.value))} />

                <label>Rush TD</label> 
                <input type="number" name="rushTD" value={rushTD} onChange={(e) => setRushTD(Number(e.target.value))} />

                <label>Fumble</label> 
                <input type="number" name="fumble" value={fumble} onChange={(e) => setFumble(Number(e.target.value))} />

                <label>Fumble Lost</label> 
                <input type="number" name="fumbleLost" value={fumbleLost} onChange={(e) => setFumbleLost(Number(e.target.value))} /> <br></br> 

                <h4><label>Receiving</label></h4> <br></br> 
                <label>Rec YRD</label> 
                <input type="number" name="recYRD" value={recYRD} onChange={(e) => setRecYRD(Number(e.target.value))} />

                <label>Rec TD</label> 
                <input type="number" name="recTD" value={recTD} onChange={(e) => setRecTD(Number(e.target.value))} />

                <label>Receptions</label> 
                <input type="number" name="reception" value={reception} onChange={(e) => setReceptions(Number(e.target.value))} /> <br></br> 

                <h4><label>Defence</label></h4> <br></br> 
                <label>Sack</label> 
                <input type="number" name="sack" value={sack} onChange={(e) => setSack(Number(e.target.value))} />

                <label>Def Interception</label> 
                <input type="number" name="defInterception" value={defInterception} onChange={(e) => setDefInterception(Number(e.target.value))} />

                <label>Fumble Recovery</label> 
                <input type="number" name="fumblerecovery" value={fumblerecovery} onChange={(e) => setFumblerecovery(Number(e.target.value))} />

                <label>Return TD</label> 
                <input type="number" name="returnTD" value={returnTD} onChange={(e) => setReturnTD(Number(e.target.value))} />

                <label>Safety</label> 
                <input type="number" name="safety" value={safety} onChange={(e) => setSafety(Number(e.target.value))} />

                <label>Blocked Kick</label> 
                <input type="number" name="blockedKick" value={blockedKick} onChange={(e) => setBlockedKick(Number(e.target.value))} />

                <label>Shutout</label> 
                <input type="number" name="shutout" value={shutout} onChange={(e) => setShutout(Number(e.target.value))} />

                <label>Points 1-6</label> 
                <input type="number" name="points1_6" value={points1_6} onChange={(e) => setPoints1_6(Number(e.target.value))} />

                <label>Points 7-13</label> 
                <input type="number" name="points7_13" value={points7_13} onChange={(e) => setPoints7_13(Number(e.target.value))} />

                <label>Points 14-20</label> 
                <input type="number" name="points14_20" value={points14_20} onChange={(e) => setPoints14_20(Number(e.target.value))} />

                <label>Points 21-27</label> 
                <input type="number" name="points21_27" value={points21_27} onChange={(e) => setPoints21_27(Number(e.target.value))} />

                <label>Points 28-34</label> 
                <input type="number" name="points28_34" value={points28_34} onChange={(e) => setPoints28_34(Number(e.target.value))} />

                <label>Points 35 Plus</label> 
                <input type="number" name="points35Plus" value={points35Plus} onChange={(e) => setPoints35Plus(Number(e.target.value))} /> <br></br> 


                <h4><label>Kicking</label> </h4> <br></br> 
                <label>FG 0-39</label> 
                <input type="number" name="FG0_39" value={FG0_39} onChange={(e) => setFG0_39(Number(e.target.value))} />

                <label>FG 40-49</label> 
                <input type="number" name="FG40_49" value={FG40_49} onChange={(e) => setFG40_49(Number(e.target.value))} />

                <label>FG 50 Plus</label> 
                <input type="number" name="FG50Plus" value={FG50Plus} onChange={(e) => setFG50Plus(Number(e.target.value))} />

                <label>FG Miss</label> 
                <input type="number" name="FGMiss" value={FGMiss} onChange={(e) => setFGMiss(Number(e.target.value))} />


              <Button onClick={() => setKey('inviteUsers')}>Next</Button>

          </Tab>
          <Tab eventKey="inviteUsers" title="Invite Users">

              <p>This is Invite Users</p> <br></br>
              <h4>Members: </h4>
              <input type = "email" value= {selectedLeague.commissioner} readOnly />
              {Array.from({ length: selectedLeague.members.length -1 }, (_, index) => (
                <input
                    key={index}
                    type="email"
                    placeholder={`Member ${index + 2}`}
                    value={selectedLeague.members[index+1]}
                    onChange={(event) => handleEmailChange(index, event)}
                    readOnly
                />
                ))}
              <Button variant="primary" onClick={handleUpdateLeague}>Update Settings</Button>


          </Tab>
        </Tabs>
    </div>
  );
};

export default EditLeagueSettings;
