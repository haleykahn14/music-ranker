import React from 'react';
import axios from 'axios';

function App() {
  const fetchArtistData = async () => {
    try {
      // Replace '/api/artists' with the correct path and add the artist ID if needed
      const response = await axios.get('/api/artists');
      console.log(response.data);
      // Handle the response data as needed
    } catch (error) {
      console.error('Error fetching artist data:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchArtistData}>Fetch Artist Data</button>
    </div>
  );
}

export default App;
