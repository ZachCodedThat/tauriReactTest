import supabase from "./supabase.png";
import "./App.css";
import { useQuery, gql } from "@apollo/client";
import { useState, useEffect } from "react";

import Fuse from "fuse.js";

function App() {
  const [filter, setFilter] = useState("");

  const [queryResults, setQueryResults] = useState([]); // I an stupid and thought this would be an {} by default but nooooo it is a [] of {}'s

  const handleChange = (event) => setFilter(event.target.value);

  const QUEST_RESULTS = gql`
    query getAllQuestItems {
      quests {
        title
        id
        turnin {
          name
        }

        requirements {
          level
        }
        objectives {
          number
          target

          targetItem {
            name
            imageLink
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(QUEST_RESULTS);

  useEffect(() => {
    if (data) {
      const options = {
        includesMatches: true,
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 200,
        maxPatternLength: 32,
        minMatchCharLength: 2,
        keys: ["title", "turnin.name"],
      };

      const fuse = new Fuse(data.quests, options);
      const results = fuse.search(filter);
      setQueryResults(results.map((result) => result.item));
    }
  }, [data, filter]);

  const QuestItem = ({ quest }) => {
    return (
      <div className="quest-item">
        <span>
          <h3>{quest.title}</h3>
          {quest.objectives
            .filter(
              (questRequirements) =>
                questRequirements.targetItem !== null &&
                questRequirements.targetItem.name !== "MS2000 Marker" &&
                questRequirements.targetItem.name !== "WI-FI Camera" &&
                questRequirements.targetItem.name !== "Signal Jammer"
            )
            .map((questRequirements) => (
              <div>
                <img src={questRequirements.targetItem.imageLink} />
                <span>
                  {questRequirements.targetItem.name != null
                    ? ` X ${questRequirements.number}`
                    : null}
                </span>
              </div>
            ))}
          <h3>{quest.id}</h3>
          <h3>{quest.turnin.name}</h3>
        </span>
      </div>
    );
  };

  if (loading)
    return (
      <div className="App">
        <div>
          <img src={supabase} className="App-logo" alt="logo" />
          <p>YUUUUUUUUUURRRRRT</p>
          <p>Loading...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="App">
        <div>
          <img src={supabase} className="App-logo" alt="logo" />
          <p>YUUUUUUUUUURRRRRT</p>
          <p>Error :`(`</p>
        </div>
      </div>
    );

  return (
    <div className="App">
      <div>
        <img src={supabase} className="App-logo" alt="logo" />
        <p>YUUUUUUUUUURRRRRT</p>
        <input type="text" value={filter} onChange={handleChange} />
        <div className="outerContainer">
          {queryResults.map((quest) => (
            <QuestItem key={quest.id} quest={quest} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
