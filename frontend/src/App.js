import React from 'react';
import './styles/App.css'; // Import global CSS styles
import UploadEssay from './components/UploadEssay'; // Import the UploadEssay component

function App() {
  return (
    <div className="App">
      <header>
        <h1>Academic Essay Authenticity Checker</h1>
      </header>
      <UploadEssay /> {/* Render the UploadEssay component */}
    </div>
  );
}

export default App;
