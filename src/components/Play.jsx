import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import "./play.css";

// Initialize Supabase client (use environment variables for security in production)
const supabase = createClient(
  "https://chffpfbfjhodtjzfnjwb.supabase.co", // Supabase URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZmZwZmJmamhvZHRqemZuandiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3NjkyMzIsImV4cCI6MjA0ODM0NTIzMn0.yO_3VD3n16FobNgd8VdDzUUEWuk89Hj0WJ-hWiI73Yk" // Replace this with a secure way to load your API key (e.g., environment variables)
);

const Play = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentMovie, setCurrentMovie] = useState("");
  const [songSuggestions, setSongSuggestions] = useState([]);
  const [selectedSong, setSelectedSong] = useState("");
  const [chances, setChances] = useState(3);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isSearchDisabled, setIsSearchDisabled] = useState(false);
  const [userData, setUserData] = useState([]); // State to store fetched movie data
  const navigate = useNavigate();

  // Fetch movie data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("movies") // Your table name in Supabase
        .select("*");

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setUserData(data); // Set the fetched data to userData state
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.trim().toLowerCase();
    setSearchTerm(value);

    if (value) {
      const matches = userData.filter((movie) =>
        movie.movie_name.toLowerCase().startsWith(value)
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectMovie = (movie) => {
    setFilteredData([{
      actor_name: movie.actor_name.charAt(0),
      actress_name: movie.actress_name.charAt(0),
      movie_name: movie.movie_name.charAt(0),
      song: "", // Initially empty when a movie is selected
    }]);
    setCurrentMovie(movie.movie_name.toLowerCase());
    setSongSuggestions(movie.songs); // Set song suggestions (using 'songs' instead of 'song')
    setSuggestions([]);
    setSearchTerm("");
    setIsSearchDisabled(true);
  };

  const handleSongSelect = (song) => {
    setSelectedSong(song); // Store full song name for later use
    setFilteredData((prevData) => [
      { ...prevData[0], song: song.charAt(0) }, // Only the first letter for the grid
    ]);
    setSongSuggestions([]); // Hide song suggestions after selection
  };

  const handleAnswerCheck = () => {
    if (currentMovie === "") {
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      return;
    }

    const answer = document.getElementById("answerInput").value.trim().toLowerCase();
    if (answer === currentMovie) {
      const matchedMovie = userData.find(
        (movie) => movie.movie_name.toLowerCase() === currentMovie
      );
      if (matchedMovie) {
        localStorage.setItem(
          "guessedMovie",
          JSON.stringify({ ...matchedMovie, selectedSong })
        );
      }
      navigate("/submit");
    } else {
      setChances((prev) => {
        const newChances = prev - 1;
        if (newChances === 0) {
          const matchedMovie = userData.find(
            (movie) => movie.movie_name.toLowerCase() === currentMovie
          );
          if (matchedMovie) {
            localStorage.setItem(
              "guessedMovie",
              JSON.stringify({ ...matchedMovie, selectedSong })
            );
          }
          navigate("/reveal");
        }
        return newChances;
      });
    }
  };

  const handleReveal = () => {
    if (currentMovie === "") {
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      return;
    }
    const matchedMovie = userData.find(
      (movie) => movie.movie_name.toLowerCase() === currentMovie
    );
    if (matchedMovie) {
      localStorage.setItem(
        "guessedMovie",
        JSON.stringify({ ...matchedMovie, selectedSong })
      );
    }
    navigate("/reveal");
  };

  return (
    <>
      <div className="play-bgimg"></div>
      <div className="play-title">
        <h1>MORGAN'S MOVIE TIME</h1>
      </div>
      <div className="search">
        <div className="search-wrapper" id="searchBoxContainer">
          <div className="search-icon"></div>
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
            value={filteredData[0]?.actor_name || ""}
            readOnly
          />
        </div>
        <div className="grid-item">
          <input
            type="text"
            placeholder="Heroine"
            value={filteredData[0]?.actress_name || ""}
            readOnly
          />
        </div>
        <div className="grid-item">
          <input
            type="text"
            placeholder="Movie"
            value={filteredData[0]?.movie_name || ""}
            readOnly
          />
        </div>
        <div className="grid-item">
          <input
            type="text"
            placeholder="Song"
            value={filteredData[0]?.song || ""}
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
      <div className="chances" id="chancesDisplay">
        Chances Left: {chances}
      </div>
    </>
  );
};

export default Play;
