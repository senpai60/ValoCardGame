import React from "react";

function UpdatedAgentCard({
  agent,
  isPlayerCard,
  onStatSelect,
  selectedStat,
  showStats,
  isWinner,
  isLoser,
}) {
  // Stat button component
  const StatButton = ({ statKey, statValue }) => {
    const isSelected = selectedStat === statKey;
    const canSelect = isPlayerCard && showStats && !selectedStat;

    return (
      <div
        onClick={() => canSelect && onStatSelect(statKey)}
        className={`flex flex-col items-center justify-center rounded-xl p-4 font-medium transition-all duration-300 cursor-pointer
          ${isSelected ? "bg-red-600/30 ring-2 ring-red-500 scale-105" : "bg-zinc-900 hover:bg-zinc-800"}
        `}
        style={{
          boxShadow: isSelected ? "0 0 20px rgba(255,70,85,0.6)" : "none",
        }}
      >
        <span className="capitalize text-gray-400 text-sm">{statKey}</span>
        <span className={`text-lg font-semibold ${isSelected ? "text-red-500" : "text-white"}`}>
          {showStats ? statValue : "??"}
        </span>

        {isSelected && (
          <div className="absolute inset-0 rounded-xl pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-pulse" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`card w-full flex flex-col justify-between bg-zinc-900 rounded-2xl p-2 relative`}
      style={{
        border: "4px solid",
        borderColor: isWinner ? "#FFD700" : isLoser ? "#666" : "#FF4655",
        boxShadow: isWinner
          ? "0 0 40px rgba(255,215,0,0.6)"
          : isLoser
          ? "0 10px 30px rgba(100,100,100,0.5)"
          : "0 10px 30px rgba(255,70,85,0.4)",
      }}
    >
      {/* Top Section */}
      <div className="flex justify-between">
        <div
          style={{ backgroundImage: `url(${agent.image})` }}
          className="image w-24 h-24 bg-top bg-cover rounded-full"
        ></div>
        <div className="agent-info ml-4 flex flex-col justify-center w-60">
          <h1 className="text-red-400 text-2xl font-black">
            {agent.name}{" "}
            <span className="text-zinc-500 ml-2 text-sm capitalize">@{agent.role}</span>
          </h1>
          <p className="text-gray-400 text-xs">{agent.description}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats w-full h-[60%] bg-zinc-950 rounded-2xl grid grid-cols-2 grid-rows-2 gap-3 p-3 mt-3">
        {Object.keys(agent.stats).map((statKey) => (
          <StatButton
            key={statKey}
            statKey={statKey}
            statValue={agent.stats[statKey]}
          />
        ))}
      </div>

      {/* Winner / Loser Badge */}
      {(isWinner || isLoser) && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div
            className={`px-6 py-2 rounded-full font-black text-sm uppercase tracking-wider ${
              isWinner
                ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/50"
                : "bg-gradient-to-r from-gray-600 to-gray-800 text-gray-300"
            }`}
          >
            {isWinner ? "👑 WINNER" : "💀 DEFEATED"}
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdatedAgentCard;
