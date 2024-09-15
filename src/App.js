import React, { useState } from 'react';
import HomePage from './components/HomePage';
import GamePage from './components/GamePage';
import './App.css';

function App() {
  const [selectedTeam, setSelectedTeam] = useState(null);

  return (
    <div className="App">
      {!selectedTeam ? (
        <HomePage onTeamSelect={setSelectedTeam} />
      ) : (
        <GamePage selectedTeam={selectedTeam} />
      )}
    </div>
  );
}

export default App;
