import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import "./play.css";

// Initialize Supabase client
const supabase = createClient(
  "https://dsaqpdcjururrndrznaw.supabase.co", // Supabase URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzYXFwZGNqdXJ1cnJuZHJ6bmF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDc4ODIsImV4cCI6MjA2NjUyMzg4Mn0.OrCZMnYa36EPZI6GEJEirIHW_9tE6jIBTE9QC2bbpNs" // Replace this with your actual API key
);

const Play = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentMovie, setCurrentMovie] = useState("");
  const [songSuggestions, setSongSuggestions] = useState([]);
  const [selectedSong, setSelectedSong] = useState("");
  const [chances, setChances] = useState(3);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isSearchDisabled, setIsSearchDisabled] = useState(false);
  const navigate = useNavigate();

  // Fetch data from Supabase when the search term changes
  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm) {
        const { data, error } = await supabase
          .from("movies")
          .select("*")
          .ilike("movie_name", `%${searchTerm}%`);

        if (error) {
          console.error("Error fetching data:", error);
        } else {
          setSuggestions(data);
        }
      } else {
        setSuggestions([]);
      }
    };
    fetchData();
  }, [searchTerm]);

  const handleSearch = (event) => {
    const value = event.target.value.trim().toLowerCase();
    setSearchTerm(value);
  };

  const handleSelectMovie = (movie) => {
    setFilteredData([
      {
        actor_name: movie.actor_name,      // Store the full actor name
        actress_name: movie.actress_name,  // Store the full actress name
        movie_name: movie.movie_name,      // Store the full movie name
        song: "",
      },
    ]);
    setCurrentMovie(movie.movie_name.toLowerCase());
    setSongSuggestions(movie.songs || []);
    setSuggestions([]);
    setSearchTerm("");
    setIsSearchDisabled(true);
  };

  const handleSongSelect = (song) => {
    setSelectedSong(song);
    setFilteredData((prevData) => [
      { ...prevData[0], song: song },
    ]);
    setSongSuggestions([]);
  };

  const handleAnswerCheck = () => {
    if (!currentMovie) {
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      return;
    }

    const answer = document.getElementById("answerInput").value.trim().toLowerCase();
    if (answer === currentMovie) {
      // Store the correct guessed movie in localStorage
      localStorage.setItem(
        "guessedMovie",
        JSON.stringify({
          movie_name: currentMovie,
          actor_name: filteredData[0]?.actor_name,
          actress_name: filteredData[0]?.actress_name,
          selectedSong,
        })
      );
      navigate("/submit");
    } else {
      setChances((prev) => {
        const newChances = prev - 1;
        if (newChances === 0) {
          localStorage.setItem(
            "guessedMovie",
            JSON.stringify({
              movie_name: currentMovie,
              actor_name: filteredData[0]?.actor_name,
              actress_name: filteredData[0]?.actress_name,
              selectedSong,
            })
          );
          navigate("/reveal");
        }
        return newChances;
      });
    }
  };

  const handleReveal = () => {
    if (!currentMovie) {
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      return;
    }

    localStorage.setItem(
      "guessedMovie",
      JSON.stringify({
        movie_name: currentMovie,
        actor_name: filteredData[0]?.actor_name,
        actress_name: filteredData[0]?.actress_name,
        selectedSong,
      })
    );
    navigate("/reveal");
  };

  return (
    <>
      <div className="play-bgimg"></div>
      <div className="play-title">
        <h1>MORGAN'S MOVIE TIME</h1>
      </div>
      <div className="search">
        <div className="search-wrapper">
          <input
            type="text"
            id="searchBox"
            placeholder="SEARCH MOVIES"
            autoComplete="off"
            value={searchTerm}
            onInput={handleSearch}
            disabled={isSearchDisabled}
          />
          {alertVisible && (
            <div className="alert-message show">
              Search Box is Empty, Please fill it.
            </div>
          )}
          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((movie, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSelectMovie(movie)}
                >
                  {movie.movie_name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="grid">
        <div className="grid-item">
          <input
            type="text"
            placeholder="Hero"
            value={filteredData[0]?.actor_name?.charAt(0) || ""} // Display first letter only
            readOnly
          />
        </div>
        <div className="grid-item">
          <input
            type="text"
            placeholder="Heroine"
            value={filteredData[0]?.actress_name?.charAt(0) || ""} // Display first letter only
            readOnly
          />
        </div>
        <div className="grid-item">
          <input
            type="text"
            placeholder="Movie"
            value={filteredData[0]?.movie_name?.charAt(0) || ""} // Display first letter only
            readOnly
          />
        </div>
        <div className="grid-item">
          <input
            type="text"
            placeholder="Song"
            value={filteredData[0]?.song?.charAt(0) || ""} // Display first letter only
            readOnly
          />
        </div>
      </div>
      {songSuggestions.length > 0 && (
        <div className="song-suggestions">
          {songSuggestions.map((song, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSongSelect(song)}
            >
              {song}
            </div>
          ))}
        </div>
      )}
      <div className="answer">
        <input
          type="text"
          id="answerInput"
          placeholder="TYPE YOUR ANSWER"
          autoComplete="off"
        />
      </div>
      <div className="buttons">
        <button className="submit-btn" onClick={handleAnswerCheck}>
          SUBMIT
        </button>
        <button className="reveal-btn" onClick={handleReveal}>
          REVEAL
        </button>
      </div>
      <div className="chances">Chances Left: {chances}</div>
    </>
  );
};

export default Play;
