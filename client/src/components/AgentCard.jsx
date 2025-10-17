import React from "react";

const AgentCard = ({
  agent,
  onStatSelect,
  selectedStat = null,
  isPlayerCard = false,
  showStats = true,
  isWinner = false,
  isLoser = false,
}) => {
  // VALORANT Role Colors
  const roleColors = {
    Duelist: {
      primary: "#FF4655",
      secondary: "#FD4556",
      glow: "rgba(255, 70, 85, 0.5)",
    },
    Sentinel: {
      primary: "#0F1923",
      secondary: "#1F2326",
      glow: "rgba(15, 25, 35, 0.5)",
    },
    Controller: {
      primary: "#BD3944",
      secondary: "#FF4655",
      glow: "rgba(189, 57, 68, 0.5)",
    },
    Initiator: {
      primary: "#0F1923",
      secondary: "#BD3944",
      glow: "rgba(189, 57, 68, 0.5)",
    },
  };

  const roleColor = roleColors[agent.role] || roleColors.Duelist;

  // Stat Row Component
  const StatRow = ({ statName, statValue, statKey }) => {
    const isSelected = selectedStat === statKey;
    const canSelect = isPlayerCard && showStats && !selectedStat;

    return (
      <div
        onClick={() => canSelect && onStatSelect && onStatSelect(statKey)}
        className={`relative flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${
          canSelect ? "cursor-pointer hover:bg-white/10" : ""
        } ${
          isSelected
            ? "bg-gradient-to-r from-red-500/30 to-red-600/30 ring-2 ring-red-500"
            : "bg-black/30"
        }`}
        style={{
          transform: isSelected ? "scale(1.05)" : "scale(1)",
          boxShadow: isSelected ? "0 0 20px rgba(255, 70, 85, 0.6)" : "none",
        }}
      >
        {/* Stat Label */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isSelected ? "bg-red-500 animate-pulse" : "bg-gray-500"
            }`}
          />
          <span
            className={`text-sm font-bold uppercase tracking-wider ${
              isSelected ? "text-white" : "text-gray-300"
            }`}
          >
            {statName}
          </span>
        </div>

        {/* Stat Value */}
        <div className="flex items-center space-x-2">
          <div
            className={`text-2xl font-black ${
              isSelected ? "text-red-500" : "text-white"
            }`}
          >
            {showStats ? statValue : "??"}
          </div>

          {/* Selection Arrow */}
          {canSelect && (
            <div className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              ▶
            </div>
          )}
        </div>

        {/* Animated Selection Effect */}
        {isSelected && (
          <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-pulse" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`relative group transition-all duration-500 ${
        isWinner
          ? "scale-105 animate-pulse"
          : isLoser
          ? "scale-95 opacity-70"
          : ""
      }`}
    >
      {/* Winner/Loser Badge */}
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

      {/* Card Container */}
      <div
        className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl overflow-hidden border-4 shadow-2xl transition-all duration-300"
        style={{
          borderColor: isWinner
            ? "#FFD700"
            : isLoser
            ? "#666"
            : roleColor.primary,
          boxShadow: isWinner
            ? "0 0 40px rgba(255, 215, 0, 0.6)"
            : `0 20px 40px ${roleColor.glow}`,
        }}
      >
        {/* VALORANT Style Top Bar */}
        <div
          className="h-3"
          style={{
            background: `linear-gradient(90deg, ${roleColor.primary} 0%, ${roleColor.secondary} 100%)`,
          }}
        />

        {/* Header Section */}
        <div className="relative p-4 pb-2">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${roleColor.primary} 10px, ${roleColor.primary} 11px)`,
              }}
            />
          </div>

          {/* Role Badge */}
          <div className="relative z-10 flex items-center justify-between mb-3">
            <div
              className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-black"
              style={{ backgroundColor: roleColor.primary }}
            >
              {agent.role}
            </div>

            {/* Player Indicator */}
            {isPlayerCard && (
              <div className="px-3 py-1 bg-blue-500 rounded-full text-xs font-bold text-white">
                YOU
              </div>
            )}
          </div>

          {/* Agent Name */}
          <h2
            className="relative z-10 text-4xl font-black text-white uppercase tracking-tight mb-1"
            style={{
              textShadow: `2px 2px 4px ${roleColor.primary}`,
            }}
          >
            {agent.name}
          </h2>

          {/* Description */}
          <p className="relative z-10 text-xs text-gray-400 uppercase tracking-wide font-medium">
            {agent.description}
          </p>
        </div>

        {/* Agent Image/Avatar Section */}
        <div className="relative h-48 overflow-hidden">
          {/* Animated Background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `linear-gradient(135deg, ${roleColor.primary} 0%, transparent 100%)`,
            }}
          />

          {/* Hexagon Pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle, ${roleColor.primary} 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Agent Avatar */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-40 h-40 rounded-full flex items-center justify-center text-7xl font-black text-white relative"
              style={{
                background: `linear-gradient(135deg, ${roleColor.primary} 0%, ${roleColor.secondary} 100%)`,
                boxShadow: `0 0 40px ${roleColor.glow}`,
              }}
            >
             <img 
                src={agent.image} // Use the image path from your data
                alt={agent.name}  // Add alt text for accessibility
                className="w-full h-full object-cover rounded-full" // Ensure image fills the circle
              />

              {/* Spinning Ring */}
              <div
                className="absolute inset-0 rounded-full border-4 border-dashed animate-spin"
                style={{
                  borderColor: `transparent ${roleColor.primary} transparent ${roleColor.primary}`,
                  animationDuration: "8s",
                }}
              />
            </div>
          </div>

          {/* VALORANT Style Corner Accent */}
          <div
            className="absolute top-0 right-0 w-32 h-32 opacity-30"
            style={{
              background: `linear-gradient(135deg, transparent 50%, ${roleColor.primary} 50%)`,
            }}
          />
        </div>

        {/* Stats Section */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
              Combat Stats
            </h3>
            {isPlayerCard && !selectedStat && showStats && (
              <span className="text-xs text-red-500 font-bold animate-pulse">
                SELECT STAT ▼
              </span>
            )}
          </div>

          <div className="space-y-2">
            <StatRow
              statName="Damage"
              statValue={agent.stats.damage}
              statKey="damage"
            />
            <StatRow
              statName="Utility"
              statValue={agent.stats.utility}
              statKey="utility"
            />
            <StatRow
              statName="Mobility"
              statValue={agent.stats.mobility}
              statKey="mobility"
            />
            <StatRow
              statName="Control"
              statValue={agent.stats.control}
              statKey="control"
            />
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div
          className="h-2"
          style={{
            background: `linear-gradient(90deg, ${roleColor.secondary} 0%, ${roleColor.primary} 100%)`,
          }}
        />
      </div>
    </div>
  );
};

export default AgentCard;
