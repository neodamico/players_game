import React from 'react';

const PlayersTable = ({ players, guessedPlayers, showUnrevealedPlayers }) => {
  const nationalities = [...new Set(players.map(player => player.nationality))];

  return (
    <div className="players-table">
      {nationalities.map(nat => (
        <div key={nat} className="nationality-container">
          <h3 className="nationality-title">{nat}</h3>
          <div className="player-list">
            {players
              .filter(player => player.nationality === nat)
              .map(player => (
                <div
                  className="player-cell"
                  key={player.name}
                  style={{
                    color: guessedPlayers.includes(player.name)
                      ? 'black' // Jogador adivinhado em preto
                      : showUnrevealedPlayers
                      ? 'red' // Jogador não adivinhado em vermelho
                      : 'transparent', // Jogador não adivinhado ainda oculto
                  }}
                >
                  {guessedPlayers.includes(player.name) || showUnrevealedPlayers
                    ? player.name
                    : ''} {/* Mostra o nome se adivinhado ou se "Revelar Nomes" foi clicado */}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayersTable;
