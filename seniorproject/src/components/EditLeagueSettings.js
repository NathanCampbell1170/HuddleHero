import { addDoc, collection, deleteDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { auth, db } from "../Firebase-config";
import "../styles/EditLeagueSettings.css";

const EditLeagueSettings = ({ selectedLeague, beginnerMode }) => {

  const [user, setUser] = useState(null);
  const [key, setKey] = useState('leagueInfo');
  const [displayName, setDisplayName] = useState("")
  const userCollection = collection(db, "users");
  const [friends, setFriends] = useState([])


  //League Settings useStates
  const [leagueName, setLeagueName] = useState(selectedLeague?.leagueName || 'Default League Name')
  const [TEAMS, setTEAMS] = useState(selectedLeague.amountofPlayers);
  const [QB, setQB] = useState(selectedLeague.settings.rosterSettings.startQB);
  const [RB, setRB] = useState(selectedLeague.settings.rosterSettings.startRB);
  const [WR, setWR] = useState(selectedLeague.settings.rosterSettings.startWR);
  const [TE, setTE] = useState(selectedLeague.settings.rosterSettings.startTE);
  const [FLEX, setFLEX] = useState(selectedLeague.settings.rosterSettings.startFLEX);
  const [K, setK] = useState(selectedLeague.settings.rosterSettings.startK);
  const [DEF, setDEF] = useState(selectedLeague.settings.rosterSettings.startDEF);
  const [BENCH, setBENCH] = useState(selectedLeague.settings.rosterSettings.bench);


  //Scoring Settings UseStates
  const [passYRD, setPassYRD] = useState(selectedLeague.settings.scoringSettings.Passing.passYRD);
  const [passTD, setPassTD] = useState(selectedLeague.settings.scoringSettings.Passing.passTD);
  const [interception, setInterception] = useState(selectedLeague.settings.scoringSettings.Passing.interception);
  const [rushYRD, setRushYRD] = useState(selectedLeague.settings.scoringSettings.Rushing.rushYRD);
  const [rushTD, setRushTD] = useState(selectedLeague.settings.scoringSettings.Rushing.rushTD);
  const [fumble, setFumble] = useState(selectedLeague.settings.scoringSettings.Rushing.fumble);
  const [fumbleLost, setFumbleLost] = useState(selectedLeague.settings.scoringSettings.Rushing.fumbleLost);
  const [recYRD, setRecYRD] = useState(selectedLeague.settings.scoringSettings.Receiving.recYRD);
  const [recTD, setRecTD] = useState(selectedLeague.settings.scoringSettings.Receiving.recTD);
  const [reception, setReceptions] = useState(selectedLeague.settings.scoringSettings.Receiving.reception);
  const [sack, setSack] = useState(selectedLeague.settings.scoringSettings.Defence.sack);
  const [defInterception, setDefInterception] = useState(selectedLeague.settings.scoringSettings.Defence.defInterception);
  const [fumblerecovery, setFumblerecovery] = useState(selectedLeague.settings.scoringSettings.Defence.fumblerecovery);
  const [returnTD, setReturnTD] = useState(selectedLeague.settings.scoringSettings.Defence.returnTD);
  const [safety, setSafety] = useState(selectedLeague.settings.scoringSettings.Defence.safety);
  const [blockedKick, setBlockedKick] = useState(selectedLeague.settings.scoringSettings.Defence.blockedKick);
  const [FG0_39, setFG0_39] = useState(selectedLeague.settings.scoringSettings.Kicking.FG0_39);
  const [FG40_49, setFG40_49] = useState(selectedLeague.settings.scoringSettings.Kicking.FG40_49);
  const [FG50Plus, setFG50Plus] = useState(selectedLeague.settings.scoringSettings.Kicking.FG50Plus);
  const [FGMiss, setFGMiss] = useState(selectedLeague.settings.scoringSettings.Kicking.FGMiss);
  const [shutout, setShutout] = useState(selectedLeague.settings.scoringSettings.Defence.shutout);
  const [points1_6, setPoints1_6] = useState(selectedLeague.settings.scoringSettings.Defence.points1_6);
  const [points7_13, setPoints7_13] = useState(selectedLeague.settings.scoringSettings.Defence.points7_13);
  const [points14_20, setPoints14_20] = useState(selectedLeague.settings.scoringSettings.Defence.points14_20);
  const [points21_27, setPoints21_27] = useState(selectedLeague.settings.scoringSettings.Defence.points21_27);
  const [points28_34, setPoints28_34] = useState(selectedLeague.settings.scoringSettings.Defence.points28_34);
  const [points35Plus, setPoints35Plus] = useState(selectedLeague.settings.scoringSettings.Defence.points35Plus);
  const [extraPoint, setExtraPoint] = useState(selectedLeague.settings.scoringSettings.Kicking.extraPoint);

  const leagueInvitesRef = collection(db, 'leagueInvites');



  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchUser(user)
      }
    });
    return () => unsubscribe();
  }, []);
  async function fetchUser(user) {


    // Query the 'Friends' collection to find the documents where the current user's email is 'user1' or 'user2'
    const friendsQuery1 = query(collection(db, 'Friends'), where('user1', '==', user.email));
    const friendsSnapshot1 = await getDocs(friendsQuery1);

    const friendsQuery2 = query(collection(db, 'Friends'), where('user2', '==', user.email));
    const friendsSnapshot2 = await getDocs(friendsQuery2);

    let friends = [];
    friendsSnapshot1.forEach((doc) => {
      friends.push(doc.data().user2);
    });
    friendsSnapshot2.forEach((doc) => {
      friends.push(doc.data().user1);
    });

    setFriends(friends);
    const fetchUserQuery = query(userCollection, where("email", '==', user.email));
    const querySnapshot = await getDocs(fetchUserQuery);
    const userSettingsDocument = querySnapshot.docs[0];
    setDisplayName(userSettingsDocument.data().displayName)
  }


  const handleChange = (event) => {
    const value = Number(event.target.value);
    switch (event.target.name) {
      case 'Teams':
        setTEAMS(value);
        console.log(value)
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
      case 'extraPoint':
        setExtraPoint(value);
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
          amountofPlayers: TEAMS !== currentData.amountofPlayers ? TEAMS : currentData.amountofPlayers,
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
                FGMiss: FGMiss !== currentData.settings.scoringSettings.Kicking.FGMiss ? FGMiss : currentData.settings.scoringSettings.Kicking.FGMiss,
                extraPoint: extraPoint !== currentData.settings.scoringSettings.Kicking.extraPoint ? extraPoint : currentData.settings.scoringSettings.Kicking.extraPoint
              }
            }
          }
        };
        console.log(emails)
        for (const email of emails) {
          if (email.trim() !== '') {
            // Check if the user is already in the league
            if (!selectedLeague.members.includes(email)) {
              // Check if the user already has a pending invite
              const invitesRef = collection(db, 'leagueInvites');
              const q = query(invitesRef, where('to', '==', email), where('leagueId', '==', selectedLeague.id), where('status', '==', 'pending'));
              const querySnapshot = await getDocs(q);
              if (querySnapshot.empty) {
                // If the user is not in the league and does not have a pending invite, send an invite
                await addDoc(leagueInvitesRef, {
                  leagueName: leagueName,
                  from: displayName,
                  to: email,
                  leagueId: selectedLeague.id,
                  status: 'pending',
                });
                console.log("Invite sent to " + email);
              }
            }
          }
        }

        await updateDoc(leagueDoc.ref, newData);
        console.log('League document updated successfully!');
      } else {
        console.log('League not found.');
      }
    } catch (error) {
      console.error('Error updating league document:', error);
    }
  };


  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleCloseConfirm = () => setShowConfirm(false);
  const handleShowConfirm = () => setShowConfirm(true);


  const deleteSubcollection = async (docRef, subcollectionName) => {
    const subcollectionRef = collection(docRef, subcollectionName);
    const querySnapshot = await getDocs(subcollectionRef);
    querySnapshot.forEach((docSnapshot) => {
      deleteDoc(docSnapshot.ref);
    });
  };

  const deleteLeague = async (selectedLeague) => {
    // Query for the league document
    const leaguesRef = collection(db, 'leagues');
    const q = query(leaguesRef, where("id", "==", selectedLeague.id));
    const querySnapshot = await getDocs(q);

    // There should be only one document with the given id
    const leagueDoc = querySnapshot.docs[0];

    if (!leagueDoc) {
      console.error('League not found');
      return;
    }

    // Delete the 'messages' and 'teams' subcollections
    await deleteSubcollection(leagueDoc.ref, 'messages');
    await deleteSubcollection(leagueDoc.ref, 'teams');

    // Delete the league document
    await deleteDoc(leagueDoc.ref);

  };




  if (!selectedLeague) {
    return <p>No league selected.</p>;
  }

  return (
    <div className="edit-league-settings">
      <Card className="league-commissionercard">
        <Card.Body>
          <Card.Title>{leagueName}</Card.Title>
          <Card.Text>
            <strong>Commissioner:</strong> &nbsp; {" "} {selectedLeague.commissioner} {"--->"} {selectedLeague.creator}
            <Button variant="danger" onClick={handleShowConfirm}>Delete League</Button>
          </Card.Text>
        </Card.Body>
      </Card>



      <Modal.Title>Edit League Settings</Modal.Title>


      <Tabs activeKey={key} onSelect={(k) => setKey(k)} id="createLeague" className="customTabs">
        <Tab eventKey="leagueInfo" title="League Info">
          <Modal.Body>
            <div className="leagueInfo">
              <Card className="leagueInfo-card">
                <Card.Body>
                  <label>League Name:</label>
                  <input placeholder="League Name" onChange={(event) => { setLeagueName(event.target.value) }} maxLength={"20"}></input>
                  <label>Number of Teams</label>
                  <select name="Teams" value={TEAMS} onChange={handleChange}>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                    <option value="10">10</option>
                    <option value="12">12</option>
                    <option value="16">16</option>
                  </select>
                </Card.Body>
              </Card>
            </div>
            <div className="rosterSettings">
              <Card className="rosterSettings-card">
                <Card.Body>
                  <h4>Roster Settings</h4>
                  <Card className="rosterSettings-subcard">
                    <Card.Body>
                      <label>QB</label>
                      <select name="QB" value={QB} onChange={handleChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </Card.Body>
                  </Card>
                  <Card className="rosterSettings-subcard">
                    <Card.Body>
                      <label>RB</label>
                      <select name="RB" value={RB} onChange={handleChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </Card.Body>
                  </Card>
                  <Card className="rosterSettings-subcard">
                    <Card.Body>
                      <label>WR</label>
                      <select name="WR" value={WR} onChange={handleChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </Card.Body>
                  </Card>
                  <Card className="rosterSettings-subcard">
                    <Card.Body>
                      <label>TE</label>
                      <select name="TE" value={TE} onChange={handleChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </Card.Body>
                  </Card>
                  <Card className="rosterSettings-subcard">
                    <Card.Body>
                      <label>FLEX</label>
                      <select name="FLEX" value={FLEX} onChange={handleChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </Card.Body>
                  </Card>
                  <Card className="rosterSettings-subcard">
                    <Card.Body>
                      <label>K</label>
                      <select name="K" value={K} onChange={handleChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </Card.Body>
                  </Card>
                  <Card className="rosterSettings-subcard">
                    <Card.Body>
                      <label>DEF</label>
                      <select name="DEF" value={DEF} onChange={handleChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </Card.Body>
                  </Card>
                  <Card className="rosterSettings-subcard">
                    <Card.Body>
                      <label>BENCH</label>
                      <select name="BENCH" value={BENCH} onChange={handleChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                      </select>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Card>
            </div>
            <Button onClick={() => setKey('scoringSettings')}>Next</Button>
          </Modal.Body>
        </Tab>


        <Tab eventKey="scoringSettings" title="Scoring Settings">
          <Modal.Body className="scoringSettings">
            <h4>Passing</h4>
            <div className="scoringSettings-passing">
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Pass YRD</label>
                    <input type="text" name="passYRD" value={passYRD} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPassYRD(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setPassYRD(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPassYRD(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Pass TD</label>
                    <input type="text" name="passTD" value={passTD} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPassTD(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setPassTD(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPassTD(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Interception</label>
                    <input type="text" name="interception" value={interception} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setInterception(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setInterception(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setInterception(0); } }} />
                  </div>
                </Card.Body>
              </Card>
            </div>
            <h4>Rushing</h4>
            <div className="scoringSettings-rushing">
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Rush YRD</label>
                    <input type="text" name="rushYRD" value={rushYRD} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setRushYRD(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setRushYRD(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setRushYRD(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Rush TD</label>
                    <input type="text" name="rushTD" value={rushTD} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setRushTD(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setRushTD(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setRushTD(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Fumble</label>
                    <input type="text" name="fumble" value={fumble} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFumble(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setFumble(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFumble(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Fumble Lost</label>
                    <input type="text" name="fumbleLost" value={fumbleLost} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFumbleLost(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setFumbleLost(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFumbleLost(0); } }} />
                  </div>
                </Card.Body>
              </Card>
            </div>
            <h4>Receiving</h4>
            <div className="scoringSettings-receiving">
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Rec YRD</label>
                    <input type="text" name="recYRD" value={recYRD} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setRecYRD(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setRecYRD(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setRecYRD(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Rec TD</label>
                    <input type="text" name="recTD" value={recTD} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setRecTD(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setRecTD(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setRecTD(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Receptions</label>
                    <input type="text" name="reception" value={reception} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setReceptions(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setReceptions(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setReceptions(0); } }} />
                  </div>
                </Card.Body>
              </Card>
            </div>
            <h4>Defence</h4>
            <div className="scoringSettings-defence">
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Sack</label>
                    <input type="text" name="sack" value={sack} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setSack(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setSack(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setSack(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Def Interception</label>
                    <input type="text" name="defInterception" value={defInterception} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setDefInterception(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setDefInterception(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setDefInterception(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Fumble Recovery</label>
                    <input type="text" name="fumblerecovery" value={fumblerecovery} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFumblerecovery(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setFumblerecovery(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFumblerecovery(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Return TD</label>
                    <input type="text" name="returnTD" value={returnTD} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setReturnTD(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setReturnTD(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setReturnTD(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Safety</label>
                    <input type="text" name="safety" value={safety} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setSafety(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setSafety(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setSafety(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Blocked Kick</label>
                    <input type="text" name="blockedKick" value={blockedKick} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setBlockedKick(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setBlockedKick(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setBlockedKick(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Shutout</label>
                    <input type="text" name="shutout" value={shutout} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setShutout(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setShutout(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setShutout(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Points 1-6</label>
                    <input type="text" name="points1_6" value={points1_6} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints1_6(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setPoints1_6(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints1_6(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Points 7-13</label>
                    <input type="text" name="points7_13" value={points7_13} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints7_13(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setPoints7_13(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints7_13(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Points 14-20</label>
                    <input type="text" name="points14_20" value={points14_20} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints14_20(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setPoints14_20(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints14_20(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Points 21-27</label>
                    <input type="text" name="points21_27" value={points21_27} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints21_27(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setPoints21_27(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints21_27(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Points 28-34</label>
                    <input type="text" name="points28_34" value={points28_34} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints28_34(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setPoints28_34(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints28_34(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Points 35 Plus</label>
                    <input type="text" name="points35Plus" value={points35Plus} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints35Plus(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setPoints35Plus(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints35Plus(0); } }} />
                  </div>
                </Card.Body>
              </Card>
            </div>
            <h4>Kicking</h4>
            <div className="scoringSettings-defence">
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>FG 0-39</label>
                    <input type="text" name="FG0_39" value={FG0_39} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFG0_39(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setFG0_39(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFG0_39(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>FG 40-49</label>
                    <input type="text" name="FG40_49" value={FG40_49} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFG40_49(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setFG40_49(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFG40_49(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>FG 50 Plus</label>
                    <input type="text" name="FG50Plus" value={FG50Plus} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFG50Plus(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setFG50Plus(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFG50Plus(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>FG Miss</label>
                    <input type="text" name="FGMiss" value={FGMiss} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFGMiss(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setFGMiss(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFGMiss(0); } }} />
                  </div>
                </Card.Body>
              </Card>
              <Card className="scoringSettings-card">
                <Card.Body>
                  <div className="scoringSettings-option">
                    <label>Extra Point</label>
                    <input type="text" name="extraPoint" value={extraPoint} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setExtraPoint(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setExtraPoint(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setExtraPoint(0); } }} />
                  </div>
                </Card.Body>
              </Card>
            </div>
            <Button onClick={() => setKey('inviteUsers')}>Next</Button>
          </Modal.Body>
        </Tab>
        <Tab eventKey="inviteUsers" title="Invite Users">
          <div className="inviteUsers">
            <Modal.Body>
              <h4>Members:</h4>
              {Array.from({ length: selectedLeague.members.length }, (_, index) => (
                <Card className="inviteUsers-card" key={index}>
                  <Card.Body>
                    <input
                      className="input"
                      type="email"
                      placeholder={`Member ${index + 1}`}
                      value={selectedLeague.members[index]}
                      readOnly
                    />
                  </Card.Body>
                </Card>
              ))}
              {Array.from({ length: selectedLeague.amountofPlayers - selectedLeague.members.length }, (_, index) => (
                <Card className="inviteUsers-card" key={index + selectedLeague.members.length}>
                  <Card.Body>
                    <div className="input-container">
                      <select
                        className="input"
                        onChange={(event) => handleEmailChange(index + selectedLeague.members.length, event)}
                      >
                        <option value="">Select or type an email</option>
                        {friends.filter(friendEmail => !selectedLeague.members.includes(friendEmail) && !emails.includes(friendEmail)).map((friendEmail, index) => (
                          <option key={index} value={friendEmail}>{friendEmail}</option>
                        ))}
                      </select>
                      <input
                        className="input"
                        type="email"
                        placeholder={`Invite Member ${index + selectedLeague.members.length + 1}`}
                        value={emails[index + selectedLeague.members.length]}
                        onChange={(event) => handleEmailChange(index + selectedLeague.members.length, event)}
                      />
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </Modal.Body>
            <Modal.Footer>
              <Button className="createleague-createleaguebutton" variant="primary" onClick={handleUpdateLeague}>Update Settings</Button>
            </Modal.Footer>
          </div>
        </Tab>



      </Tabs>
      <Modal show={showConfirm} onHide={handleCloseConfirm}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this league?
          <Button variant="danger" onClick={() => deleteLeague(selectedLeague)}>Yes, delete it</Button>
          <Button variant="secondary" onClick={handleCloseConfirm}>No, keep it</Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EditLeagueSettings;
