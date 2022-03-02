import { useQuery } from "@apollo/client";
import { useState, useEffect, useRef } from "react";
import useDebounce from "./useDebounce";
import Fuse from "fuse.js";
import supabase from "./supabase.png";

import { ITEM_RESULTS } from "./Queries";

const ItemsQuery = () => {
  const [filter, setFilter] = useState("");

  const [queryResults, setQueryResults] = useState([]); // I an stupid and thought this would be an {} by default but nooooo it is a [] of {}'s

  const searchInput = useRef();
  const handleFocus = () => {
    searchInput.current.focus();
  };

  const handleChange = (event) => setFilter(event.target.value);

  const debouncedFilter = useDebounce(filter, 750);

  const { loading, error, data } = useQuery(ITEM_RESULTS, {
    variables: { name: debouncedFilter },
  });

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
        keys: ["name"],
      };
      handleFocus();

      const fuse = new Fuse(data.itemsByName, options);
      const results = fuse.search(debouncedFilter);
      setQueryResults(results.map((result) => result.item));
    }
  }, [data, debouncedFilter]);

  const Items = ({ item }) => {
    return (
      <div className="quest-item">
        <span>
          <h2>{item.name}</h2>
          <img src={item.imageLink} alt={item.name} />
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
        <input
          type="text"
          value={filter}
          onChange={handleChange}
          ref={searchInput}
        />
        <div className="outerContainer">
          {queryResults.map((item) => (
            <Items key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemsQuery;
