import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Play from './components/Play';
import Submit from './components/Submit';
import Reveal from './components/Reveal';
import Info from './components/Info';

function App() {
  return (
    <Router basename="/morgans-movie-time">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/reveal" element={<Reveal />} />
        <Route path="/information" element={<Info />} />
      </Routes>
    </Router>
  );
}

export default App;
