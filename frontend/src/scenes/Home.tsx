import { useEffect, useState } from "react";
import "../styles/home.scss";

export default function Home() {
  const [traced, setTraced] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const flag = sessionStorage.getItem("traced");
    setTraced(flag === "1");
    const welcomeSeen = sessionStorage.getItem("welcomeSeen");
    setShowWelcome(!welcomeSeen);
    return () => {
      sessionStorage.removeItem("traced");
      sessionStorage.setItem("welcomeSeen", "1");
    };
  }, []);

  return (
    <div className="home">
      {traced
        ? "You have been traced."
        : showWelcome
        ? "Welcome to the game."
        : ""}
    </div>
  );
}
