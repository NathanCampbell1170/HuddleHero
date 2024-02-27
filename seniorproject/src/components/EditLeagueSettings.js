import React from 'react';

const EditLeagueSettings = ({ selectedLeague }) => {
  if (!selectedLeague) {
    return <p>No league selected.</p>;
  }

  // Display the league ID
  return (
    <div>
      <h2>{selectedLeague.name}</h2>
      Commissioner: {selectedLeague.commissioner} <br />
      League ID: {selectedLeague.id}
      {/* Display other relevant league details */}
    </div>
  );
};

export default EditLeagueSettings;
