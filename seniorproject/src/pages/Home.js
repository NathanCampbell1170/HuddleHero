import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { auth, db } from "../Firebase-config";
import { default as HuddleHero, default as Logo } from '../Images/Logo.jpeg';
import LeagueCards from '../components/LeagueCards';
import LeagueInvites from '../components/LeagueInvites';
import MyHuddleHero from '../components/MyHuddleHero';
import { HomeContent } from '../components/MyHuddleHeroTutorials';
import CreateLeague from './CreateLeague';




function Home() {
  const [user, setUser] = useState(null);
  const userCollection = collection(db, "users");
  const [displayName, setDisplayName] = useState("")
  const [showComponent, setShowComponent] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState(null)
  const [beginnerMode, setBeginnerMode] = useState(false);

  const handleClick = () => {
    setShowComponent(!showComponent);
  };

  async function fetchUser(user) {
    const fetchUserQuery = query(userCollection, where("email", '==', user.email));
    const querySnapshot = await getDocs(fetchUserQuery);
    const userSettingsDocument = querySnapshot.docs[0];
    setDisplayName(userSettingsDocument.data().displayName)
    console.log(userSettingsDocument.data().beginnerMode)
    setBeginnerMode(userSettingsDocument.data().beginnerMode)
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

      <div className="main-content">

        <Container fluid>
          <Row className="justify-content-md-center">
            <div className='welcome-message'>
              <h1>Welcome to HuddleHero, {displayName}</h1>
              {beginnerMode && (
                <MyHuddleHero imageSrc={HuddleHero} applyClassToImage="HomeContent">
                  <HomeContent />
                  <div className='align-center'>
                    <img src={Logo} className="offcanvas-image" alt="HuddleHero Logo" />
                  </div>
                </MyHuddleHero>
              )}
            </div>

          </Row>
          <hr />
          <Row>
            <Col md={6}>
              <div className="invite-cards">

                <LeagueInvites className="invite-card" /> {/* Use the LeagueInvites component here */}

              </div>
            </Col>

            {/* Right side - Existing Leagues */}
            <Col md={6}>
              <div className="league-cards">
                <CreateLeague beginnerMode={beginnerMode} />
                <LeagueCards user={user} beginnerMode={beginnerMode} setSelectedLeague={setSelectedLeague} className="league-card" />
              </div>
            </Col>
          </Row>
        </Container>

        {/* 
<Modal show={selectedLeague !== null} onHide={() => setSelectedLeague(null)}>
  <Modal.Header closeButton>
    <Modal.Title>{selectedLeague?.leagueName}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {/* Display league details here 
    Creator: {selectedLeague?.creator}
    {/* Add more league details 
  </Modal.Body>
</Modal>
*/}




      </div>

    );
  }
  else {
    return (
      <Container fluid>
        <Row className="justify-content-md-center">
          <div className='welcome-message'>
            <h1>Welcome to HuddleHero</h1>
          </div>
        </Row>
        <hr />
        <Row>
          {/* Left side - Dummy Invite Cards */}
          <Accordion className="About" defaultActiveKey="0">
            <Accordion.Item eventKey="1">
              <Accordion.Header>What is HuddleHero?</Accordion.Header>
              <Accordion.Body>
                <strong>HuddleHero</strong> is a fantasy football website designed for novice and experienced fantasy footballers. With fully customizable roster and scoring settings, fantasy football leagues can be as complex or as simple as the user wishes. <strong>HuddleHero</strong> includes in-league messaging and peer-to-peer direct messaging to make league communication easy. While other fantasy football platforms can be confusing for beginners, <strong>HuddleHero</strong> provides a beginner mode with tutorials to help novice users keep pace with their opponents. While other applications incorporate sports betting into fantasy football, <strong>HuddleHero</strong> sticks with a pure, safe fantasy football experience for players of all ages and experience levels.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Why Was <strong>HuddleHero</strong> Created?</Accordion.Header>
              <Accordion.Body>
                <h2>The Problem </h2>
                <p>
                  Many modern fantasy football applications are not intuitive to beginner users, especially those who are unfamiliar with the game of football in general. Additionally, many modern applications are beginning to adopt sports betting into their services, creating a distraction for those who are disinterested or unable to participate in these activities. This is especially problematic for young participants, participants in states without legalized sports betting, and those who struggle with gambling addiction.
                </p>
                <h2>The Solution/Opportunity</h2>
                <p>
                  <strong>HuddleHero</strong> strives to be beginner friendly through built-in tutorials, known as the “My HuddleHero” feature of the site. This is a beginner mode that allows the user to see and toggle tutorials on each page of the site for reference as needed. The issues pertaining to sports betting are handled by the site’s lack of sports betting content—leaving a safe fantasy football experience for everyone.
                  A beginner-friendly fantasy football platform like <strong>HuddleHero</strong> would improve the fantasy football market by introducing the game to new users who may feel overwhelmed on more complicated fantasy football platforms that lack tutorial features. <strong>HuddleHero</strong> also lends itself well to casual or family fantasy leagues due to its easy-to-approach nature—it is an ideal app for beginners to the game of fantasy football or those who wish to introduce others to the game.
                </p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Why Choose HuddleHero?</Accordion.Header>
              <Accordion.Body>
                <h2>Welcome to HuddleHero: Your Fantasy Football Platform</h2>
                <p>Designed with every type of player in mind, <strong>HuddleHero</strong> is a versatile platform that caters to the needs of its users. Whether you're a seasoned fantasy football veteran with a collection of league championships or a curious newcomer eager to explore, <strong>HuddleHero</strong> ensures a positive experience for everyone.</p>

                <h2>Customizable Leagues for All Preferences</h2>
                <p><strong>HuddleHero</strong> leagues can be as straightforward or intricate as you desire. With fully customizable roster and scoring settings, league commissioners have the freedom to create a league that perfectly aligns with their preferences. Additionally, the platform streamlines communication within leagues through an in-league messaging system. Users can also manage a friend's list, facilitating one-on-one communication and simplifying the league invitation process.</p>

                <h2>Empowering Beginners with My HuddleHero</h2>
                <p><strong>HuddleHero</strong>'s beginner mode, aptly named <strong>My HuddleHero</strong>, is a standout feature. It provides toggleable overlays within each league, offering clear explanations for every fantasy football function. Newcomers can keep pace with their peers without feeling overwhelmed. Just click on your personal <strong>HuddleHero</strong>, and he'll guide you through the intricacies of the game.</p>

                <h2>A Safe Space: No Sports Betting or Gambling Content</h2>
                <p><strong>HuddleHero</strong> prioritizes its most vulnerable users by excluding any sports betting or gambling content from the site. This commitment ensures a safe experience for users of all ages, those with ethical concerns about gambling, and individuals struggling with gambling addiction.</p>

                <p>Whether you're a seasoned fantasy football champion seeking a customizable platform or a beginner looking for an intuitive introduction, <strong>HuddleHero</strong> is the league-winning solution you've been searching for. 🏈🏆</p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>Who Created HuddleHero?</Accordion.Header>
              <Accordion.Body>
                <h2 style={{ display: 'flex', alignItems: 'baseline' }}>
                  Nathan Campbell
                  <h2 style={{ marginLeft: '.5em', fontSize: '60%', marginBottom: '0', color: "#fe4a2a" }}>
                    AKA GreenMachine/GreenBean
                  </h2>
                </h2>

                <p>
                  The developer of <strong><strong>HuddleHero</strong></strong>, Nathan Campbell, has been playing fantasy football since 2015. He is an active participant in a handful of leagues each year, running several himself or as a co-commissioner. He has experience using several different fantasy football platforms, such as NFL.com, ESPN, and Sleeper. As an experienced league owner, he knows what kinds of features users wish to use in their fantasy football leagues.
                </p>

                <h4>Why Nathan created HuddleHero:</h4>
                <p>
                  "In my nine years of experience playing fantasy football, I’ve participated in and hosted dozens of leagues each season. I’ve explored various platforms, each with its own strengths and weaknesses. Some lacked robust setting customization, making it difficult to tailor the game to my preferences. Others had interfaces that were challenging to navigate, leading to confusion and frustration. Many had elusive chat systems, forcing us to resort to external communication methods like email or text messages—which interrupts the flow of the game.
                  I have also noticed the increasing implementation of sports betting content into fantasy football platforms, which can lead to a distracting or hostile experience for users who do not subscribe to sports betting. The largest shortcoming, however, is the lack of a beginner-friendly experience. This issue became apparent to me shortly after coming to College of the Ozarks when I created a fantasy football league to compete with my friends. Because some of my friends were novices to fantasy football, they often had to ask questions and receive assistance that took away from the quality of everyone’s experience. <strong>HuddleHero</strong> is the solution to those shortcomings."

                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {/* Right side - Existing Leagues */}
          <Col md={6}>


          </Col>
        </Row>
      </Container>
    )
  }
}



export default Home;