import { useContext } from 'react';
import { UserContext } from '../functions/UserContext'; // import the context

function Home() {
  const user = useContext(UserContext); // access the user state

  return (
    <div>
      <h1 style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px'}}>
      Welcome to HuddleHero{user && `, ${localStorage.getItem("Displayname")}`}
      </h1>
    </div>
  );
}

export default Home;