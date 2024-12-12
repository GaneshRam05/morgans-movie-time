import React from 'react';
import './home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/play');
  };

  const handleInfoClick = () => {
    navigate('/information'); 
  };

  return (
    <>
      <div className="bg"></div>
      <div className="title">
        <h1>GUESS THE MOVIE</h1>
      </div>
      <div className="details">
        <button onClick={handlePlayClick}>PLAY</button>
        <button>MORE APPS</button>
        <button onClick={handleInfoClick}>INFO</button>
      </div>
      <div className="detailsbox"></div>
      <div className="end">
        <h1>MORGAN</h1>
      </div>
      <div className="end2">
        <h2>Movie Time</h2>
      </div>
      {/* Correcting the image path for GitHub Pages */}
      <img src="/morgans-movie-time/assets/icons.png" alt="Icon" />
    </>
  );
};

export default Home;
