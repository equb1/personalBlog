// UptimeDisplay.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const theme = {
  text: "#1e293b",
};

const UptimeContainer = styled.div`
  font-size: 0.875rem;
  color: ${theme.text};
`;

const UptimeDisplay = () => {
  const [uptime, setUptime] = useState("");

  useEffect(() => {
    const launchDate = new Date("2025-03-20");
    const update = () => {
      const now = new Date();
      const diff = now.getTime() - launchDate.getTime();

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
      const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));

      setUptime(`${years} 年 ${months} 月 ${days} 天`);
    };

    update();
    const timer = setInterval(update, 86400000); // 每天更新

    return () => clearInterval(timer);
  }, []);

  return (
    <UptimeContainer>
      <span>⏳ 网站已运行: {uptime}</span>
    </UptimeContainer>
  );
};

export default UptimeDisplay;