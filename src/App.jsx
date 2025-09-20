import React, { useState, useEffect } from "react";
import Settings from "./Settings.jsx";
import "./App.css";

export default function App() {
  const [settings, setSettings] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [scores, setScores] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [remainingPas, setRemainingPas] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [turnStarted, setTurnStarted] = useState(false);

  // JSON yukledim
  useEffect(() => {
    fetch("/cards.json")
      .then(res => res.json())
      .then(data => setCards(data))
      .catch(err => console.error(err));
  }, []);

  // Oyunu baslat
  const startGame = ({ players, pasHakki, turnTime, playerNames }) => {
    setSettings({ players, pasHakki, turnTime, playerNames });
    setScores(Array(players).fill(0));
    setRemainingPas(pasHakki);
  };

  // Kart sec
  const pickRandomCard = () => {
    if (cards.length === 0) return;
    const idx = Math.floor(Math.random() * cards.length);
    setCurrentCard({ ...cards[idx], index: idx });
  };

  // zamanlayici
  useEffect(() => {
    if (!turnStarted) return;

    if (timeLeft <= 0) {
      handleEndTurn();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [turnStarted, timeLeft]);

  // Tur baslat
  const startTurn = () => {
    setRemainingPas(settings.pasHakki);
    setTimeLeft(settings.turnTime);
    setTurnStarted(true);
    pickRandomCard();
  };

  // Tur bitis
  const handleEndTurn = () => {
    setTurnStarted(false);
    setCurrentCard(null);
    setCurrentPlayer(prev => (prev + 1) % settings.players);
    setRemainingPas(settings.pasHakki);
  };

  // Dogru puan
  const handleCorrect = () => {
    const newScores = [...scores];
    newScores[currentPlayer] += 1;
    setScores(newScores);
    pickRandomCard();
  };

  // Pas
  const handlePass = () => {
    if (remainingPas > 0) {
      setRemainingPas(remainingPas - 1);
      pickRandomCard();
    }
  };

  // Tabuu
  const handleTabuu = () => {
    const newScores = [...scores];
    newScores[currentPlayer] = Math.max(newScores[currentPlayer] - 1, 0);
    setScores(newScores);
    pickRandomCard();
  };

  if (!settings) return <Settings startGame={startGame} />;
  if (gameOver)
    return (
      <div className="app">
        <h1>Oyun Bitti!</h1>
        {settings.playerNames.map((name, i) => (
          <h2 key={i}>{name}: {scores[i]} puan</h2>
        ))}
      </div>
    );

  const activePlayerName = settings.playerNames[currentPlayer] || `Oyuncu ${currentPlayer + 1}`;

  return (
    <div className="app">
      <h1>Taboo Oyunu</h1>
      <h2>{activePlayerName}'nın Sırası</h2>

      {!turnStarted ? (
        <button onClick={startTurn} className="startTurn">
          Hazırım
        </button>
      ) : (
        <>
          {currentCard && (
            <div className="card">
              <h2>{currentCard.word}</h2>
              <ul>
                {currentCard.forbidden.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
              <div>Pas Hakkı: {remainingPas}</div>
              <div>⏱ Süre: {timeLeft}s</div>
            </div>
          )}
          <div className="buttons">
            <button onClick={handleCorrect} className="correct">Doğru</button>
            <button 
              onClick={handlePass} 
              className="pass" 
              disabled={remainingPas === 0}
            >
              Pas ({remainingPas})
            </button>
            <button onClick={handleTabuu} className="tabuu">Tabuu</button>
          </div>
        </>
      )}

      <div className="scoreboard">
        {settings.playerNames.map((name, i) => (
          <div key={i}>{name}: {scores[i]}</div>
        ))}
      </div>
    </div>
  );
}
