const HomeContent = () => {
    return (
      <div>
        <h2>Welcome to HuddleHero, Fantasy Football Enthusiast!</h2>
        <p>
          As you step onto the digital gridiron, let's explore the Home Page—a
          hub of fantasy football action. Here's your playbook for navigating this
          league-packed arena:
        </p>
        <hr />
        <div className="home-tutorial">
          {/* League Invites */}
          <div className="tutorial-section">
            <h3>League Invites</h3>
            <p>
              On the left side, you'll find your League Invites. These are golden
              tickets to join new leagues. Keep an eye out for invites from fellow
              managers—they're your passport to fantasy glory!
            </p>
          </div>
  
          {/* Current Leagues */}
          <div className="tutorial-section">
            <h3>Current Leagues</h3>
            <p>
              Now shift your gaze to the right. Here lie your existing leagues.
              Each league has its own saga—drafts, trades, victories, and
              defeats. Click "View League" to dive into the heart of any league
              you're part of.
            </p>
          </div>
  
          {/* Create League */}
          <div className="tutorial-section">
            <h3>Create League</h3>
            <p>
              Feeling ambitious? Just above the list of current leagues, you'll
              spot the "Create League" button. Click it to forge your own fantasy
              realm. Name it, set the rules, and summon your league members. Your
              legacy awaits!
            </p>
          </div>
        </div>
  
        {/* My HuddleHero */}
  
        <p>
          Remember, your HuddleHeroe sidekicks are here to assist you across the
          site. Click them whenever you need guidance. Now go forth, manager, and
          may touchdowns rain upon your roster!🏈🦸‍♂️
        </p>
      </div>
    );
  };
  
  export default HomeContent;
  