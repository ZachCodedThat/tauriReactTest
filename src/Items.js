import { useQuery } from "@apollo/client";
import { useState, useEffect, useRef } from "react";
import useDebounce from "./useDebounce";
import Fuse from "fuse.js";
import killaImage from "./killaImage.gif";
import NumberFormat from "react-number-format";

import { ITEM_RESULTS, QUEST_RESULTS } from "./Queries";

const ItemsQuery = () => {
  const [filter, setFilter] = useState("");
  const [value, setValue] = useState("");

  const [queryResults, setQueryResults] = useState([]); // I an stupid and thought this would be an {} by default but nooooo it is a [] of {}'s
  const [questItemIDResults, setQuestItemIDResults] = useState([]);
  const [releventQuests, setReleventQuests] = useState([]);
  const [questItems, setQuestItems] = useState([]);

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
    .flatMap((objectives) => objectives.map((objective) => objective.target))

    .toString()
    .includes(itemID);

  console.log(questItems, "questItem");

  const { data: releventQuestData } = useQuery(QUEST_RESULTS);

  // console.log(releventQuests, "releventQuestData");

  useEffect(() => {
    if (filter !== "" && itemID !== undefined) {
      setQueryResults(data.itemsByName);
      setQuestItemIDResults(questData.quests);

      setReleventQuests(releventQuestData.quests);
      setQuestItems(questItem);
    }
  }, [data]);

  // actual item component

  const Items = ({ item, quest }) => {
    // console.log(quest, "quest");
    return filter === "" ? null : (
      <div className="quest-item">
        <span>
          <h2>{item.name}</h2>
          <h4>
            Current avg price:{" "}
            <strong>
              <NumberFormat
                thousandSeparator={true}
                thousandsGroupStyle="thousand"
                prefix={"₽"}
                value={item.avg24hPrice}
                displayType={"text"}
              />
            </strong>
          </h4>
          <img src={item.imageLink} alt={item.name} />

          {questItem ? (
            <div className="relevent-quests">
              <h2>Relevent Quests</h2>
              <ul>
                {quest.map((quest) =>
                  quest.objectives.map((objectives) =>
                    objectives.target.includes(itemID) ? (
                      <div className="quest" key={quest.id}>
                        <h3>Quest: {quest.title}</h3>
                        <h3>Total: {objectives.number}</h3>
                        <h3> Trader: {quest.turnin.name}</h3>
                      </div>
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
      <div>
        <div>
          <img src={killaImage} className="App-logo" alt="logo" />

          <p>Loading...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div>
        <div>
          <img src={killaImage} className="App-logo" alt="logo" />
          <p>YUUUUUUUUUURRRRRT</p>
          <p>Error :`(`</p>
        </div>
      </div>
    );

  return (
    <div>
      <div>
        <img src={killaImage} className="App-logo" alt="logo" />
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
