import { useEffect, useState } from 'react';
import { auth, db } from "../Firebase-config";
import { addDoc, collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import CreateLeague from './CreateLeague';
import LeagueCards from '../components/LeagueCards';
import Modal from 'react-bootstrap/Modal';


function Home() {
  const [user, setUser] = useState(null);
  const userCollection = collection(db, "users");
  const [displayName, setDisplayName] = useState("")
  const [showComponent, setShowComponent] = useState(false);
  const [selectedLeague, setSelectedLeague] =useState(null)

  const handleClick = () => {
    setShowComponent(!showComponent);
  };

  async function fetchUser(user) {
    const fetchUserQuery = query(userCollection, where("email", '==', user.email));
            const querySnapshot = await getDocs(fetchUserQuery);
            const userSettingsDocument = querySnapshot.docs[0];
            setDisplayName(userSettingsDocument.data().displayName)
  }

  useEffect(() => {
    document.title = "HuddleHero | Home";
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
      fetchUser(user)
    }
  

    });
    return () => unsubscribe();
  }, []);



  if (user) {
  return (

   <>
   <h1 style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px'}}>
      Welcome to HuddleHero, {displayName}
      </h1>

      <div>
      <button onClick={handleClick}>Create League</button>
      {showComponent && <CreateLeague />}
    </div>

    <LeagueCards user={user} setSelectedLeague={setSelectedLeague} />

    <Modal show={selectedLeague !== null} onHide={() => setSelectedLeague(null)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedLeague?.leagueName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Display league details here */}
            Creator: {selectedLeague?.creator}
            {/* Add more league details */}
          </Modal.Body>
        </Modal>



   </> 
  )
  }
  else {
    <div>
      
    </div>
  }
}



export default Home;