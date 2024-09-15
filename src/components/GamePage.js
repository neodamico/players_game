import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import PlayersTable from './PlayersTable';


const GamePage = ({ selectedTeam }) => {
  const [guessedPlayers, setGuessedPlayers] = useState([]);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(300); // 5 minutos
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [showUnrevealedPlayers, setShowUnrevealedPlayers] = useState(false);
  const [inputFeedback, setInputFeedback] = useState(''); // Novo estado para feedback

  useEffect(() => {
    const fetchPlayers = async () => {
      const response = await fetch('/players.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      const teamPlayers = data.filter(player => player.team === selectedTeam);
      setPlayers(teamPlayers);
      setTotalPlayers(teamPlayers.length);
    };

    fetchPlayers();
  }, [selectedTeam]);

  useEffect(() => {
    if (gameStarted) {
      const countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [gameStarted]);

  const handleGuess = () => {
    const formattedInput = input.toLowerCase().trim();
    const player = players.find((p) => {
      const aliases = p.aliases ? p.aliases.split(',').map(alias => alias.trim().toLowerCase()) : [];
      const namesToCheck = [p.name.toLowerCase(), ...aliases];
      return namesToCheck.includes(formattedInput);
    });

    if (player && !guessedPlayers.includes(player.name)) {
      setGuessedPlayers([...guessedPlayers, player.name]);
      setScore(score + 1);
      setInputFeedback('correct'); // Feedback para acerto
    } else {
      setInputFeedback('incorrect'); // Feedback para erro
    }
    setInput('');
  };

  const startGame = () => {
    setGameStarted(true);
    setShowUnrevealedPlayers(false);
  };

  const resetGame = () => {
    setGuessedPlayers([]);
    setInput('');
    setScore(0);
    setTimer(300);
    setGameStarted(false);
    setShowUnrevealedPlayers(false);
    setInputFeedback(''); // Reseta o feedback
  };

  const getPercentage = () => {
    return Math.round((score / totalPlayers) * 100);
  };

  const revealUnrevealedPlayers = () => {
    setShowUnrevealedPlayers(true);
  };

  return (
    <div>
      <h1>
        Você consegue lembrar todos os jogadores estrangeiros que já vestiram o manto do {selectedTeam} nesse século?
      </h1>
      <div>Score: {score}/{totalPlayers}</div>
      <div>Timer: {timer}s</div>

      {!gameStarted ? (
        <button onClick={startGame} className="playButton">Jogar</button>
      ) : timer > 0 ? (
        <div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
            disabled={!gameStarted}
            className={inputFeedback === 'correct' ? 'input-correct' : inputFeedback === 'incorrect' ? 'input-incorrect' : ''}
          />
        </div>
      ) : (
        <div>
          <h2>Tempo esgotado!</h2>
          <p>Você acertou {score}/{totalPlayers} jogadores.</p>
          <p>Isso equivale a {getPercentage()}% de acertos!</p>

          <div>
            <button onClick={resetGame} className="playButton">Tentar Novamente</button>
            <button onClick={revealUnrevealedPlayers} className="playButton">Revelar Nomes</button>
          </div>
        </div>
      )}

      <PlayersTable
        players={players}
        guessedPlayers={guessedPlayers}
        showUnrevealedPlayers={showUnrevealedPlayers}
      />
    </div>
  );
};

export default GamePage;
