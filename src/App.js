import "./App.css";

import ItemsQuery from "./Items";
import Quests from "./Quests";
import { useState } from "react";

function App() {
  const [searchParams, setSearchParams] = useState("");
  return (
    <>
      <button onClick={() => setSearchParams("Quests")}> Quests </button>
      <button onClick={() => setSearchParams("Items")}> Items </button>
      {searchParams === "Quests" ? (
        <div className="App">
          <Quests />
        </div>
      ) : (
        <div className="App">
          <ItemsQuery />
        </div>
      )}
    </>
  );
}


export default App;
