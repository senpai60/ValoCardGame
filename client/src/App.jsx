// App.jsx (multiplayer-ready, uses existing UpdatedAgentCard)
import React, { useEffect, useMemo, useState, useRef } from "react";
import AllCards from "../data/AllCards";
import ShuffleCard from "./GameProccess/ShuffleCard";
import UpdatedAgentCard from "./components/UpdatedAgentCard";
import "./index.css";

import { io } from "socket.io-client";

// CHANGE URL if your server runs elsewhere
const SOCKET_URL = "http://localhost:3000";

function App() {
  // AUDIO (kept same)
  const lostSound = useMemo(() => new Audio("sounds/lost.mp3"), []);
  const shot1 = useMemo(() => new Audio("sounds/r1.mp3"), []);
  const shot2 = useMemo(() => new Audio("sounds/r2.mp3"), []);
  const shot3 = useMemo(() => new Audio("sounds/r3.mp3"), []);
  const shot4 = useMemo(() => new Audio("sounds/r4.mp3"), []);
  const shot5 = useMemo(() => new Audio("sounds/r5.mp3"), []);
  const themeMusic = useMemo(() => {
    const audio = new Audio("sounds/theme1.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    return audio;
  }, []);

  // local solo state (keeps your original single-player behavior)
  const [playerCardsLocal, setPlayerCardsLocal] = useState([]);
  const [aiCardsLocal, setAiCardsLocal] = useState([]);
  const [turnLocal, setTurnLocal] = useState("");
  const [selectedStatLocal, setSelectedStatLocal] = useState(null);
  const [roundResultLocal, setRoundResultLocal] = useState("");
  const [gameStateLocal, setGameStateLocal] = useState("pre-game"); // pre-game, playing, round-end, game-over
  const [winStreak, setWinStreak] = useState(0);

  // multiplayer state
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState("room1");
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [myId, setMyId] = useState(null);
  const [cardsMap, setCardsMap] = useState({}); // { socketId: [cards...] }
  const [turnId, setTurnId] = useState(null); // socketId whose turn it is
  const [selectedStat, setSelectedStat] = useState(null); // multiplayer selection
  const [roundInfo, setRoundInfo] = useState(null); // last round info
  const [cardsLeft, setCardsLeft] = useState({});

  // flags
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [mode, setMode] = useState("idle"); // "idle" | "solo" | "online" | "waiting"

  // connect socket once when user chooses online mode
  // connect socket once when user chooses online mode
  useEffect(() => {
    // Connect if mode is 'online' or 'waiting' AND we don't have a socket yet
    if ((mode === "online" || mode === "waiting") && !socketRef.current) {
      const socket = io(SOCKET_URL);
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
        setConnected(true);
        setMyId(socket.id);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        setConnected(false);
        setJoinedRoom(false);
        setMyId(null);
        setCardsMap({});
        setTurnId(null);
        // Optionally force back to idle if disconnected unexpectedly
        // setMode("idle"); 
      });

      socket.on("joined", ({ roomId: r, myId: mid }) => {
        setJoinedRoom(true);
        setRoomId(r);
        if (mid) setMyId(mid);
        console.log("Joined room:", r, "myId:", mid);
      });

      socket.on("waiting", (data) => {
        setMode("waiting"); // This is the correct place to set this
        console.log("Waiting for player...", data);
      });

      socket.on("roomFull", () => {
        alert("Room is full. Choose another room id.");
        // Go back to the join screen, but keep the socket
        setJoinedRoom(false); 
        setMode("online"); 
      });

      socket.on("gameStart", (data) => {
        setCardsMap(data.cards);
        setTurnId(data.turn);
        setSelectedStat(null);
        setRoundInfo(null);
        setMode("online"); // Use 'online' for the game screen
        setGameStateLocal("playing"); // reuse to show UI
        console.log("Game started. Turn:", data.turn);
      });

      socket.on("roundResult", (data) => {
        setCardsMap(data.cards || {});
        setTurnId(data.turn);
        setRoundInfo(data);
        setSelectedStat(null);
        setCardsLeft(data.cardsLeft || {});
        console.log("RoundResult:", data);
      });

      socket.on("gameOver", (data) => {
        const winner = data.winner;
        if (winner === socket.id) alert("You Win!");
        else alert("You Lose!");
        window.location.reload();
      });

      socket.on("playerLeft", (p) => {
        alert("Opponent left the room. Game ended.");
        window.location.reload();
      });

    } 
    // Disconnect if mode goes back to 'idle' AND we have a socket
    else if (mode === "idle" && socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  
    // We intentionally do NOT return a cleanup function here,
    // as we are managing the lifecycle manually inside the effect.

  }, [mode]);

  // music control (reuse your existing behavior)
  useEffect(() => {
    if (isMusicPlaying) {
      themeMusic.play().catch(() => {});
    } else {
      themeMusic.pause();
    }
    return () => themeMusic.pause();
  }, [isMusicPlaying, themeMusic]);

  // SOLO (existing) logic: start game locally (client-only)
  const startLocalGame = () => {
    const { PlayerCards, AICards, firstTurn } = ShuffleCard(AllCards);
    setPlayerCardsLocal(PlayerCards);
    setAiCardsLocal(AICards);
    setTurnLocal(firstTurn);
    setSelectedStatLocal(null);
    setRoundResultLocal("");
    setWinStreak(0);
    setGameStateLocal("playing");
    setMode("solo");
    console.clear();
    console.log("[LOCAL] local game started. First turn:", firstTurn);
  };

  // local handle stat (keeps original logic)
  const handleStatSelectLocal = (statKey) => {
    if (turnLocal !== "Player" || selectedStatLocal) return;
    setSelectedStatLocal(statKey);
    compareCardsLocal(statKey);
  };

  const compareCardsLocal = (statKey) => {
    setGameStateLocal("round-end");
    const playerCard = playerCardsLocal[0];
    const aiCard = aiCardsLocal[0];
    const playerStat = playerCard.stats[statKey];
    const aiStat = aiCard.stats[statKey];

    let newPlayer = [...playerCardsLocal];
    let newAi = [...aiCardsLocal];
    const pCard = newPlayer.shift();
    const aCard = newAi.shift();
    let nextTurn = "";
    let result = "";

    if (playerStat > aiStat) {
      setWinStreak((s) => s + 1);
      newPlayer.push(pCard, aCard);
      result = "Player Wins";
      nextTurn = "Player";
    } else if (aiStat > playerStat) {
      lostSound.play();
      setWinStreak(0);
      newAi.push(aCard, pCard);
      result = "AI Wins";
      nextTurn = "AI";
    } else {
      newPlayer.push(pCard);
      newAi.push(aCard);
      result = "Draw";
      nextTurn = turnLocal;
    }

    setRoundResultLocal(result);

    setTimeout(() => {
      if (newPlayer.length === 0) {
        setRoundResultLocal("GAME OVER: AI WINS!");
        setGameStateLocal("game-over");
      } else if (newAi.length === 0) {
        setRoundResultLocal("GAME OVER: YOU WIN!");
        setGameStateLocal("game-over");
      } else {
        setPlayerCardsLocal(newPlayer);
        setAiCardsLocal(newAi);
        setTurnLocal(nextTurn);
        setSelectedStatLocal(null);
        setRoundResultLocal("");
        setGameStateLocal("playing");
      }
    }, 1500);
  };

  // MULTIPLAYER: join a room (emits to server)
  const joinRoom = (rId) => {
    if (!socketRef.current) {
      alert("Socket not connected. Choose Online mode first.");
      return;
    }
    socketRef.current.emit("joinRoom", rId);
    setRoomId(rId);
    setMode("waiting");
  };

  // MULTIPLAYER: when player chooses stat in online mode
  const handleStatSelectOnline = (statKey) => {
    if (!socketRef.current) return;
    if (!myId || turnId !== myId) {
      // not your turn
      return;
    }
    if (selectedStat) return;
    setSelectedStat(statKey);
    // emit to server
    socketRef.current.emit("chooseStat", { roomId, statKey });
  };

  // common UI helpers
  const myCards = mode === "solo" ? playerCardsLocal : cardsMap[myId] || [];
  const oppId = mode === "solo" ? "AI" : Object.keys(cardsMap).find((id) => id !== myId);
  const oppCards = mode === "solo" ? aiCardsLocal : cardsMap[oppId] || [];

  // Win streak sound (reuse)
  useEffect(() => {
    if (winStreak === 0) return;
    const allShots = [shot1, shot2, shot3, shot4, shot5];
    allShots.forEach((s) => {
      s.pause();
      s.currentTime = 0;
    });
    switch (winStreak) {
      case 1: shot1.play(); break;
      case 2: shot2.play(); break;
      case 3: shot3.play(); break;
      case 4: shot4.play(); break;
      case 5: shot5.play(); break;
      default: shot5.play(); setWinStreak(0); break;
    }
  }, [winStreak, shot1, shot2, shot3, shot4, shot5]);

  const toggleMusic = () => setIsMusicPlaying((s) => !s);

  // UI: simple controls to pick mode
  if (mode === "idle") {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-6">
        <h1 className="text-6xl font-black text-red-500">VALORANT WARS</h1>
        <div className="flex gap-4">
          <button onClick={startLocalGame} className="px-6 py-3 bg-red-600 rounded-lg">Play Local (vs AI)</button>
          <button onClick={() => setMode("online")} className="px-6 py-3 bg-blue-600 rounded-lg">Play Online (Join Room)</button>
        </div>
      </div>
    );
  }

  // Waiting room UI for online mode before join
  if (mode === "online" && !joinedRoom) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl">Join Online Room</h1>
        <div className="flex gap-2">
          <input value={roomId} onChange={(e) => setRoomId(e.target.value)} className="p-2 rounded text-black" />
          <button onClick={() => {
            // ensure socket connection established
            if (!socketRef.current) {
              setMode("online"); // this will start socket in effect
              setTimeout(() => joinRoom(roomId), 200); // small delay to ensure connect
            } else {
              joinRoom(roomId);
            }
          }} className="px-4 py-2 bg-green-600 rounded">Create/Join</button>
        </div>
        <p className="text-sm text-gray-400">Open same room id in another tab to start 1v1.</p>
        <button onClick={() => setMode("idle")} className="mt-4 px-3 py-2 bg-gray-700 rounded">Back</button>
      </div>
    );
  }

  // Waiting for opponent
  if (mode === "waiting") {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl">Waiting for opponent in room <strong>{roomId}</strong>...</h1>
        <p className="text-sm text-gray-400">Share this room id and open in another tab.</p>
        <button onClick={() => { socketRef.current && socketRef.current.disconnect(); setMode("idle"); }} className="mt-4 px-3 py-2 bg-gray-700 rounded">Cancel</button>
      </div>
    );
  }

  // Game UI (works for both solo and online modes)
  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-4">
      <div className="player-ai flex items-center justify-between w-full fixed z-[999] p-[20px] bg-zinc-950/80 backdrop-blur-sm top-0 left-0">
        <div className="text-blue-400">
          <strong className="text-xl">YOUR CARDS: {myCards.length}</strong>
        </div>
        <div className="text-xl text-center">
          {mode === "solo" && gameStateLocal === 'playing' && turnLocal === "Player" && <h2 className="text-blue-400 font-bold animate-pulse">YOUR TURN</h2>}
          {mode === "solo" && gameStateLocal === 'playing' && turnLocal === "AI" && <h2 className="text-red-400 font-bold">AI's TURN...</h2>}
          {mode === "online" && <h2 className={`font-bold ${turnId === myId ? "text-blue-400 animate-pulse" : "text-red-400"}`}>{turnId === myId ? "YOUR TURN" : "OPPONENT'S TURN"}</h2>}
        </div>
        <div className="text-red-400">
          <strong className="text-xl">OPP CARDS: {oppCards.length}</strong>
        </div>
      </div>

      <button onClick={toggleMusic} className="fixed bottom-4 right-4 bg-gray-800 p-3 rounded-full z-[999] hover:bg-gray-700 transition-colors">
        {isMusicPlaying ? "🔊" : "🔇"}
      </button>

      <main className="flex flex-col justify-center items-center w-full bg-zinc-950 gap-10 px-5 my-25 pt-24">
        {/* My card */}
        {myCards.length > 0 && (
          <UpdatedAgentCard
            key={myCards[0].uuid}
            agent={myCards[0]}
            isPlayerCard={true}
            onStatSelect={mode === "solo" ? handleStatSelectLocal : handleStatSelectOnline}
            selectedStat={mode === "solo" ? selectedStatLocal : selectedStat}
            showStats={true}
            isWinner={mode === "solo" ? (roundResultLocal === "Player Wins") : (roundInfo && roundInfo.result === "player" && roundInfo.playerId === myId)}
            isLoser={mode === "solo" ? (roundResultLocal === "AI Wins") : (roundInfo && ((roundInfo.result === "opponent" && roundInfo.opponentId === myId) || (roundInfo.result === "player" && roundInfo.playerId !== myId)))}
          />
        )}

        {/* Opponent card */}
        {oppCards.length > 0 && (
          <UpdatedAgentCard
            key={oppCards[0].uuid}
            agent={oppCards[0]}
            isPlayerCard={false}
            selectedStat={mode === "solo" ? selectedStatLocal : selectedStat}
            showStats={mode === "solo" ? (gameStateLocal === 'round-end' || selectedStatLocal) : (roundInfo !== null || selectedStat)}
            isWinner={mode === "solo" ? (roundResultLocal === "AI Wins") : (roundInfo && ((roundInfo.result === "opponent" && roundInfo.opponentId === myId) || (roundInfo.result === "player" && roundInfo.playerId !== myId)))}
            isLoser={mode === "solo" ? (roundResultLocal === "Player Wins") : (roundInfo && roundInfo.result === "player" && roundInfo.playerId === myId)}
          />
        )}

        {/* debug small status */}
        <div className="text-sm text-gray-400 mt-4">
          {mode === "online" && <div>Room: <strong>{roomId}</strong> • MyId: <strong>{myId}</strong> • Turn: <strong>{turnId}</strong></div>}
          {mode === "solo" && <div>Local mode • WinStreak: {winStreak}</div>}
          {mode === "online" && roundInfo && <div className="mt-2">Last round: {roundInfo.result} • Cards Left: You {cardsLeft[myId] || 0} - Opp {cardsLeft[oppId] || 0}</div>}
        </div>
      </main>
    </div>
  );
}

export default App;
