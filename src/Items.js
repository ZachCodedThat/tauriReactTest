import { useQuery } from "@apollo/client";
import { useState, useEffect, useRef } from "react";
import useDebounce from "./useDebounce";
import Fuse from "fuse.js";
import supabase from "./supabase.png";
import NumberFormat from "react-number-format";

import { ITEM_RESULTS, QUEST_RESULTS } from "./Queries";

const ItemsQuery = () => {
  const [filter, setFilter] = useState("");
  const [value, setValue] = useState("");

  const [queryResults, setQueryResults] = useState([]); // I an stupid and thought this would be an {} by default but nooooo it is a [] of {}'s
  const [questItemIDResults, setQuestItemIDResults] = useState([]);
  const [releventQuests, setReleventQuests] = useState([]);

  const searchInput = useRef();
  const handleFocus = () => {
    searchInput.current.focus();
  };

  const handleClick = (event) => {
    event.preventDefault();
    setFilter(value);
  };
  const handleChange = (event) => setValue(event.target.value);

  // fetches and such

  const { loading, error, data } = useQuery(ITEM_RESULTS, {
    variables: { name: filter },
  });

  const itemID = data?.itemsByName.map((item) => item.id).toString();

  // console.log(itemID, "itemID");

  const { data: questData } = useQuery(QUEST_RESULTS);

  const questItem = questData?.quests
    .map((quest) => quest.objectives)
    .flatMap((objectives) =>
      objectives
        .map((objective) => objective.target)
        .filter((item) => item.includes(itemID))
    )

    .toString()
    .includes(itemID);

  console.log(questItem, "questItem");

  const { data: releventQuestData } = useQuery(QUEST_RESULTS);

  // console.log(releventQuests, "releventQuestData");

  useEffect(() => {
    if (filter !== "" && itemID !== undefined) {
      setQueryResults(data.itemsByName);
      setQuestItemIDResults(questData.quests);

      setReleventQuests(releventQuestData.quests);
    }
  }, [data]);

  // actual item component

  const Items = ({ item, quest }) => {
    // console.log(quest, "quest");
    return (
      <div className="quest-item">
        <span>
          <h2>{item.name}</h2>
          <h4>{item.id}</h4>
          <img src={item.imageLink} alt={item.name} />

          <div>
            <NumberFormat
              thousandSeparator={true}
              thousandsGroupStyle="thousand"
              prefix={"₽"}
              value={item.avg24hPrice}
              displayType={"text"}
            />
          </div>

          {questItem ? (
            <div>
              <h2>Relevent Quests</h2>
              <ul>
                {quest.map((quest) =>
                  quest.objectives.map((objectives) =>
                    objectives.target.includes(itemID) ? (
                      <li key={quest.id}>{quest.title}</li>
                    ) : null
                  )
                )}
              </ul>
            </div>
          ) : null}
        </span>
      </div>
    );
  };

  if (loading)
    return (
      <div className="App">
        <div>
          <img src={supabase} className="App-logo" alt="logo" />

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
        <p>Enter item name</p>
        <form onSubmit={handleClick}>
          <input
            type="text"
            value={value}
            onChange={handleChange}
            ref={searchInput}
          />
          <button type="submit">Search</button>
        </form>
        <div className="outerContainer">
          {queryResults.map((item) => (
            <Items key={item.id} item={item} quest={releventQuests} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemsQuery;
