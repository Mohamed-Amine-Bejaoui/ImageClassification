import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // Importing the CSS file

function App() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image.");
      return;
    }

    setLoading(true);  // Start loading

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.prediction) {
        alert("Unexpected response from server.");
        return;
      }

      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error uploading image:", error);
      if (error.response) {
        alert("Error: " + error.response.data.error);
      } else if (error.request) {
        alert("Error: No response from the server.");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);  // End loading
    }
  };

  // Dynamic styling based on prediction
  const resultStyle = {
    backgroundColor: prediction === 'happy' ? '#4CAF50' : prediction === 'sad' ? '#F44336' : '#ffffff',
    color: prediction === 'happy' || prediction === 'sad' ? '#ffffff' : '#000000',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    marginTop: '30px',
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">Happy or Sad Detector</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input className="file-input" type="file" onChange={handleImageChange} />
          <button className="submit-button" type="submit" disabled={loading}>Predict Emotion</button>
        </form>

        {loading ? <p className="loading">Loading...</p> : (
          prediction && (
            <div className="result" style={resultStyle}>
              <h2>Prediction: {prediction}</h2>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
