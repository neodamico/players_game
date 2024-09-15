// src/components/HomePage.js
import React from 'react';

const teams = [
  { name: 'Corinthians', img: '/corinthians-logo.png' },
  //{ name: 'Palmeiras', img: '/palmeiras-logo.png' },
  { name: 'São Paulo', img: '/sao-paulo-logo.png' },
  //{ name: 'Internacional', img: '/internacional-logo.png' },
];

const HomePage = ({ onTeamSelect }) => {
  return (
    <div>
      <h1>Quantos jogadores estrangeiros jogaram no seu time esse século?</h1>
      <div className="team-selection">
        {teams.map((team) => (
          <div key={team.name} onClick={() => onTeamSelect(team.name)}>
            <img src={team.img} alt={team.name} />
            <h2>{team.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
