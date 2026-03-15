import React, { createContext, useState } from "react";

export type Achievement = { title: string; description: string };

export const AchievementContext = createContext<{
  achievements: Achievement[];
  addAchievement: (a: Achievement) => void;
}>({ achievements: [], addAchievement: () => {} });

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const addAchievement = (achievement: Achievement) => {
    setAchievements((prev) => {
      if (prev.some((a) => a.title === achievement.title)) return prev;
      return [...prev, achievement];
    });
  };

  return (
    <AchievementContext.Provider value={{ achievements, addAchievement }}>
      {children}
    </AchievementContext.Provider>
  );
};

export const Achievements: React.FC = () => {
  const { achievements } = React.useContext(AchievementContext);
  if (achievements.length === 0) return null;

  return (
    <div
      className="achievements-container"
      style={{ position: "fixed", bottom: "1rem", left: "1rem", zIndex: 9999 }}
    >
      {achievements.map((a, i) => (
        <div
          key={i}
          style={{
            background: "#00d1b2",
            color: "#000",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            marginBottom: "0.5rem",
            fontWeight: "bold",
          }}
        >
          🏆 {a.title}
        </div>
      ))}
    </div>
  );
};
