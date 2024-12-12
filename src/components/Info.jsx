import React from "react";
import styles from "./info.module.css";
const Info = () => {
  return (
    <div>
      <div className={styles['info-bgimg']}></div> 
      <div className={styles['info-title']}>
        <h1>MORGAN'S MOVIE TIME</h1>
      </div>
      <div className={styles['info-instruction-box']}>
        <h1>How to Play</h1>
        <p>1. Click on the "PLAY" button to start the game.</p>
        <p>2. Guess the movie title based on the clues provided.</p>
        <p>3. You have 3 chances to guess the correct answer.</p>
        <p>4. If you answer incorrectly, your chances will decrease.</p>
        <p>5. Use the search box to help you find movie names.</p>
        <p>6. Have fun and enjoy the game!</p>
      </div>
    </div>
  );
};

export default Info;
