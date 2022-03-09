import { useQuery } from "@apollo/client";
import { useState, useEffect, useRef } from "react";
import KillaSticker from "./KillaSticker.png";
import GluharSticker from "./GluharSticker.png";
import TagilaSticker from "./TagilaSticker.png";
import SturmanSticker from "./SturmanSticker.png";
import SanitarSticker from "./SanitarSticker.png";

import NumberFormat from "react-number-format";

import { ITEM_RESULTS, QUEST_RESULTS } from "./Queries";

const BOSS_IMAGES = [
  KillaSticker,
  GluharSticker,
  TagilaSticker,
  SturmanSticker,
  SanitarSticker,
];

const ItemsQuery = () => {
  const [filter, setFilter] = useState("");
  const [value, setValue] = useState("");

  const [queryResults, setQueryResults] = useState([]); // I an stupid and thought this would be an {} by default but nooooo it is a [] of {}'s
  const [releventQuests, setReleventQuests] = useState([]);

  const handleClick = (event) => {
    event.preventDefault();
    setFilter(value);
  };
  const handleChange = (event) => setValue(event.target.value);

  const { loading, error, data } = useQuery(ITEM_RESULTS, {
    variables: { name: filter },
  });

  const itemID = data?.itemsByName.map((item) => item.id).toString();

  const { data: releventQuestData } = useQuery(QUEST_RESULTS);

  useEffect(() => {
    if (filter !== "" && itemID !== undefined) {
      setQueryResults(data.itemsByName);

      setReleventQuests(releventQuestData.quests);
    }
  }, [data, filter]);

  // actual item component

  const Items = ({ item, quest }) => {
    const [editIndex, setEditIndex] = useState(null);

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

          {quest.map((quest, index) =>
            quest.objectives.map((objectives) =>
              objectives.target.includes(item.id) ? (
                <>
                  <button
                    onClick={() =>
                      setEditIndex((editIndex) =>
                        editIndex === index ? null : index
                      )
                    }
                  >
                    {quest.title}
                  </button>
                  {editIndex === index && (
                    <div className="relevent-quests">
                      <ul>
                        <div className="quest" key={quest.id}>
                          <h3>Quest: {quest.title}</h3>
                          <h3>Total: {objectives.number}</h3>
                          <h3> Trader: {quest.turnin.name}</h3>
                        </div>
                      </ul>
                    </div>
                  )}
                </>
              ) : null
            )
          )}
        </span>
      </div>
    );
  };

  if (loading)
    return (
      <div className="App">
        <div>
          <span>
            {BOSS_IMAGES.map((image, index) => (
              <img
                className="bossImages"
                src={image}
                alt={`boss${index}`}
                key={index}
              />
            ))}
          </span>

          <h2>Loading...</h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="App">
        <div>
          {BOSS_IMAGES.map((image, index) => (
            <img
              className="bossImages"
              src={image}
              alt={`boss${index}`}
              key={index}
            />
          ))}
        </div>
        <h2>Error :`(`</h2>
      </div>
    );

  return (
    <div className="App">
      <div>
        {BOSS_IMAGES.map((image, index) => (
          <img
            className="bossImages"
            src={image}
            alt={`boss${index}`}
            key={index}
          />
        ))}
      </div>
      <h1>Do I need this??</h1>
      <form onSubmit={handleClick}>
        <input type="text" value={value} onChange={handleChange} />
        <button type="submit">Search for an item</button>
        <button type="reset">Reset</button>
      </form>
      <div>
        <button onClick={() => setFilter("keycard")}>Keycards</button>
      </div>
      <div className="outerContainer">
        {queryResults.map((item) => (
          <Items key={item.id} item={item} quest={releventQuests} />
        ))}
      </div>
    </div>
  );
};

export default ItemsQuery;
