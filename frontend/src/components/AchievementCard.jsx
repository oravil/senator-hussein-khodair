import React from 'react';

export default function AchievementCard({ icon, number, label }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 group">
      <div className="text-amber-400 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-4xl font-bold text-amber-400 mb-2">{number}</div>
      <div className="text-blue-200">{label}</div>
    </div>
  );
}
