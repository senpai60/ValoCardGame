// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const AllCards = require("./data/AllCards"); // use your provided AllCards

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite dev server origin
    methods: ["GET", "POST"]
  }
});


const rooms = {}; // roomId => { players: [socketId], gameState }

function shuffleCards(cards) {
  // Fisher-Yates or simple shuffle (ok for game)
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  const mid = Math.ceil(shuffled.length / 2);
  return [shuffled.slice(0, mid), shuffled.slice(mid)];
}

io.on("connection", (socket) => {
  console.log("🔌 Player connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    if (!roomId) roomId = "room1";
    if (!rooms[roomId]) {
      rooms[roomId] = { players: [], gameState: null };
    }

    const room = rooms[roomId];

    if (room.players.includes(socket.id)) {
      socket.emit("joined", { roomId });
      return;
    }

    if (room.players.length >= 2) {
      socket.emit("roomFull");
      return;
    }

    room.players.push(socket.id);
    socket.join(roomId);
    console.log(`➡️ ${socket.id} joined room ${roomId}`);

    socket.emit("joined", { roomId, myId: socket.id });

    // If 2 players, start the game
    if (room.players.length === 2) {
      const [p1Cards, p2Cards] = shuffleCards(AllCards);
      room.gameState = {
        cards: {
          [room.players[0]]: p1Cards,
          [room.players[1]]: p2Cards,
        },
        turn: room.players[Math.floor(Math.random() * 2)],
      };

      // Emit full initial state to both players
      io.to(roomId).emit("gameStart", {
        cards: room.gameState.cards,
        turn: room.gameState.turn,
      });

      console.log(`🎮 Game started in ${roomId}. Turn: ${room.gameState.turn}`);
    } else {
      // If only one player so far, notify waiting
      io.to(roomId).emit("waiting", { players: room.players.length });
    }
  });

  // Player chooses a stat
  socket.on("chooseStat", ({ roomId, statKey }) => {
    const room = rooms[roomId];
    if (!room || !room.gameState) return;

    const game = room.gameState;
    if (socket.id !== game.turn) {
      // Not this player's turn — ignore
      socket.emit("notYourTurn");
      return;
    }

    const playerId = socket.id;
    const opponentId = room.players.find((id) => id !== playerId);
    if (!opponentId) return;

    const playerCards = game.cards[playerId];
    const opponentCards = game.cards[opponentId];

    // Safety: if deck empty (shouldn't happen), end
    if (!playerCards || !opponentCards || playerCards.length === 0 || opponentCards.length === 0) {
      io.to(roomId).emit("gameOver", { winner: playerCards.length > 0 ? playerId : opponentId });
      delete rooms[roomId];
      return;
    }

    const playerCard = playerCards.shift();
    const opponentCard = opponentCards.shift();

    const playerStat = playerCard.stats[statKey];
    const opponentStat = opponentCard.stats[statKey];

    let result = "draw";
    if (playerStat > opponentStat) {
      playerCards.push(playerCard, opponentCard);
      result = "player";
      game.turn = playerId;
    } else if (playerStat < opponentStat) {
      opponentCards.push(opponentCard, playerCard);
      result = "opponent";
      game.turn = opponentId;
    } else {
      // draw: each keeps their card (already shifted and we push back)
      playerCards.push(playerCard);
      opponentCards.push(opponentCard);
      result = "draw";
      // turn unchanged
    }

    // Emit roundResult with everything client needs (decks included)
    io.to(roomId).emit("roundResult", {
      playerId,
      opponentId,
      playerCard,
      opponentCard,
      result,
      turn: game.turn,
      cards: game.cards, // full decks keyed by socket.id
      cardsLeft: {
        [playerId]: playerCards.length,
        [opponentId]: opponentCards.length,
      },
    });

    // Check for game over after move
    if (playerCards.length === 0) {
      io.to(roomId).emit("gameOver", { winner: opponentId });
      delete rooms[roomId];
    } else if (opponentCards.length === 0) {
      io.to(roomId).emit("gameOver", { winner: playerId });
      delete rooms[roomId];
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Player disconnected:", socket.id);
    // Remove from rooms
    for (const roomId in rooms) {
      const room = rooms[roomId];
      if (!room) continue;
      if (room.players.includes(socket.id)) {
        room.players = room.players.filter((id) => id !== socket.id);
        io.to(roomId).emit("playerLeft", { leftId: socket.id });
      }
      if (room.players.length === 0) delete rooms[roomId];
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
