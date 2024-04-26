// League Settings Tutorial
const LeagueSettingsTutorial = () => {
  return (
    <div>
      <h2>League Members</h2>
      <ul>
        <li>
          <strong>Displaying League Members:</strong> In this part, we showcase the names of all the league members. It's like a virtual roll call, allowing you to quickly identify who's part of your fantasy football league.
        </li>
        <li>
          <strong>Empty Team Slots:</strong> If there are any unfilled team slots (perhaps some managers haven't joined yet), we explicitly label them as "Empty Team Slot." This visual cue helps you keep track of available positions.
        </li>
      </ul>

      <h2>Roster Settings</h2>
      <ul>
        <li>
          <strong>Starting Lineup Size:</strong> Imagine your fantasy football team as a real team stepping onto the field. How many players can you field in your starting lineup? That's what the "Starting Lineup Size" tells you.
        </li>
        <li>
          <strong>Bench Size:</strong> Beyond the starting lineup, you have a bench—a reserve of players waiting for their chance. The "Bench Size" specifies how many players you can stash on your bench.
        </li>
        <li>
          <strong>Flex Positions:</strong> Some leagues allow flexibility in player positions. For example, you might be able to slot a wide receiver (WR) or running back (RB) into a "Flex" spot. Understanding these settings helps you strategize—do you load up on RBs or diversify with WRs?
        </li>
        <li>
          <strong>IR (Injured Reserve):</strong> Injuries happen, even in fantasy football. The "IR" setting lets you know how many injured players you can stash away without affecting your active roster.
        </li>
      </ul>

      <h2>Scoring Settings</h2>
      <p>
        <strong>Touchdowns and Yards:</strong> Points win games, right? Well, in fantasy football, points come from touchdowns (TDs) and yards gained. Each league has its own scoring system. For instance:
      </p>
      <ul>
        <li>A rushing TD might be worth <strong>6 points</strong>.</li>
        <li>Passing yards could earn you <strong>1 point per 25 yards</strong>.</li>
      </ul>

      <p>
        <strong>Defensive Scoring:</strong> Defense matters too! If your league includes team defenses, their performance contributes to your score. Factors like sacks, interceptions, and shutouts impact your points.
      </p>

      <p>
        <strong>Customization:</strong> Some leagues get creative. The league commissioner can change scoring rules at any time to fit the league's needs. Keep an eye out for any unique twists!
      </p>

      <p>
        Remember, fantasy football is a game of strategy, stats, and camaraderie. Dive into these settings, chat with fellow managers, and enjoy the journey on HuddleHero! 🏈🔥
      </p>
    </div>
  );
};

export default LeagueSettingsTutorial;
