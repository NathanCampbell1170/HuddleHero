import React, { useState, useEffect } from "react";
import { addDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../Firebase-config";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';
import { v4 as uuidv4 } from 'uuid';
import "../styles/CreateLeague.css"

function CreateLeague() {
    const [user, setUser] = useState(null);
    const [key, setKey] = useState('leagueInfo');
    const [displayName, setDisplayName] = useState("")
    const userCollection = collection(db, "users");
    const [showModal, setShowModal] = useState(false);
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);

    const handleClick = () => {
      setShowModal(true);
    };
  
    const handleClose = () => {
      setShowModal(false);
    };

    //League Settings useStates
    const [leagueName, setLeagueName] = useState("League Name")
    const [TEAMS, setTEAMS] = useState(10);
    const [QB, setQB] = useState(1);
    const [RB, setRB] = useState(2);
    const [WR, setWR] = useState(2);
    const [TE, setTE] = useState(1);
    const [FLEX, setFLEX] = useState(2);
    const [K, setK] = useState(1);
    const [DEF, setDEF] = useState(1);
    const [BENCH, setBENCH] = useState(5);

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

    //Invite Users UseStates
    const [emails, setEmails] = useState(Array(TEAMS).fill(""));

    useEffect(() => {
        setEmails(Array(TEAMS).fill(""));
      }, [TEAMS]);


    

    const handleChange = (event) => {
        const value = Number(event.target.value);
        switch (event.target.name) {
            case 'Teams':
                setTEAMS(value);
                break;  
            case 'QB':
                setQB(value);
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
        newEmails[index] = event.target.value.toLowerCase();
        setEmails(newEmails);
    
        const newSelectedFriends = [...selectedFriends];
        newSelectedFriends[index] = event.target.value.toLowerCase();
        setSelectedFriends(newSelectedFriends);
    }
    
    
    async function fetchUser(user) {
        const fetchUserQuery = query(userCollection, where("email", '==', user.email));
        const querySnapshot = await getDocs(fetchUserQuery);
        const userSettingsDocument = querySnapshot.docs[0];
        setDisplayName(userSettingsDocument.data().displayName)
      
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
      }
      
            

    useEffect(() => {
        
        const unsubscribe = auth.onAuthStateChanged((user) => {
          setUser(user);
          if (user) {
          fetchUser(user)
        }
        });
        return () => unsubscribe();
      }, []);

      async function createLeague() {
        const leaguesRef = collection(db, 'leagues');
        const leagueInvitesRef = collection(db, 'leagueInvites');
        const allMembers = [user.email, ...emails.filter(email => email.trim() !== '')];


        try {
          const id = uuidv4();
            const docRef = await addDoc(leaguesRef, {
              id: id,
              creator: displayName,
              members: [user.email], // Only add the creator to the league initially
              leagueName: leagueName,
              commissioner: user.email,
              currentDrafter: "",
              drafterOrder: [],
              draftStatus: false,
              amountofPlayers: allMembers.length,
              settings: {
                rosterSettings: {
                  startQB: QB,
                  startRB: RB,
                  startWR: WR,
                  startTE: TE,
                  startFLEX: FLEX,
                  startK: K,
                  startDEF: DEF,
                  bench: BENCH
                },
                scoringSettings: {
                    Passing: {
                  passYRD: passYRD,
                  passTD: passTD,
                  interception: interception,
                    },
                    Rushing: {
                  rushYRD: rushYRD,
                  rushTD: rushTD,
                  fumble: fumble,
                  fumbleLost: fumbleLost,
                    },
                    Receiving: {
                  recYRD: recYRD,
                  recTD: recTD,
                  reception: reception,
                    },
                    Defence: {
                  sack: sack,
                  defInterception: defInterception,
                  fumblerecovery: fumblerecovery,
                  returnTD: returnTD,
                  safety: safety,
                  blockedKick: blockedKick,
                  shutout: shutout,
                  points1_6: points1_6,
                  points7_13: points7_13,
                  points14_20: points14_20,
                  points21_27: points21_27,
                  points28_34: points28_34,
                  points35Plus: points35Plus
                    },
                    Kicking: {
                  FG0_39: FG0_39,
                  FG40_49: FG40_49,
                  FG50Plus: FG50Plus,
                  FGMiss: FGMiss,
                }
                  
                }
              }
            });


            for (const email of emails) {
                if (email.trim() !== '') {
                    await addDoc(leagueInvitesRef, {
                        leagueName: leagueName,
                        from: user.email,
                        to: email,
                        leagueId: id,
                        status: 'pending',
                    });
                }
            }
        
    
            const messagesRef = collection(docRef, 'messages');
            await addDoc(messagesRef, {
                sender: 'HuddleHero',
                message: 'Welcome to the league! This is your chat space. Feel free to communicate here.',
                timestamp: serverTimestamp() // import this from firebase.firestore.FieldValue
            });
        } catch (e) {
            console.error("Error creating league: ", e);
        }
            console.log("League created");
          

        window.location.href = "/";

}

return (
    <div className="createLeague" style={{ display: 'block', position: 'initial' }}>
      <Button onClick={handleClick}>Create League</Button>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} size="xl">
      
        <Modal.Header closeButton>
          <Modal.Title>Create League</Modal.Title>
        </Modal.Header>

        <Tabs activeKey={key} onSelect={(k) => setKey(k)} id="createLeague" className="customTabs">
        <Tab eventKey="leagueInfo" title="League Info">
    <Modal.Body>
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-body d-flex justify-content-between">
                        <div>
                            <label>League Name:</label> 
                            <input placeholder="League Name" onChange={(event) => {setLeagueName(event.target.value)}}></input>
                        </div>
                        <div>
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
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <label>Roster Settings</label>

                        <div className="row">
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>QB</label> 
                                        <select name="QB" value={QB} onChange={handleChange}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>RB</label> 
                                        <select name="RB" value={RB} onChange={handleChange}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>WR</label> 
                                        <select name="WR" value={WR} onChange={handleChange}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>TE</label> 
                                        <select name="TE" value={TE} onChange={handleChange}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>FLEX</label> 
                                        <select name="FLEX" value={FLEX} onChange={handleChange}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>K</label> 
                                        <select name="K" value={K} onChange={handleChange}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>DEF</label> 
                                        <select name="DEF" value={DEF} onChange={handleChange}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Button onClick={() => setKey('scoringSettings')}>Next</Button>
    </Modal.Body>
</Tab>


<Tab eventKey="scoringSettings" title="Scoring Settings">
    <Modal.Body>
        <p>This is scoring settings</p>
        <br></br>

        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <h4><label>Passing</label></h4> <br></br> 
                        <div className="row">
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Pass YRD</label> 
                                        <input type="text" name="passYRD" value={passYRD} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPassYRD(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setPassYRD(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPassYRD(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Pass TD</label> 
                                        <input type="text" name="passTD" value={passTD} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPassTD(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setPassTD(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPassTD(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Interception</label> 
                                        <input type="text" name="interception" value={interception} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setInterception(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setInterception(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setInterception(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <h4><label>Rushing</label></h4> <br></br> 
                        <div className="row">
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Rush YRD</label> 
                                        <input type="text" name="rushYRD" value={rushYRD} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setRushYRD(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setRushYRD(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setRushYRD(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Rush TD</label> 
                                        <input type="text" name="rushTD" value={rushTD} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setRushTD(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setRushTD(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setRushTD(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Fumble</label> 
                                        <input type="text" name="fumble" value={fumble} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFumble(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setFumble(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFumble(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Fumble Lost</label> 
                                        <input type="text" name="fumbleLost" value={fumbleLost} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFumbleLost(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setFumbleLost(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFumbleLost(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <h4><label>Receiving</label></h4> <br></br> 
                        <div className="row">
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Rec YRD</label> 
                                        <input type="text" name="recYRD" value={recYRD} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setRecYRD(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setRecYRD(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setRecYRD(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Rec TD</label> 
                                        <input type="text" name="recTD" value={recTD} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setRecTD(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setRecTD(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setRecTD(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Receptions</label> 
                                        <input type="text" name="reception" value={reception} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setReceptions(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setReceptions(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setReceptions(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <h4><label>Defence</label></h4> <br></br> 
                        <div className="row">
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Sack</label> 
                                        <input type="text" name="sack" value={sack} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setSack(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setSack(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setSack(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Def Interception</label> 
                                        <input type="text" name="defInterception" value={defInterception} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setDefInterception(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setDefInterception(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setDefInterception(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Fumble Recovery</label> 
                                        <input type="text" name="fumblerecovery" value={fumblerecovery} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFumblerecovery(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setFumblerecovery(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFumblerecovery(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Return TD</label> 
                                        <input type="text" name="returnTD" value={returnTD} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setReturnTD(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setReturnTD(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setReturnTD(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Safety</label> 
                                        <input type="text" name="safety" value={safety} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setSafety(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setSafety(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setSafety(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Blocked Kick</label> 
                                        <input type="text" name="blockedKick" value={blockedKick} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setBlockedKick(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setBlockedKick(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setBlockedKick(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Shutout</label> 
                                        <input type="text" name="shutout" value={shutout} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setShutout(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setShutout(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setShutout(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Points 1-6</label> 
                                        <input type="text" name="points1_6" value={points1_6} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints1_6(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setPoints1_6(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints1_6(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Points 7-13</label> 
                                        <input type="text" name="points7_13" value={points7_13} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints7_13(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setPoints7_13(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints7_13(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Points 14-20</label> 
                                        <input type="text" name="points14_20" value={points14_20} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints14_20(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setPoints14_20(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints14_20(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Points 21-27</label> 
                                        <input type="text" name="points21_27" value={points21_27} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints21_27(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setPoints21_27(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints21_27(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                    <label>Points 28-34</label> 
                                    <input type="text" name="points28_34" value={points28_34} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints28_34(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setPoints28_34(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints28_34(0); } }} style={{width: '100%'}} />

                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>Points 35 Plus</label> 
                                        <input type="text" name="points35Plus" value={points35Plus} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints35Plus(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setPoints35Plus(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setPoints35Plus(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <h4><label>Kicking</label></h4> <br></br> 
                        <div className="row">
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>FG 0-39</label> 
                                        <input type="text" name="FG0_39" value={FG0_39} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFG0_39(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setFG0_39(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFG0_39(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>FG 40-49</label> 
                                        <input type="text" name="FG40_49" value={FG40_49} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFG40_49(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setFG40_49(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFG40_49(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>FG 50 Plus</label> 
                                        <input type="text" name="FG50Plus" value={FG50Plus} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFG50Plus(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setFG50Plus(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFG50Plus(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <label>FG Miss</label> 
                                        <input type="text" name="FGMiss" value={FGMiss} onChange={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFGMiss(value); } else if (/^-?\d*(\.\d*)?$/.test(value)) { setFGMiss(Number(value)); } }} onBlur={(e) => { const value = e.target.value; if (value === "" || value === "-" || value === "." || value === "-.") { setFGMiss(0); } }} style={{width: '100%'}} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <Button onClick={() => setKey('inviteUsers')}>Next</Button>
    </Modal.Body>
</Tab>
        

            <Tab eventKey="inviteUsers" title="Invite Users">
                <div className="inviteUsers">
                <Modal.Body>
                    <p>This is Invite Users</p> <br></br>
                    <h4>Members: </h4>
                    <input type = "email" value= {user ? user.email : ''} readOnly />
                    {Array.from({ length: TEAMS - 1 }, (_, index) => (
                        <div key={index}>
                        <div className="input-container"> {/* Add this line */}
                            <select
                                className="input"
                                value={emails[index]}
                                onChange={(event) => handleEmailChange(index, event)}
                            >
                                <option value="">Select or type an email</option>
                                {friends.filter(friendEmail => !selectedFriends.includes(friendEmail)).map((friendEmail, index) => (
                                    <option key={index} value={friendEmail}>{friendEmail}</option>
                                ))}
                            </select>
                            <input
                                className="input"
                                type="email"
                                placeholder={`Member ${index + 2}`}
                                value={emails[index]}
                                onChange={(event) => handleEmailChange(index, event)}
                            />
                        </div> {/* Add this line */}
                    </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary">Close</Button>
                    <Button variant="primary" onClick={createLeague}>Create League</Button>
                </Modal.Footer>
                </div>
            </Tab>


        </Tabs>
      </Modal>
    </div>
  );
}



export default CreateLeague