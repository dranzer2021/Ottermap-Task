import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchForm = ({ setUser }) => {
  const [formData, setFormData] = useState({ name: "", mobile: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (setUser) {
      setUser(formData);
    } else {
      console.error("setUser function is not available");
    }
    navigate("/header");
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-container">
        <input type="text" name="name" placeholder="First Name" onChange={handleChange} required />
        <input type="tel" name="mobile" placeholder="Mobile Number" onChange={handleChange} required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SearchForm;