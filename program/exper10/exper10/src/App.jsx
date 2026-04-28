import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null); // NEW

  // Handle input change + dynamic error clearing
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error dynamically when user fixes input
    let tempErrors = { ...errors };

    if (name === "name" && value.trim() !== "") {
      delete tempErrors.name;
    }

    if (name === "email" && value.includes("@")) {
      delete tempErrors.email;
    }

    if (name === "password" && value.length >= 6) {
      delete tempErrors.password;
    }

    if (name === "confirmPassword" && value === formData.password) {
      delete tempErrors.confirmPassword;
    }

    setErrors(tempErrors);
  };

  // Validation
  const validate = () => {
    let tempErrors = {};

    if (!formData.name.trim()) {
      tempErrors.name = "Name is required";
    }

    if (!formData.email.includes("@")) {
      tempErrors.email = "Valid email required";
    }

    if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validate()) {
      alert("Signup Successful!");

      setSubmittedData(formData); // store data

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

      setErrors({});
      setIsSubmitted(false);
    }
  };

  return (
    <div className="main">
      <div className="container">
        <h4>✨ Signup Form</h4>

        <form onSubmit={handleSubmit}>
          
          <input
            type="text"
            name="name"
            placeholder="👤 Name"
            value={formData.name}
            onChange={handleChange}
          />
          {isSubmitted && errors.name && (
            <p className="error">{errors.name}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="📧 Email"
            value={formData.email}
            onChange={handleChange}
          />
          {isSubmitted && errors.email && (
            <p className="error">{errors.email}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="🔒 Password"
            value={formData.password}
            onChange={handleChange}
          />
          {isSubmitted && errors.password && (
            <p className="error">{errors.password}</p>
          )}

          <input
            type="password"
            name="confirmPassword"
            placeholder="🔑 Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {isSubmitted && errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          <button type="submit">🚀 Signup</button>
        </form>

        {/* Display Submitted Data */}
        {submittedData && (
          <div className="result">
            <h2>✅ Submitted Data</h2>
            <p><strong>Name:</strong> {submittedData.name}</p>
            <p><strong>Email:</strong> {submittedData.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;