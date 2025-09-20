import React, { useState } from "react";

export default function Settings({ startGame }) {
  const [players, setPlayers] = useState(2);
  const [pasHakki, setPasHakki] = useState(3);
  const [turnTime, setTurnTime] = useState(30); // her oyuncu tur süresi
  const [playerNames, setPlayerNames] = useState(["Oyuncu 1", "Oyuncu 2"]);

  const handleStart = () => {
    startGame({ players, pasHakki, turnTime, playerNames });
  };

  const handleNameChange = (index, value) => {
    const newNames = [...playerNames];
    newNames[index] = value || `Oyuncu ${index + 1}`;
    setPlayerNames(newNames);
  };

  return (
    <div className="settings">
      <h1>Taboo Ayarları</h1>

      <label>
        Oyuncu / Takım sayısı:
        <input
          type="number"
          value={players}
          min={1}
          max={10}
          onChange={(e) => {
            const val = Number(e.target.value);
            setPlayers(val);
            // Yeni isim dizisini güncelle
            setPlayerNames(prev => {
              const newArr = [...prev];
              while (newArr.length < val) newArr.push(`Oyuncu ${newArr.length + 1}`);
              while (newArr.length > val) newArr.pop();
              return newArr;
            });
          }}
        />
      </label>

      {playerNames.map((name, i) => (
        <label key={i}>
          {`Oyuncu ${i + 1} İsmi:`}
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(i, e.target.value)}
            placeholder={`Oyuncu ${i + 1}`}
          />
        </label>
      ))}

      <label>
        Pas Hakkı:
        <input
          type="number"
          value={pasHakki}
          min={1}
          max={10}
          onChange={(e) => setPasHakki(Number(e.target.value))}
        />
      </label>

      <label>
        Tur Süresi (saniye):
        <input
          type="number"
          value={turnTime}
          min={10}
          max={300}
          onChange={(e) => setTurnTime(Number(e.target.value))}
        />
      </label>

      <button onClick={handleStart}>Oyunu Başlat</button>
    </div>
  );
}
