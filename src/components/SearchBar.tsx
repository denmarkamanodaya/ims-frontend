import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FcCheckmark } from "react-icons/fc";
import { AiOutlineStop } from "react-icons/ai";
import { getSubscribers } from "./../api/ims";

import "./SearchBar.css";

export const SearchBar = () => {
  const [results, setResults] = useState([]);
  const [input, setInput] = useState("");
  const [infoData, setInfoData] = useState("");

  const fetchData = async (inputValue: any) => {
    const results = await getSubscribers(inputValue);
    setResults(results);
  };
  const handleChange = (value: any) => {
    setInfoData("");
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="search-bar-container">
      <h1 className="search-title">Phone Search</h1>
      <div className="input-wrapper">
        <FaSearch id="search-icon" />
        <input
          id="search-bar"
          placeholder="Type mobile number..."
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>

      {
        <div className="search-info-container">
          {results.length > 0 ? (
            results.map((value) => {
              return (
                <div key={value.id} className="search-info">
                  <Link to="/info" state={{ data: value }}>
                    <div>
                      <span className="title">{value.phoneNumber}</span>
                      <span>
                        {value.status === "ACTIVE" ? (
                          <FcCheckmark />
                        ) : (
                          <AiOutlineStop id="inactive-icon" />
                        )}
                      </span>
                    </div>
                  </Link>

                  <div>
                    {value.username} |{" "}
                    <a className="domain-url" href={value.domain}>
                      {value.domain}
                    </a>
                  </div>
                </div>
              );
            })
          ) : input.length > 1 ? (
            <a href="/add" className="add-subscriber-button">
              [register]
            </a>
          ) : null}
        </div>
      }
    </div>
  );
};

export default SearchBar;
