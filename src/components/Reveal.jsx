import React from "react";
import { useNavigate } from "react-router-dom";
import "./reveal.css";

const Reveal = () => {
  const navigate = useNavigate();
  const guessedMovie = JSON.parse(localStorage.getItem("guessedMovie"));

  if (!guessedMovie) {
    return <div>No movie data found.</div>;
  }

  return (
    <>
      <div className="reveal-bgimg"></div>
      <div className="reveal-title">
        <h1>MORGAN'S MOVIE TIME</h1>
      </div>

      <div className="content-box">
        <h1>THE CORRECT ANSWER</h1>
        <div className="movie-info">
          <p>Movie Name: {guessedMovie.movie_name}</p>
          <p>Actor Name: {guessedMovie.actor_name}</p>
          <p>Actress Name: {guessedMovie.actress_name}</p>
          <p>Song Name: {guessedMovie.selectedSong}</p>
        </div>
        <button onClick={() => navigate("/play")}>Play Again</button>
      </div>
    </>
  );
};

export default Reveal;
