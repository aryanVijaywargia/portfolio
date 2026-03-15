import React, { useEffect, useState } from "react";

type BootScreenProps = { onComplete: () => void };

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setVisible(false);
        setTimeout(() => onComplete(), 500);
      },
      5000
    );
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="boot-screen">
      <h1 className="title is-size-1">Aryan_OS</h1>
      <p>2025© - Earth - v1.0.0</p>
      <div className="loading-dots">
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </div>
    </div>
  );
};
