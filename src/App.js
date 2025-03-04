import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchForm from "./SearchForm";
import MapPage from "./MapPage";
import "./App.css";

const App = () => {
  const [user, setUser] = useState({ name: "", mobile: "" });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchForm setUser={setUser} />} />
        <Route path="/header" element={<MapPage name={user.name} />} />
      </Routes>
    </Router>
  );
};

export default App;