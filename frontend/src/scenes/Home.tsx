import React, { useEffect, useState } from "react";
import "../styles/home.scss";

export default function Home() {
  const [traced, setTraced] = useState(false);

  useEffect(() => {
    const flag = sessionStorage.getItem("traced");
    setTraced(flag === "1");
  }, []);

  return (
    <div className="home">
      {traced ? "You have been traced." : "Welcome to the game."}
    </div>
  );
}
